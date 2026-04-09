/* backend/core/db/migrations/mysql/002_users.sql */
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  permissions TEXT,
  isActive TINYINT(1) NOT NULL,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL,
  personalNumber VARCHAR(255),
  lastLoginAt TEXT,
  failedLoginAttempts INT,
  mfaEnabled TINYINT(1) NOT NULL,
  avatarUrl VARCHAR(255),
  phoneNumber VARCHAR(255),
  position VARCHAR(255),
  department VARCHAR(255),
  section VARCHAR(255),
  workGroup VARCHAR(255),
  location VARCHAR(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;