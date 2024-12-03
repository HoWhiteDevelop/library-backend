import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookLoan } from './entities/book-loan.entity';
import { BooksService } from './books.service';
import { BookLoanService } from './book-loan.service';
import { RedisModule } from '../redis/redis.module';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';
import { BooksController } from './books.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, BookLoan]),
    RedisModule,
    ElasticsearchModule,
  ],
  providers: [BooksService, BookLoanService],
  controllers: [BooksController],
  exports: [BooksService, BookLoanService],
})
export class BooksModule {}
