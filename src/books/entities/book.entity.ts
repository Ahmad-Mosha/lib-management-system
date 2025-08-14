import { BorrowingRecord } from '../../borrowing/entities/borrowing-record.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index('idx_book_title')
  title: string;

  @Column()
  @Index('idx_book_author')
  author: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ name: 'total_quantity' })
  totalQuantity: number;

  @Column({ name: 'available_quantity' })
  availableQuantity: number;

  @Column({ name: 'shelf_location' })
  shelfLocation: string;

  @OneToMany(() => BorrowingRecord, (borrowingRecord) => borrowingRecord.book)
  borrowingRecords: BorrowingRecord[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
