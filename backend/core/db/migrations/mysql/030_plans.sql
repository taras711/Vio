CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sectorId VARCHAR(36) NOT NULL,
    `interval` VARCHAR(255) NOT NULL,
    lastPerformedAt BIGINT NOT NULL,
    nextDueAt BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL,
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);