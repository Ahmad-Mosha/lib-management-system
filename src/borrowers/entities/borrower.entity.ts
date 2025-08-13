import { BorrowingRecord } from 'src/borrowing/entities/borrowing-record.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('borrowers')
export class Borrower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'registered_date', type: 'date' })
  registeredDate: Date;

  @OneToMany(
    () => BorrowingRecord,
    (borrowingRecord) => borrowingRecord.borrower,
  )
  borrowingRecords: BorrowingRecord[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
