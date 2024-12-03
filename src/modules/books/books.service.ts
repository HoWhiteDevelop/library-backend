import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { RedisService } from '../redis/redis.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

/**
 * 图书服务类
 * 处理所有与图书相关的业务逻辑，包括CRUD操作、缓存管理和搜索功能
 */
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>, // TypeORM的图书仓库
    private readonly redisService: RedisService, // Redis缓存服务
    private readonly elasticsearchService: ElasticsearchService, // ES搜索服务
  ) {}

  /**
   * 获取所有图书
   * 首先尝试从Redis缓存获取，如果没有则从数据库查询并缓存结果
   */
  async findAll() {
    // 尝试从Redis缓存获取
    const cachedBooks = await this.redisService.get('all_books');
    if (cachedBooks) {
      return JSON.parse(cachedBooks);
    }

    // 从数据库查询
    const books = await this.bookRepository.find();

    // 缓存结果（1小时过期）
    await this.redisService.set('all_books', JSON.stringify(books), 3600);

    return books;
  }

  /**
   * 通过ISBN查找图书
   * @param isbn - 图书的ISBN号
   */
  async findByIsbn(isbn: string) {
    const cacheKey = `book:${isbn}`;
    const cachedBook = await this.redisService.get(cacheKey);

    if (cachedBook) {
      return JSON.parse(cachedBook);
    }

    const book = await this.bookRepository.findOne({ where: { isbn } });

    if (book) {
      await this.redisService.set(cacheKey, JSON.stringify(book), 3600);
    }

    return book;
  }

  /**
   * 搜索图书
   * 使用Elasticsearch进行全文搜索
   * @param query - 搜索关键词
   */
  async search(query: string) {
    const result = await this.elasticsearchService.search({
      index: 'books',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['title', 'author', 'isbn', 'description'],
          },
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }

  /**
   * 创建新图书
   * @param bookData - 图书数据
   */
  async createBook(bookData: Partial<Book>): Promise<Book> {
    const newBook = this.bookRepository.create(bookData);
    const savedBook = await this.bookRepository.save(newBook);

    // 同步到Elasticsearch
    await this.elasticsearchService.index({
      index: 'books',
      id: savedBook.id.toString(),
      body: savedBook,
    });

    return savedBook;
  }

  /**
   * 更新图书信息
   * @param id - 图书ID
   * @param updateData - 更新的数据
   */
  async updateBook(id: number, updateData: Partial<Book>): Promise<Book> {
    await this.bookRepository.update(id, updateData);
    const updatedBook = await this.bookRepository.findOne({ where: { id } });

    if (!updatedBook) {
      throw new Error('Book not found');
    }

    // 同步更新到Elasticsearch
    await this.elasticsearchService.update({
      index: 'books',
      id: updatedBook.id.toString(),
      body: {
        doc: updateData,
      },
    });

    return updatedBook;
  }

  /**
   * 删除图书
   * @param id - 图书ID
   */
  async deleteBook(id: number): Promise<void> {
    await this.bookRepository.delete(id);

    // 从Elasticsearch中删除
    await this.elasticsearchService.delete({
      index: 'books',
      id: id.toString(),
    });
  }

  /**
   * 按状态查找图书
   * @param status - 图书状态（可借阅、已借出等）
   */
  async findByStatus(status: string): Promise<Book[]> {
    return this.bookRepository.find({ where: { status } });
  }

  /**
   * 按作者查找图书
   * @param author - 作者名
   */
  async findByAuthor(author: string): Promise<Book[]> {
    return this.bookRepository.find({ where: { author } });
  }

  /**
   * 按价格范围查找图书
   * @param min - 最低价格
   * @param max - 最高价格
   */
  async findByPriceRange(min: number, max: number): Promise<Book[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .where('book.price BETWEEN :min AND :max', { min, max })
      .getMany();
  }

  /**
   * 测试数据库连接
   * 用于健康检查
   */
  async testConnection(): Promise<{ status: string; message: string }> {
    try {
      await this.bookRepository.query('SELECT 1');
      return { status: 'connected', message: 'Database connection is working' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  /**
   * 高级搜索功能
   */
  async advancedSearch(
    query: string,
    fields: string[] = ['title', 'author', 'description'],
    from: number = 0,
    size: number = 10,
  ) {
    return this.elasticsearchService.search({
      index: 'books',
      body: {
        from,
        size,
        query: {
          multi_match: {
            query,
            fields,
            fuzziness: 'AUTO', // 启用模糊匹配
            operator: 'and', // 所有词都要匹配
          },
        },
        highlight: {
          // 高亮匹配的文本
          fields: {
            '*': {},
          },
        },
      },
    });
  }

  /**
   * 通过ID查找图书
   * @param id - 图书ID
   */
  async findOne(id: string): Promise<Book | null> {
    const cacheKey = `book:${id}`;
    const cachedBook = await this.redisService.get(cacheKey);

    if (cachedBook) {
      return JSON.parse(cachedBook);
    }

    const book = await this.bookRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (book) {
      await this.redisService.set(cacheKey, JSON.stringify(book), 3600);
    }

    return book;
  }

  /**
   * 查找相似图书
   */
  async findSimilarBooks(bookId: string) {
    const book = await this.findOne(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.elasticsearchService.search({
      index: 'books',
      body: {
        query: {
          more_like_this: {
            fields: ['title', 'author', 'description'],
            like: [
              {
                _index: 'books',
                _id: bookId,
              },
            ],
            min_term_freq: 1,
            max_query_terms: 12,
          },
        },
      },
    });
  }
}
