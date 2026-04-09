/* backend/core/db/migrations/mysql/016_skils.sql */
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(255) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    sectorId VARCHAR(36) NOT NULL,
    machineId VARCHAR(36) NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)