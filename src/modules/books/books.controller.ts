import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('图书管理')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: '获取所有图书' })
  @ApiResponse({ status: 200, description: '成功获取图书列表' })
  @Get()
  async findAll() {
    return this.booksService.findAll();
  }

  @ApiOperation({ summary: '通过ISBN查找图书' })
  @ApiResponse({ status: 200, description: '成功找到图书' })
  @ApiResponse({ status: 404, description: '图书未找到' })
  @Get(':isbn')
  async findByIsbn(@Param('isbn') isbn: string) {
    return this.booksService.findByIsbn(isbn);
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
    return this.booksService.advancedSearch(
      query,
      fields?.split(','),
      from,
      size,
    );
  }
}
