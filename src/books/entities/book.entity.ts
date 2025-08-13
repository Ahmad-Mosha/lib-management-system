import { BorrowingRecord } from 'src/borrowing/entities/borrowing-record.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
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
