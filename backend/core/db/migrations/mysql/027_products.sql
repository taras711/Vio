CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);