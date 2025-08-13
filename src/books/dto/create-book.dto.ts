import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'Book title', example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Book author', example: 'F. Scott Fitzgerald' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'ISBN number', example: '978-0-7432-7356-5' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ description: 'Total quantity of books', example: 5 })
  @IsNumber()
  @IsPositive()
  totalQuantity: number;

  @ApiProperty({ description: 'Shelf location', example: 'A1-B2' })
  @IsString()
  @IsNotEmpty()
  shelfLocation: string;
}
