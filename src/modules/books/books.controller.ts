import { Controller, Get, Param, Query, Logger, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('图书管理')
@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);
  constructor(
    private readonly booksService: BooksService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @ApiOperation({ summary: '获取所有图书' })
  @ApiResponse({ status: 200, description: '成功获取图书列表' })
  @Get()
  async findAll() {
    return this.booksService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '高级搜索' })
  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('fields') fields?: string,
    @Query('from') from?: number,
    @Query('size') size?: number,
  ) {
    this.logger.debug(
      `搜索参数: q=${query}, fields=${fields}, from=${from}, size=${size}`,
    );
    try {
      const result = await this.booksService.advancedSearch(
        query,
        fields?.split(','),
        Number(from) || 0,
        Number(size) || 10,
      );
      this.logger.debug('搜索结果:', result);
      return result;
    } catch (error) {
      this.logger.error('搜索错误:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: '通过ISBN查找图书' })
  @ApiResponse({ status: 200, description: '成功找到图书' })
  @ApiResponse({ status: 404, description: '图书未找到' })
  @Get(':isbn')
  async findByIsbn(@Param('isbn') isbn: string) {
    return this.booksService.findByIsbn(isbn);
  }

  @Post('reindex')
  async reindexAllBooks() {
    try {
      // 从数据库获取所有图书
      const books = await this.booksService.findAll();

      // 重建ES索引
      const result = await this.elasticsearchService.reindexAll(books);
      return {
        message: '重建索引完成',
        result,
      };
    } catch (error) {
      this.logger.error('重建索引错误:', error);
      throw error;
    }
  }

  @Post('test-data')
  async addTestData() {
    const testBooks = [
      {
        title: '深入理解计算机系统',
        author: 'Randal E. Bryant',
        isbn: '9787111544937',
        description: '计算机科学经典著作',
        price: 139.0,
        publishDate: new Date('2016-11-01'),
        status: 'available',
      },
      {
        title: 'JavaScript高级程序设计',
        author: 'Nicholas C. Zakas',
        isbn: '9787111376613',
        description: '前端开发经典教程',
        price: 99.0,
        publishDate: new Date('2012-03-29'),
        status: 'available',
      },
    ];

    for (const book of testBooks) {
      await this.booksService.createBook(book);
    }

    return { message: '测试数据添加完成' };
  }
}
