import { Controller, Get, Post, Body } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';

@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  /**
   * 测试ES连接
   */
  @Get('test')
  async testConnection() {
    return this.elasticsearchService.testConnection();
  }

  /**
   * 初始化图书索引
   */
  @Post('init-index')
  async initializeIndex() {
    return this.elasticsearchService.initializeBookIndex();
  }

  /**
   * 重建所有图书的索引
   */
  @Post('reindex')
  async reindexAll(@Body() books: any[]) {
    return this.elasticsearchService.reindexAll(books);
  }

  /**
   * 获取索引信息
   */
  @Get('index-info')
  async getIndexInfo() {
    return this.elasticsearchService.getIndexInfo();
  }
}
