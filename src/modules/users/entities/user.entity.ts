import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BookLoan } from '../../books/entities/book-loan.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string; // 'admin' or 'reader'

  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.user)
  bookLoans: BookLoan[];
}
