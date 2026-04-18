CREATE TABLE IF NOT EXISTS costs (
    id VARCHAR(36) NOT NULL,
    locationId VARCHAR(36) NOT NULL,
    laborCost FLOAT NOT NULL,
    partsCost FLOAT NOT NULL,
    totalCost FLOAT NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);