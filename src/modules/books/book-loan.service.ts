import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookLoan } from './entities/book-loan.entity';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookLoanService {
  constructor(
    @InjectRepository(BookLoan)
    private bookLoanRepository: Repository<BookLoan>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async borrowBook(user: User, bookId: number): Promise<BookLoan> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book || book.status !== 'available') {
      throw new Error('Book is not available');
    }

    const bookLoan = this.bookLoanRepository.create({
      user,
      book,
      loanDate: new Date(),
      returnDate: null,
    });

    book.status = 'borrowed';
    await this.bookRepository.save(book);

    return this.bookLoanRepository.save(bookLoan);
  }

  async returnBook(bookLoanId: number): Promise<void> {
    const bookLoan = await this.bookLoanRepository.findOne({
      where: { id: bookLoanId },
      relations: ['book'],
    });

    bookLoan.returnDate = new Date();
    bookLoan.book.status = 'available';

    await this.bookLoanRepository.save(bookLoan);
    await this.bookRepository.save(bookLoan.book);
  }
}
