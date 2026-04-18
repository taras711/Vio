CREATE TABLE IF NOT EXISTS assets (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  serialNumber VARCHAR(255),
  location VARCHAR(255),
  isActive TINYINT(1) NOT NULL,
  createdAt BIGINT  NOT NULL,
  updatedAt BIGINT  NOT NULL,
  safety VARCHAR(255),
  ppe VARCHAR(255) NOT NULL, -- personal protective equipment
  status VARCHAR(255),
  lastSeenAt TEXT,
  firmwareVersion VARCHAR(255),
  ownerUserId VARCHAR(36),
  tags TEXT,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;