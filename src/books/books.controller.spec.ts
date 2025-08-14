import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
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
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '978-0-123456-78-9',
        totalQuantity: 5,
        shelfLocation: 'A1-B2',
      };

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(service.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return array of books', async () => {
      const mockBooks = [mockBook];
      mockBooksService.findAll.mockResolvedValue(mockBooks);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockBooks);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(service.findOne).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(result).toEqual(mockBook);
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      const mockBooks = [mockBook];
      mockBooksService.search.mockResolvedValue(mockBooks);

      const result = await controller.search('test');

      expect(service.search).toHaveBeenCalledWith('test');
      expect(result).toEqual(mockBooks);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      mockBooksService.remove.mockResolvedValue(undefined);

      await controller.remove('123e4567-e89b-12d3-a456-426614174000');

      expect(service.remove).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });
  });
});
