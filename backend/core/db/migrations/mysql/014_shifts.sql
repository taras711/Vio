/* backend/core/db/migrations/mysql/014_shifts.sql */
CREATE TABLE IF NOT EXISTS shifts (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    shiftLeaderId VARCHAR(36) NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)