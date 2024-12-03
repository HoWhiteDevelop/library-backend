import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from './book.entity';

@Entity()
export class BookLoan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookLoans)
  user: User;

  @ManyToOne(() => Book, (book) => book.bookLoans)
  book: Book;

  @Column('date')
  loanDate: Date;

  @Column('date')
  returnDate: Date;
}
