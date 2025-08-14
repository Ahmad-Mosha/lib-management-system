import { Controller, Get, Res, UseGuards, Query } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overdue-last-month')
  @ApiOperation({ summary: 'Get overdue borrows from last month' })
  @ApiResponse({ status: 200, description: 'List of overdue borrows' })
  async getOverdueBorrowsLastMonth() {
    return await this.reportsService.getOverdueBorrowsLastMonth();
  }

  @Get('borrowing-last-month')
  @ApiOperation({ summary: 'Get all borrowing processes from last month' })
  @ApiResponse({ status: 200, description: 'List of borrowing processes' })
  async getBorrowingProcessesLastMonth() {
    return await this.reportsService.getAllBorrowingProcessesLastMonth();
  }

  @Get('export/overdue-last-month')
  @ApiOperation({
    summary: 'Download overdue borrows report',
    description:
      'Downloads a file with overdue borrowing records from last month. Choose CSV or Excel format.',
  })
  @ApiQuery({
    name: 'format',
    enum: ['csv', 'xlsx'],
    description: 'File format for download',
    required: false,
    example: 'xlsx',
  })
  @ApiResponse({
    status: 200,
    description: 'File download starts automatically',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
      'text/csv': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  async exportOverdueBorrowsLastMonth(
    @Query('format') format: 'csv' | 'xlsx' = 'xlsx',
    @Res() res: Response,
  ) {
    const data = await this.reportsService.getOverdueBorrowsLastMonth();
    const filename = `overdue-borrows-last-month-${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const csvData = this.reportsService.exportToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.csv"`,
      );
      res.send(csvData);
    } else {
      const excelBuffer = this.reportsService.exportToExcel(data, filename);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.xlsx"`,
      );
      res.send(excelBuffer);
    }
  }

  @Get('export/borrowing-last-month')
  @ApiOperation({
    summary: 'Download borrowing processes report',
    description:
      'Downloads a file with all borrowing records from last month. Choose CSV or Excel format.',
  })
  @ApiQuery({
    name: 'format',
    enum: ['csv', 'xlsx'],
    description: 'File format for download',
    required: false,
    example: 'xlsx',
  })
  @ApiResponse({
    status: 200,
    description: 'File download starts automatically',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
      'text/csv': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  async exportBorrowingProcessesLastMonth(
    @Query('format') format: 'csv' | 'xlsx' = 'xlsx',
    @Res() res: Response,
  ) {
    const data = await this.reportsService.getAllBorrowingProcessesLastMonth();
    const filename = `borrowing-processes-last-month-${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const csvData = this.reportsService.exportToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.csv"`,
      );
      res.send(csvData);
    } else {
      const excelBuffer = this.reportsService.exportToExcel(data, filename);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.xlsx"`,
      );
      res.send(excelBuffer);
    }
  }
}
