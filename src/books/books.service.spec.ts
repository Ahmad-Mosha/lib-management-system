import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockBook = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Book',
    author: 'Test Author',
    isbn: '978-0-123456-78-9',
    totalQuantity: 5,
    availableQuantity: 5,
    shelfLocation: 'A1-B2',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '978-0-123456-78-9',
        totalQuantity: 5,
        shelfLocation: 'A1-B2',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBook);
      mockRepository.save.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { isbn: createBookDto.isbn },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createBookDto,
        availableQuantity: createBookDto.totalQuantity,
      });
      expect(result).toEqual(mockBook);
    });

    it('should throw ConflictException if ISBN already exists', async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '978-0-123456-78-9',
        totalQuantity: 5,
        shelfLocation: 'A1-B2',
      };

      mockRepository.findOne.mockResolvedValue(mockBook);

      await expect(service.create(createBookDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a book if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);

      const result = await service.findOne(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(result).toEqual(mockBook);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });

    it('should throw NotFoundException if book not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of books', async () => {
      const mockBooks = [mockBook];
      mockRepository.find.mockResolvedValue(mockBooks);

      const result = await service.findAll();

      expect(result).toEqual(mockBooks);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('remove', () => {
    it('should remove a book successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);
      mockRepository.remove.mockResolvedValue(mockBook);

      await service.remove('123e4567-e89b-12d3-a456-426614174000');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockBook);
    });
  });
});
