/* backend/core/db/migrations/mysql/008_permisions.sql */
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(36) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)