import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { BorrowingRecord } from '../borrowing/entities/borrowing-record.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(BorrowingRecord)
    private borrowingRepository: Repository<BorrowingRecord>,
  ) {}

  async getOverdueBorrowsLastMonth(): Promise<BorrowingRecord[]> {
    const now = new Date();
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(now.getMonth() - 1, 1); // First day of last month
    const lastMonthEnd = new Date();
    lastMonthEnd.setMonth(now.getMonth(), 0); // Last day of last month

    console.log('Overdue query range:', lastMonthStart, 'to', lastMonthEnd);

    // First, let's get all overdue records to debug
    const allOverdue = await this.borrowingRepository.find({
      where: {
        returnDate: null, // Still not returned
        dueDate: LessThan(now), // Past due date
      },
      relations: ['book', 'borrower'],
      order: { dueDate: 'ASC' },
    });

    console.log('All overdue records:', allOverdue.length);
    return allOverdue; // Return all overdue for now to test
  }

  async getAllBorrowingProcessesLastMonth(): Promise<BorrowingRecord[]> {
    // For now, let's get all borrowing records to test
    const allRecords = await this.borrowingRepository.find({
      relations: ['book', 'borrower'],
      order: { checkoutDate: 'DESC' },
    });

    console.log('All borrowing records:', allRecords.length);
    return allRecords;
  }

  exportToExcel(data: any[], filename: string): Buffer {
    // Transform data for Excel export
    const excelData = data.map((record) => ({
      'Borrowing ID': record.id,
      'Book Title': record.book?.title || 'N/A',
      'Book Author': record.book?.author || 'N/A',
      'Book ISBN': record.book?.isbn || 'N/A',
      'Borrower Name': record.borrower?.name || 'N/A',
      'Borrower Email': record.borrower?.email || 'N/A',
      'Checkout Date': record.checkoutDate,
      'Due Date': record.dueDate,
      'Return Date': record.returnDate || 'Not Returned',
      Status: record.returnDate ? 'Returned' : 'Active',
      'Days Overdue': record.returnDate
        ? 0
        : Math.max(
            0,
            Math.floor(
              (new Date().getTime() - new Date(record.dueDate).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          ),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    // Generate buffer
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  exportToCSV(data: any[]): string {
    if (data.length === 0) return '';

    // Transform data for CSV export
    const csvData = data.map((record) => ({
      'Borrowing ID': record.id,
      'Book Title': record.book?.title || 'N/A',
      'Book Author': record.book?.author || 'N/A',
      'Borrower Name': record.borrower?.name || 'N/A',
      'Borrower Email': record.borrower?.email || 'N/A',
      'Checkout Date': record.checkoutDate,
      'Due Date': record.dueDate,
      'Return Date': record.returnDate || 'Not Returned',
      Status: record.returnDate ? 'Returned' : 'Active',
    }));

    // Generate CSV
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map((row) => Object.values(row).join(',')).join('\n');

    return `${headers}\n${rows}`;
  }
}
