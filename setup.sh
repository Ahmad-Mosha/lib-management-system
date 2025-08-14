#!/bin/bash

echo "🚀 Setting up Library Management System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Building and starting containers..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "✅ Library Management System is ready!"
echo ""
echo "🌐 Application: http://localhost:3000"
echo "📚 API Documentation: http://localhost:3000/api/docs"
echo ""
echo "🔑 Default Login Credentials:"
echo "   Username: librarian"
echo "   Password: password123"
echo ""
echo "📊 Pre-loaded Test Data:"
echo "   - 5 Books (some available, some borrowed)"
echo "   - 4 Registered borrowers"
echo "   - 1 User accounts (librarian"
echo "   - 5 Borrowing records (including 2 OVERDUE books)"
echo "   - Ready for immediate testing!"
echo ""
echo "🛑 To stop: docker-compose down"