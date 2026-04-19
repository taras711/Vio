CREATE TABLE IF NOT EXISTS inspections (
    id VARCHAR(36) NOT NULL,
    locationId VARCHAR(36) NOT NULL,
    `interval` VARCHAR(255) NOT NULL,
    `assignedTo` VARCHAR(36) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    formId VARCHAR(36) NOT NULL,
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);