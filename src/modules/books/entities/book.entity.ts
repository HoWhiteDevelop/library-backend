import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BookLoan } from './book-loan.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ unique: true })
  isbn: string;

  @Column('text')
  description: string;

  @Column('float')
  price: number;

  @Column('date')
  publishDate: Date;

  @Column()
  status: string; // 'available', 'borrowed', etc.

  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.book)
  bookLoans: BookLoan[];
}
