CREATE TABLE IF NOT EXISTS areas (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sectorId VARCHAR(36) NOT NULL,
    description TEXT NULL DEFAULT ' ',
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);