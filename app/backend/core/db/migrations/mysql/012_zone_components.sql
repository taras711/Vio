/* backend/core/db/migrations/mysql/012_zone_components.sql */
CREATE TABLE IF NOT EXISTS zone_components (
    id VARCHAR(36) NOT NULL,
    zoneId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)