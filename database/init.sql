-- Library Management System - Initial Data
-- This script will run automatically when the database starts

-- Wait for tables to be created by the application, then insert seed data
-- Note: This runs before the app starts, so we'll create a separate seeding approach

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- This file ensures the database is ready
-- Actual seeding will be done by the NestJS application on startup