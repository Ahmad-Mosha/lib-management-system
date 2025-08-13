import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowingController } from './borrowing.controller';
import { BorrowingService } from './borrowing.service';
import { BorrowingRecord } from './entities/borrowing-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowingRecord])],
  controllers: [BorrowingController],
  providers: [BorrowingService],
  exports: [BorrowingService],
})
export class BorrowingModule {}
