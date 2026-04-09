CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  permissions JSONB,
  isActive BOOLEAN NOT NULL
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  personalNumber VARCHAR(255),
  lastLoginAt TIMESTAMP,
  failedLoginAttempts INT,
  mfaEnabled BOOLEAN NOT NULL,
  avatarUrl VARCHAR(255),
  foneNumber VARCHAR(255),
  position VARCHAR(255),
  department VARCHAR(255),
  section VARCHAR(255),
  workGroup VARCHAR(255),
  location VARCHAR(255),
);