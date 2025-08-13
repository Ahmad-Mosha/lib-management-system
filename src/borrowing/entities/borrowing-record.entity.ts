import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Borrower } from '../../borrowers/entities/borrower.entity';

@Entity('borrowing_records')
export class BorrowingRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'book_id' })
  bookId: string;

  @Column({ name: 'borrower_id' })
  borrowerId: string;

  @Column({ name: 'checkout_date', type: 'date' })
  checkoutDate: Date;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'return_date', type: 'date', nullable: true })
  returnDate: Date | null;

  @ManyToOne(() => Book, (book) => book.borrowingRecords)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Borrower, (borrower) => borrower.borrowingRecords)
  @JoinColumn({ name: 'borrower_id' })
  borrower: Borrower;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
