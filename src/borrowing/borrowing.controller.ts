import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BorrowingService } from './borrowing.service';
import { CheckoutBookDto } from './dto/checkout-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('borrowing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('borrowing')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post('borrowers/:borrowerId/checkout')
  @ApiOperation({ summary: 'Check out a book to a borrower' })
  @ApiResponse({ status: 201, description: 'Book checked out successfully' })
  @ApiResponse({
    status: 400,
    description: 'Book not available or already checked out',
  })
  @ApiResponse({ status: 404, description: 'Book or borrower not found' })
  checkoutBook(
    @Param('borrowerId') borrowerId: string,
    @Body() checkoutBookDto: CheckoutBookDto,
  ) {
    return this.borrowingService.checkoutBook(borrowerId, checkoutBookDto);
  }

  @Post('records/:borrowingRecordId/return')
  @ApiOperation({ summary: 'Return a book using borrowing record ID' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiResponse({
    status: 404,
    description: 'No active checkout found with this ID',
  })
  returnBookByRecordId(@Param('borrowingRecordId') borrowingRecordId: string) {
    return this.borrowingService.returnBookByRecordId(borrowingRecordId);
  }

  @Get('borrowers/:borrowerId/current-books')
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
