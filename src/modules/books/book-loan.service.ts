import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookLoan } from './entities/book-loan.entity';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BookLoanService {
  private readonly logger = new Logger(BookLoanService.name);

  constructor(
    @InjectRepository(BookLoan)
    private bookLoanRepository: Repository<BookLoan>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private redisService: RedisService,
  ) {}

  async borrowBook(user: User, bookId: string): Promise<BookLoan> {
    this.logger.debug(`开始借阅图书，用户ID: ${user.id}, 图书ID: ${bookId}`);

    if (!user.id) {
      throw new BadRequestException('用户ID不能为空');
    }

    try {
      // 使用事务确保数据一致性
      const result = await this.bookRepository.manager.transaction(
        async (transactionalEntityManager) => {
          // 查找图书（使用 SELECT FOR UPDATE 锁定记录）
          const book = await transactionalEntityManager.findOne(Book, {
            where: { id: parseInt(bookId) },
            lock: { mode: 'pessimistic_write' },
          });

          this.logger.debug(`查找到的图书: ${JSON.stringify(book)}`);

          if (!book) {
            throw new BadRequestException('图书不存在');
          }

          if (book.status !== 'available') {
            throw new BadRequestException(
              `图书当前不可借阅，状态为: ${book.status}`,
            );
          }

          // 检查用户是否有未归还的相同图书
          const existingLoan = await transactionalEntityManager.findOne(
            BookLoan,
            {
              where: {
                userId: user.id,
                bookId: book.id,
                returnDate: null,
              },
            },
          );

          this.logger.debug(
            `检查现有借阅记录 - 用户ID: ${user.id}, 图书ID: ${book.id}, 结果: ${JSON.stringify(
              existingLoan,
            )}`,
          );

          // 如果找到未归还的记录，则不允许再次借阅
          if (existingLoan) {
            throw new BadRequestException('您已借阅此书且未归还');
          }

          // 先更新图书状态为已借出
          await transactionalEntityManager.update(Book, book.id, {
            status: 'borrowed',
          });

          this.logger.debug(`已更新图书状态为borrowed`);

          // 创建并保存借阅记录
          const bookLoan = transactionalEntityManager.create(BookLoan, {
            userId: user.id,
            bookId: book.id,
            loanDate: new Date(),
            returnDate: null,
          });

          const savedLoan = await transactionalEntityManager.save(
            BookLoan,
            bookLoan,
          );
          this.logger.debug(`已保存借阅记录: ${JSON.stringify(savedLoan)}`);

          // 验证更新是否成功
          const updatedBook = await transactionalEntityManager.findOne(Book, {
            where: { id: book.id },
          });

          this.logger.debug(`更新后的图书状态: ${JSON.stringify(updatedBook)}`);

          if (updatedBook.status !== 'borrowed') {
            throw new Error('图书状态更新失败');
          }

          return savedLoan;
        },
      );

      // 清除相关缓存
      await this.redisService.del(`book:${bookId}`);
      await this.redisService.del('all_books');

      return result;
    } catch (error) {
      this.logger.error(`借阅图书失败: ${error.message}`);
      throw error;
    }
  }

  async returnBook(bookLoanId: number): Promise<void> {
    // 使用事务确保数据一致性
    await this.bookRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // 查找借阅记录（包括关联的图书信息）
        const bookLoan = await transactionalEntityManager.findOne(BookLoan, {
          where: { id: bookLoanId },
          relations: ['book'],
          lock: { mode: 'pessimistic_write' },
        });

        if (!bookLoan) {
          throw new BadRequestException('借阅记录不存在');
        }

        // 更新借阅记录的归还时间
        bookLoan.returnDate = new Date();
        await transactionalEntityManager.save(BookLoan, bookLoan);

        // 更新图书状态为可借阅
        await transactionalEntityManager.update(Book, bookLoan.bookId, {
          status: 'available',
        });

        // 清除相关缓存
        await this.redisService.del(`book:${bookLoan.bookId}`);
        await this.redisService.del('all_books');
      },
    );
  }

  // 添加这个方法来查询用户的借阅记录
  async getUserBookLoans(userId: number): Promise<BookLoan[]> {
    this.logger.debug(`查询用户借阅记录，用户ID: ${userId}`);

    const loans = await this.bookLoanRepository.find({
      where: {
        userId: userId,
        returnDate: null, // 只查找未归还的记录
      },
      relations: ['book'], // 加载关联的图书信息
    });

    this.logger.debug(`用户借阅记录: ${JSON.stringify(loans)}`);
    return loans;
  }
}
