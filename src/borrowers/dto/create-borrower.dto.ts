import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBorrowerDto {
  @ApiProperty({ description: 'Borrower full name', example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Borrower email address',
    example: 'john.smith@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
