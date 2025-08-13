import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('borrowers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('borrowers')
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new borrower' })
  @ApiResponse({ status: 201, description: 'Borrower registered successfully' })
  @ApiResponse({
    status: 409,
    description: 'Borrower with email already exists',
  })
  create(@Body() createBorrowerDto: CreateBorrowerDto) {
    return this.borrowersService.create(createBorrowerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all borrowers' })
  @ApiResponse({ status: 200, description: 'List of all borrowers' })
  findAll() {
    return this.borrowersService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search borrowers by name or email' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query('q') query: string) {
    return this.borrowersService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a borrower by ID' })
  @ApiResponse({ status: 200, description: 'Borrower found' })
  @ApiResponse({ status: 404, description: 'Borrower not found' })
  findOne(@Param('id') id: string) {
    return this.borrowersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a borrower' })
  @ApiResponse({ status: 200, description: 'Borrower updated successfully' })
  @ApiResponse({ status: 404, description: 'Borrower not found' })
  update(
    @Param('id') id: string,
    @Body() updateBorrowerDto: UpdateBorrowerDto,
  ) {
    return this.borrowersService.update(id, updateBorrowerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a borrower' })
  @ApiResponse({ status: 200, description: 'Borrower deleted successfully' })
  @ApiResponse({ status: 404, description: 'Borrower not found' })
  remove(@Param('id') id: string) {
    return this.borrowersService.remove(id);
  }
}
