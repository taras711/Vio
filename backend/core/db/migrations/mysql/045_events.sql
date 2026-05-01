CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) NOT NULL,
    locationId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    startTime BIGINT NOT NULL,
    endTime BIGINT NOT NULL,
    color VARCHAR(255) NOT NULL,
    type ENUM('event', "meeting", 'training', 'inspection', 'appointment') NOT NULL DEFAULT 'meeting',
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id),
    KEY locationId (locationId)
)