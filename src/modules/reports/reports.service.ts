import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { BookLoan } from '../books/entities/book-loan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(BookLoan)
    private bookLoanRepository: Repository<BookLoan>,
  ) {}

  async generateLoanReport(): Promise<Uint8Array> {
    const loans = await this.bookLoanRepository.find({
      relations: ['user', 'book'],
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Loan Report');

    worksheet.columns = [
      { header: 'Book Title', key: 'title', width: 30 },
      { header: 'Borrower', key: 'borrower', width: 30 },
      { header: 'Loan Date', key: 'loanDate', width: 15 },
      { header: 'Return Date', key: 'returnDate', width: 15 },
    ];

    loans.forEach((loan) => {
      worksheet.addRow({
        title: loan.book.title,
        borrower: loan.user.username,
        loanDate: loan.loanDate,
        returnDate: loan.returnDate,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Uint8Array(buffer);
  }
}
