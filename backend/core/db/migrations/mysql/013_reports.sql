/* backend/core/db/migrations/mysql/013_reports.sql */
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    shiftId VARCHAR(36) NOT NULL,
    assetId VARCHAR(36) NOT NULL,
    shiftType VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    date BIGINT NOT NULL,
    proposedSolution VARCHAR(255),
    zoneId VARCHAR(36),
    message TEXT(999),
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)