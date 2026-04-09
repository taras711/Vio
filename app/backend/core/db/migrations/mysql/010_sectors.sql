/* backend/core/db/migrations/mysql/010_sectors.sql */
CREATE TABLE IF NOT EXISTS sectors (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    parentSectorId VARCHAR(36),
    permissions TEXT,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)