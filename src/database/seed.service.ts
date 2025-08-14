import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../books/entities/book.entity';
import { Borrower } from '../borrowers/entities/borrower.entity';
import { BorrowingRecord } from '../borrowing/entities/borrowing-record.entity';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    @InjectRepository(BorrowingRecord)
    private borrowingRepository: Repository<BorrowingRecord>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    this.logger.log('Starting database seeding...');

    // Check if data already exists
    const bookCount = await this.bookRepository.count();
    if (bookCount > 0) {
      this.logger.log('Database already seeded, skipping...');
      return;
    }

    // Seed Users (Librarians)
    await this.seedUsers();

    // Seed Books
    await this.seedBooks();

    // Seed Borrowers
    await this.seedBorrowers();

    // Seed Borrowing Records (including overdue)
    await this.seedBorrowingRecords();

    this.logger.log('Database seeding completed successfully!');
  }

  private async seedUsers() {
    const users = [
      {
        username: 'librarian',
        email: 'librarian@library.com',
        password: 'password123',
      },
    ];

    for (const userData of users) {
      const passwordHash = await bcrypt.hash(userData.password, 10);
      const user = this.userRepository.create({
        ...userData,
        passwordHash,
      });
      await this.userRepository.save(user);
    }

    this.logger.log('Users seeded successfully');
  }

  private async seedBooks() {
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        totalQuantity: 3,
        availableQuantity: 3,
        shelfLocation: 'A1-B2',
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        totalQuantity: 2,
        availableQuantity: 2,
        shelfLocation: 'A2-C1',
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-452-28423-4',
        totalQuantity: 4,
        availableQuantity: 4,
        shelfLocation: 'B1-A3',
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '978-0-14-143951-8',
        totalQuantity: 2,
        availableQuantity: 2,
        shelfLocation: 'C1-B2',
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '978-0-316-76948-0',
        totalQuantity: 3,
        availableQuantity: 3,
        shelfLocation: 'A3-C2',
      },
    ];

    for (const bookData of books) {
      const book = this.bookRepository.create(bookData);
      await this.bookRepository.save(book);
    }

    this.logger.log('Books seeded successfully');
  }

  private async seedBorrowers() {
    const borrowers = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        registeredDate: new Date('2024-01-15'),
      },
      {
        name: 'Emily Johnson',
        email: 'emily.johnson@email.com',
        registeredDate: new Date('2024-02-10'),
      },
      {
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        registeredDate: new Date('2024-03-05'),
      },
      {
        name: 'Sarah Davis',
        email: 'sarah.davis@email.com',
        registeredDate: new Date('2024-03-20'),
      },
    ];

    for (const borrowerData of borrowers) {
      const borrower = this.borrowerRepository.create(borrowerData);
      await this.borrowerRepository.save(borrower);
    }

    this.logger.log('Borrowers seeded successfully');
  }

  private async seedBorrowingRecords() {
    // Get seeded books and borrowers
    const books = await this.bookRepository.find();
    const borrowers = await this.borrowerRepository.find();

    if (books.length === 0 || borrowers.length === 0) {
      this.logger.warn(
        'No books or borrowers found, skipping borrowing records',
      );
      return;
    }

    const borrowingRecords = [
      // Active borrowing (not overdue)
      {
        bookId: books[0].id, // The Great Gatsby
        borrowerId: borrowers[0].id, // John Smith
        checkoutDate: new Date('2024-08-01'),
        dueDate: new Date('2024-08-15'),
        returnDate: null,
      },
      // Overdue borrowing (past due date)
      {
        bookId: books[1].id, // To Kill a Mockingbird
        borrowerId: borrowers[1].id, // Emily Johnson
        checkoutDate: new Date('2024-07-15'),
        dueDate: new Date('2024-07-29'), // Overdue!
        returnDate: null,
      },
      // Another overdue borrowing
      {
        bookId: books[2].id, // 1984
        borrowerId: borrowers[2].id, // Michael Brown
        checkoutDate: new Date('2024-07-10'),
        dueDate: new Date('2024-07-24'), // Very overdue!
        returnDate: null,
      },
      // Returned book (completed transaction)
      {
        bookId: books[3].id, // Pride and Prejudice
        borrowerId: borrowers[3].id, // Sarah Davis
        checkoutDate: new Date('2024-07-20'),
        dueDate: new Date('2024-08-03'),
        returnDate: new Date('2024-08-01'), // Returned on time
      },
      // Another returned book (returned late)
      {
        bookId: books[4].id, // The Catcher in the Rye
        borrowerId: borrowers[0].id, // John Smith (can borrow multiple)
        checkoutDate: new Date('2024-07-05'),
        dueDate: new Date('2024-07-19'),
        returnDate: new Date('2024-07-25'), // Returned late
      },
    ];

    for (const recordData of borrowingRecords) {
      const record = this.borrowingRepository.create(recordData);
      await this.borrowingRepository.save(record);

      // Update book availability for active borrows
      if (!recordData.returnDate) {
        const book = await this.bookRepository.findOne({
          where: { id: recordData.bookId },
        });
        if (book) {
          book.availableQuantity -= 1;
          await this.bookRepository.save(book);
        }
      }
    }

    this.logger.log(
      'Borrowing records seeded successfully (including overdue books)',
    );
  }
}
