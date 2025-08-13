import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { BorrowingRecord } from './entities/borrowing-record.entity';
import { Book } from '../books/entities/book.entity';
import { Borrower } from '../borrowers/entities/borrower.entity';
import { CheckoutBookDto } from './dto/checkout-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(BorrowingRecord)
    private borrowingRepository: Repository<BorrowingRecord>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
  ) {}

  async checkoutBook(
    checkoutBookDto: CheckoutBookDto,
  ): Promise<BorrowingRecord> {
    const { bookId, borrowerId } = checkoutBookDto;

    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.availableQuantity <= 0) {
      throw new BadRequestException('Book is not available for checkout');
    }

    const borrower = await this.borrowerRepository.findOne({
      where: { id: borrowerId },
    });
    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }

    const existingCheckout = await this.borrowingRepository.findOne({
      where: {
        bookId,
        borrowerId,
        returnDate: IsNull(),
      },
    });

    if (existingCheckout) {
      throw new BadRequestException(
        'Borrower already has this book checked out',
      );
    }

    const checkoutDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(checkoutDate.getDate() + 14);

    const borrowingRecord = this.borrowingRepository.create({
      bookId,
      borrowerId,
      checkoutDate,
      dueDate,
      returnDate: null,
    });

    book.availableQuantity -= 1;
    await this.bookRepository.save(book);

    const savedRecord = await this.borrowingRepository.save(borrowingRecord);

    return await this.borrowingRepository.findOne({
      where: { id: savedRecord.id },
      relations: ['book', 'borrower'],
    });
  }

  async returnBook(returnBookDto: ReturnBookDto): Promise<BorrowingRecord> {
    const { bookId, borrowerId } = returnBookDto;

    const borrowingRecord = await this.borrowingRepository.findOne({
      where: {
        bookId,
        borrowerId,
        returnDate: IsNull(),
      },
      relations: ['book', 'borrower'],
    });

    if (!borrowingRecord) {
      throw new NotFoundException(
        'No active checkout found for this book and borrower',
      );
    }

    borrowingRecord.returnDate = new Date();

    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    book.availableQuantity += 1;
    await this.bookRepository.save(book);

    return await this.borrowingRepository.save(borrowingRecord);
  }

  async getBorrowerCurrentBooks(
    borrowerId: string,
  ): Promise<BorrowingRecord[]> {
    const borrower = await this.borrowerRepository.findOne({
      where: { id: borrowerId },
    });
    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }

    return await this.borrowingRepository.find({
      where: {
        borrowerId,
        returnDate: IsNull(),
      },
      relations: ['book'],
      order: { checkoutDate: 'DESC' },
    });
  }

  async getOverdueBooks(): Promise<BorrowingRecord[]> {
    const today = new Date();

    return await this.borrowingRepository.find({
      where: {
        returnDate: IsNull(),
        dueDate: LessThan(today),
      },
      relations: ['book', 'borrower'],
      order: { dueDate: 'ASC' },
    });
  }

  async getAllBorrowingRecords(): Promise<BorrowingRecord[]> {
    return await this.borrowingRepository.find({
      relations: ['book', 'borrower'],
      order: { createdAt: 'DESC' },
    });
  }
}
