CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    areaId VARCHAR(36) NULL,
    sectorId VARCHAR(36) NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)