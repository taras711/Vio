CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) NOT NULL,
    locationId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    startTime BIGINT NOT NULL,
    endTime BIGINT NOT NULL,
    color VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id),
    KEY locationId (locationId)
)