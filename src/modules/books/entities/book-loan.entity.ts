import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from './book.entity';

@Entity()
export class BookLoan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookLoans)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Book, (book) => book.bookLoans)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column()
  bookId: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  loanDate: Date;

  @Column('datetime', { nullable: true })
  returnDate: Date | null;
}
