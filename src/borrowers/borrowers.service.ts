import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Borrower } from './entities/borrower.entity';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';

@Injectable()
export class BorrowersService {
  constructor(
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
  ) {}

  async create(createBorrowerDto: CreateBorrowerDto): Promise<Borrower> {
    // Check if email already exists
    const existingBorrower = await this.borrowerRepository.findOne({
      where: { email: createBorrowerDto.email },
    });

    if (existingBorrower) {
      throw new ConflictException('Borrower with this email already exists');
    }

    const borrower = this.borrowerRepository.create({
      ...createBorrowerDto,
      registeredDate: new Date(),
    });

    return await this.borrowerRepository.save(borrower);
  }

  async findAll(): Promise<Borrower[]> {
    return await this.borrowerRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Borrower> {
    const borrower = await this.borrowerRepository.findOne({ where: { id } });
    if (!borrower) {
      throw new NotFoundException(`Borrower with ID ${id} not found`);
    }
    return borrower;
  }

  async update(
    id: string,
    updateBorrowerDto: UpdateBorrowerDto,
  ): Promise<Borrower> {
    const borrower = await this.findOne(id);

    // Check if email is being updated and already exists
    if (updateBorrowerDto.email && updateBorrowerDto.email !== borrower.email) {
      const existingBorrower = await this.borrowerRepository.findOne({
        where: { email: updateBorrowerDto.email },
      });

      if (existingBorrower) {
        throw new ConflictException('Borrower with this email already exists');
      }
    }

    Object.assign(borrower, updateBorrowerDto);
    return await this.borrowerRepository.save(borrower);
  }

  async remove(id: string): Promise<void> {
    const borrower = await this.findOne(id);
    await this.borrowerRepository.remove(borrower);
  }

  async search(query: string): Promise<Borrower[]> {
    return await this.borrowerRepository.find({
      where: [{ name: ILike(`%${query}%`) }, { email: ILike(`%${query}%`) }],
      order: { createdAt: 'DESC' },
    });
  }
}
