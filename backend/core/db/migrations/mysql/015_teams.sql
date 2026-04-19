/* backend/core/db/migrations/mysql/015_teams_group.sql */
CREATE TABLE IF NOT EXISTS teams_groups (
    id VARCHAR(36) NOT NULL,
    leaderId VARCHAR(36) NOT NULL,
    name VARCHAR(36) NOT NULL,
    sectorId VARCHAR(36) NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);