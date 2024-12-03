import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly client: Client;
  private maxRetries = 3;
  private retryDelay = 3000;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get('ES_NODE'),
      auth: {
        username: this.configService.get('ES_USERNAME'),
        password: this.configService.get('ES_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
      maxRetries: this.maxRetries,
      requestTimeout: 30000,
    });
  }

  async onModuleInit() {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        const info = await this.client.info();
        console.log('Elasticsearch 连接成功:', info);
        await this.initializeBookIndex();
        break;
      } catch (error) {
        retries++;
        console.error(
          `Elasticsearch 连接失败 (${retries}/${this.maxRetries}):`,
          error.message,
        );
        if (retries === this.maxRetries) {
          console.error('Elasticsearch 连接重试次数已达上限');
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  /**
   * 测试ES连接
   */
  async testConnection() {
    try {
      const info = await this.client.info();
      return {
        status: 'connected',
        message: 'Elasticsearch connection is working',
        version: info.version.number,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  /**
   * 初始化图书索引
   */
  async initializeBookIndex() {
    const indexExists = await this.client.indices.exists({
      index: 'books',
    });

    if (!indexExists) {
      return await this.client.indices.create({
        index: 'books',
        body: {
          settings: {
            analysis: {
              analyzer: {
                text_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'stop', 'snowball'],
                },
              },
            },
          },
          mappings: {
            properties: {
              title: {
                type: 'text',
                analyzer: 'text_analyzer',
                fields: {
                  keyword: {
                    type: 'keyword',
                  },
                },
              },
              author: {
                type: 'text',
                analyzer: 'text_analyzer',
              },
              isbn: { type: 'keyword' },
              description: {
                type: 'text',
                analyzer: 'text_analyzer',
              },
              price: { type: 'float' },
              publishDate: { type: 'date' },
              status: { type: 'keyword' },
            },
          },
        },
      });
    }
    return { message: 'Index already exists' };
  }

  /**
   * 重建所有图书的索引
   */
  async reindexAll(books: any[]) {
    const operations = books.flatMap((book) => [
      { index: { _index: 'books', _id: book.id } },
      book,
    ]);

    if (operations.length > 0) {
      const result = await this.client.bulk({
        refresh: true,
        operations,
      });

      return {
        message: `Indexed ${books.length} books`,
        errors: result.errors,
        items: result.items,
      };
    }

    return {
      message: 'No books to index',
    };
  }

  /**
   * 获取索引信息
   */
  async getIndexInfo() {
    const indexExists = await this.client.indices.exists({
      index: 'books',
    });

    if (!indexExists) {
      return {
        exists: false,
        message: 'Books index does not exist',
      };
    }

    const stats = await this.client.indices.stats({
      index: 'books',
    });

    const mapping = await this.client.indices.getMapping({
      index: 'books',
    });

    return {
      exists: true,
      stats: stats._all,
      mapping,
    };
  }

  /**
   * 搜索接口
   */
  async search(params: any) {
    return await this.client.search(params);
  }

  /**
   * 更新文档
   */
  async update(params: any) {
    return await this.client.update(params);
  }

  /**
   * 索引文档
   */
  async index(params: any) {
    return await this.client.index(params);
  }

  /**
   * 删除文档
   */
  async delete(params: any) {
    return await this.client.delete(params);
  }
}
