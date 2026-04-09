/* backend/core/db/migrations/mysql/018_forms.sql */
CREATE TABLE IF NOT EXISTS forms (
    id VARCHAR(36) NOT NULL,
    data TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    version VARCHAR(255) NOT NULL,
    createdBy VARCHAR(36) NOT NULL,
    updatedBy VARCHAR(36) NOT NULL,
    sectorId VARCHAR(36) NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)