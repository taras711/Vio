CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    assignedTo VARCHAR(36) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `interval` VARCHAR(255) NOT NULL,  -- Opraveno zde
    status VARCHAR(50) NOT NULL,
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    completedAt BIGINT NULL,
    PRIMARY KEY (id)
);