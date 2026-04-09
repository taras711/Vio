/* backend/core/db/migrations/mysql/011_zones.sql */
CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    machineId VARCHAR(36) NOT NULL,
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)