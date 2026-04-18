CREATE TABLE role_profiles (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category VARCHAR(100) NULL, -- např. "maintenance", "quality", "production"
    priority INT NOT NULL DEFAULT 0,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);