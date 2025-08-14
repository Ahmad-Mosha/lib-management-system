# 📚 Library Management System

A comprehensive RESTful API for managing library books, borrowers, and borrowing processes built with **NestJS**, **PostgreSQL**, and **Docker**.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Setup Options](#-setup-options)
  - [Option 1: Full Docker Setup (Recommended)](#option-1-full-docker-setup-recommended)
  - [Option 2: Docker Database Only](#option-2-docker-database-only)
  - [Option 3: Local Development](#option-3-local-development)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Core Features](#-core-features)
- [Bonus Features](#-bonus-features)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

## ✨ Features

### Core Functionality

- **📖 Book Management**: Add, update, delete, list, and search books
- **👥 Borrower Management**: Register, update, delete, and list borrowers
- **🔄 Borrowing Process**: Check out books, return books, track due dates
- **⏰ Overdue Tracking**: Automatic overdue book detection and reporting

### Advanced Features

- **🔐 JWT Authentication**: Secure API access with role-based authentication
- **📊 Analytics & Reports**: Borrowing analytics with date range filtering
- **📁 Data Export**: Export reports in CSV and Excel formats
- **🛡️ Rate Limiting**: API abuse prevention on critical endpoints
- **🔍 Advanced Search**: Case-insensitive search across multiple fields
- **📈 Performance Optimization**: Database indexing for fast queries

## 🛠 Tech Stack

- **Backend**: Node.js, NestJS, TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Validation**: class-validator
- **Rate Limiting**: @nestjs/throttler

## 📋 Prerequisites

- **Docker** and **Docker Compose** (for containerized setup)
- **Node.js 18+** and **npm** (for local development)
- **PostgreSQL 15+** (for local database setup)

## 🚀 Quick Start

The fastest way to get started:

```bash
git clone <repository-url>
cd library-management-system
./setup.sh
```

That's it! The application will be running at `http://localhost:3000` with pre-loaded test data.

## ⚙️ Setup Options

### Option 1: Full Docker Setup (Recommended)

**Perfect for**: Quick testing, production-like environment, reviewers

```bash
# Clone the repository
git clone <repository-url>
cd library-management-system

# Start everything with one command
docker-compose up --build

# Or use the setup script
chmod +x setup.sh
./setup.sh
```

**What you get:**

- ✅ PostgreSQL database
- ✅ NestJS application
- ✅ Pre-loaded test data
- ✅ Hot reloading enabled
- ✅ All dependencies handled

**Access:**

- API: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api/docs`

### Option 2: Docker Database Only

**Perfect for**: Local development with your preferred IDE

```bash
# Start only the database
docker-compose up postgres -d

# Install dependencies
npm install --legacy-peer-deps

# Start the application
npm run start:dev
```

**What you get:**

- ✅ PostgreSQL in Docker
- ✅ NestJS running locally
- ✅ Full development experience
- ✅ Direct debugging capabilities

### Option 3: Local Development

**Perfect for**: Full control over the environment

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up local PostgreSQL database
# Update .env with your database credentials

# Start the application
npm run start:dev
```

**Requirements:**

- Local PostgreSQL installation
- Manual database setup
- Environment configuration

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

### Pre-loaded Test Credentials

```json
{
  "username": "librarian",
  "password": "password123"
}
```

### Quick API Overview

| Endpoint                             | Method | Description           |
| ------------------------------------ | ------ | --------------------- |
| `/auth/login`                        | POST   | User authentication   |
| `/auth/register`                     | POST   | Register new user     |
| `/books`                             | GET    | List all books        |
| `/books/search`                      | GET    | Search books          |
| `/books`                             | POST   | Add new book          |
| `/borrowers`                         | GET    | List all borrowers    |
| `/borrowers`                         | POST   | Register borrower     |
| `/borrowing/borrowers/:id/checkout`  | POST   | Check out book        |
| `/borrowing/records/:id/return`      | POST   | Return book           |
| `/borrowing/overdue`                 | GET    | Get overdue books     |
| `/reports/export/overdue-last-month` | GET    | Export overdue report |

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication:

1. **Login** to get a token:

   ```bash
   POST /auth/login
   {
     "username": "librarian",
     "password": "password123"
   }
   ```

2. **Use the token** in subsequent requests:

   ```bash
   Authorization: Bearer <your-jwt-token>
   ```

3. **Protected endpoints**: All endpoints except `/auth/login` and `/auth/register` require authentication.

## 🎯 Core Features

### 📖 Books Management

- ✅ **Add books** with title, author, ISBN, quantity, shelf location
- ✅ **Update book details** including availability
- ✅ **Delete books** with validation
- ✅ **List all books** with pagination support
- ✅ **Search books** by title, author, or ISBN (case-insensitive)
- ✅ **Inventory tracking** with available vs total quantities

### 👥 Borrowers Management

- ✅ **Register borrowers** with name, email, registration date
- ✅ **Update borrower information**
- ✅ **Delete borrowers** with active loan validation
- ✅ **List all borrowers**
- ✅ **Search borrowers** by name or email

### 🔄 Borrowing Process

- ✅ **Check out books** with automatic due date calculation (14 days)
- ✅ **Return books** using borrowing record ID
- ✅ **Track current loans** per borrower
- ✅ **Prevent duplicate checkouts** by same borrower
- ✅ **Inventory management** with automatic quantity updates
- ✅ **Overdue detection** with automatic calculation

## 🎁 Bonus Features

### 📊 Analytics & Reporting

- ✅ **Borrowing analytics** for specific time periods
- ✅ **Overdue book reports** with detailed information
- ✅ **Export functionality** in CSV and Excel formats
- ✅ **Date range filtering** for historical data

### 🛡️ Security & Performance

- ✅ **Rate limiting** on login (5 attempts/minute) and search (20/minute)
- ✅ **Input validation** with comprehensive error handling
- ✅ **SQL injection prevention** through TypeORM
- ✅ **Database indexing** for optimized search performance

### 🐳 DevOps & Testing

- ✅ **Full Docker containerization** with docker-compose
- ✅ **Hot reloading** in development environment
- ✅ **Comprehensive unit tests** for Books module
- ✅ **Database seeding** with realistic test data
- ✅ **Health checks** and service dependencies

## 🗄️ Database Schema

The system uses a normalized PostgreSQL schema with proper relationships:

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│    Books    │    │ BorrowingRecords │    │  Borrowers  │
├─────────────┤    ├──────────────────┤    ├─────────────┤
│ id (UUID)   │◄──┤ book_id (FK)     │   ┌┤ id (UUID)   │
│ title       │    │ borrower_id (FK) ├──►│ name        │
│ author      │    │ checkout_date    │    │ email       │
│ isbn        │    │ due_date         │    │ reg_date    │
│ total_qty   │    │ return_date      │    └─────────────┘
│ avail_qty   │    └──────────────────┘
│ shelf_loc   │
└─────────────┘
```

### Key Features:

- **UUID primary keys** for better scalability
- **Proper foreign key relationships**
- **Indexed fields** for search performance
- **Audit timestamps** on all entities
- **Nullable return_date** for active loans

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Specific module tests
npm run test -- --testPathPattern=books

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Test Coverage

- ✅ **Books Service**: CRUD operations, validation, error handling
- ✅ **Books Controller**: Endpoint testing, authentication
- ✅ **Mock implementations** for database operations
- ✅ **Error scenario testing**

## 📁 Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── dto/               # Login/Register DTOs
│   ├── entities/          # User entity
│   ├── guards/            # JWT auth guard
│   └── strategies/        # JWT strategy
├── books/                 # Books management
│   ├── dto/               # Book DTOs
│   ├── entities/          # Book entity
│   └── *.spec.ts         # Unit tests
├── borrowers/             # Borrowers management
├── borrowing/             # Borrowing process
├── reports/               # Analytics & exports
├── database/              # Database seeding
└── config/                # Configuration files

docker-compose.yaml        # Container orchestration
Dockerfile                 # Application container
setup.sh                   # Quick setup script
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=library_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Application
PORT=3000
NODE_ENV=development
```

## 📊 Pre-loaded Test Data

The system comes with realistic test data:

- **👤 2 User accounts**: `librarian/password123`, `admin/admin123`
- **📚 5 Books**: Classic literature with varying availability
- **👥 4 Borrowers**: Registered library members
- **📋 5 Borrowing records**: Including 2 overdue books for testing
- **📈 Ready for reports**: Data spans multiple months for analytics

## 🚦 API Rate Limits

| Endpoint            | Limit              | Purpose                     |
| ------------------- | ------------------ | --------------------------- |
| `POST /auth/login`  | 5 requests/minute  | Prevent brute force attacks |
| `GET /books/search` | 20 requests/minute | Prevent search abuse        |
| All other endpoints | 10 requests/minute | General API protection      |

## 🎯 Usage Examples

### Authentication Flow

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "librarian", "password": "password123"}'

# 2. Use the returned token
curl -X GET http://localhost:3000/books \
  -H "Authorization: Bearer <your-token>"
```

### Book Management

```bash
# Add a new book
curl -X POST http://localhost:3000/books \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "author": "Author Name",
    "isbn": "978-1234567890",
    "totalQuantity": 3,
    "shelfLocation": "A1-B1"
  }'

# Search books
curl -X GET "http://localhost:3000/books/search?q=gatsby" \
  -H "Authorization: Bearer <token>"
```

### Borrowing Process

```bash
# Check out a book
curl -X POST http://localhost:3000/borrowing/borrowers/{borrowerId}/checkout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"bookId": "book-uuid-here"}'

# Return a book
curl -X POST http://localhost:3000/borrowing/records/{recordId}/return \
  -H "Authorization: Bearer <token>"
```

### Export Reports

```bash
# Download overdue books report (Excel)
curl -X GET "http://localhost:3000/reports/export/overdue-last-month?format=xlsx" \
  -H "Authorization: Bearer <token>" \
  --output overdue-report.xlsx

# Download borrowing report (CSV)
curl -X GET "http://localhost:3000/reports/export/borrowing-last-month?format=csv" \
  -H "Authorization: Bearer <token>" \
  --output borrowing-report.csv
```

## 🛠 Development Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Production
npm run build              # Build the application
npm run start:prod         # Start production server

# Database
docker-compose up postgres -d    # Start database only
docker-compose down -v           # Reset everything

# Linting & Formatting
npm run lint               # Check code style
npm run format             # Format code
```

## 🚀 Deployment

### Docker Production

```bash
# Build production image
docker build -t library-management .

# Run with production database
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS** for the amazing framework
- **TypeORM** for database abstraction
- **PostgreSQL** for reliable data storage
- **Docker** for containerization
- **Swagger** for API documentation

---

**Built with ❤️ for efficient library management**

For questions or support, please open an issue in the repository.
