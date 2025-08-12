import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';
import { BooksModule } from './books/books.module';
import { BorrowersModule } from './borrowers/borrowers.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    BooksModule,
    BorrowersModule,
    BorrowingModule,
    ReportsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
