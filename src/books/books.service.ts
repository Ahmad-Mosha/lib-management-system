import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const book = this.bookRepository.create({
        ...createBookDto,
        availableQuantity: createBookDto.totalQuantity,
      });
      return await this.bookRepository.save(book);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new ConflictException('Book with this ISBN already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    try {
      Object.assign(book, updateBookDto);
      return await this.bookRepository.save(book);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Book with this ISBN already exists');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }

  async search(query: string): Promise<Book[]> {
    return await this.bookRepository.find({
      where: [
        { title: Like(`%${query}%`) },
        { author: Like(`%${query}%`) },
        { isbn: Like(`%${query}%`) },
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
