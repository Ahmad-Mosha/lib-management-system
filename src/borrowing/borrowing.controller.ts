import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BorrowingService } from './borrowing.service';
import { CheckoutBookDto } from './dto/checkout-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('borrowing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('borrowing')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Check out a book to a borrower' })
  @ApiResponse({ status: 201, description: 'Book checked out successfully' })
  @ApiResponse({
    status: 400,
    description: 'Book not available or already checked out',
  })
  @ApiResponse({ status: 404, description: 'Book or borrower not found' })
  checkoutBook(@Body() checkoutBookDto: CheckoutBookDto) {
    return this.borrowingService.checkoutBook(checkoutBookDto);
  }

  @Post('return')
  @ApiOperation({ summary: 'Return a book from a borrower' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiResponse({ status: 404, description: 'No active checkout found' })
  returnBook(@Body() returnBookDto: ReturnBookDto) {
    return this.borrowingService.returnBook(returnBookDto);
  }

  @Get('borrower/:borrowerId/current-books')
  @ApiOperation({
    summary: 'Get current books borrowed by a specific borrower',
  })
  @ApiResponse({ status: 200, description: 'List of currently borrowed books' })
  @ApiResponse({ status: 404, description: 'Borrower not found' })
  getBorrowerCurrentBooks(@Param('borrowerId') borrowerId: string) {
    return this.borrowingService.getBorrowerCurrentBooks(borrowerId);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get all overdue books' })
  @ApiResponse({ status: 200, description: 'List of overdue books' })
  getOverdueBooks() {
    return this.borrowingService.getOverdueBooks();
  }

  @Get('records')
  @ApiOperation({ summary: 'Get all borrowing records' })
  @ApiResponse({ status: 200, description: 'List of all borrowing records' })
  getAllBorrowingRecords() {
    return this.borrowingService.getAllBorrowingRecords();
  }
}
