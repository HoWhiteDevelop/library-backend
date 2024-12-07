import {
  Controller,
  Get,
  Param,
  Query,
  Logger,
  Post,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookLoanService } from './book-loan.service';
import { User } from '../users/entities/user.entity';

@ApiTags('图书管理')
@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);
  constructor(
    private readonly booksService: BooksService,
    private readonly bookLoanService: BookLoanService,
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

  @ApiOperation({ summary: '重建索引' })
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

  @ApiOperation({ summary: '添加测试数据' })
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

  @Post(':id/borrow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '借阅图书' })
  @ApiResponse({ status: 200, description: '借阅成功' })
  @ApiResponse({ status: 400, description: '图书不可借阅' })
  @ApiResponse({ status: 401, description: '未授权' })
  async borrowBook(@Param('id') bookId: string, @Request() req: any) {
    this.logger.debug(
      `收到借阅请求，用户: ${JSON.stringify(req.user)}, 图书ID: ${bookId}`,
    );

    try {
      // 确保用户ID存在
      if (!req.user?.userId) {
        throw new BadRequestException('用户ID不存在');
      }

      // 借阅图书，传入正确的用户ID
      const result = await this.bookLoanService.borrowBook(
        { id: req.user.userId } as User, // 只传入必要的用户信息
        bookId,
      );
      this.logger.debug(`借阅结果: ${JSON.stringify(result)}`);

      // 获取更新后的图书信息
      const updatedBook = await this.booksService.findOne(bookId);
      this.logger.debug(`更新后的图书信息: ${JSON.stringify(updatedBook)}`);

      return {
        success: true,
        message: '借阅成功',
        data: {
          loan: result,
          book: updatedBook,
        },
      };
    } catch (error) {
      this.logger.error(`借阅失败: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('loans/current')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '查询当前用户的借阅记录' })
  async getCurrentUserLoans(@Request() req: any) {
    const loans = await this.bookLoanService.getUserBookLoans(req.user.id);
    return {
      success: true,
      data: loans,
    };
  }

  /**
   * 获取用户的借阅历史
   * 包含图书详细信息和借阅状态
   */
  @Get('loans/history')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取用户借阅历史' })
  @ApiResponse({ status: 200, description: '成功获取借阅历史' })
  async getLoanHistory(@Request() req: any) {
    this.logger.debug(`获取用户借阅历史，用户ID: ${req.user.userId}`);
    try {
      const loanHistory = await this.bookLoanService.getUserLoanHistory(
        req.user.userId,
      );
      return {
        success: true,
        data: loanHistory,
      };
    } catch (error) {
      this.logger.error(`获取借阅历史失败: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
