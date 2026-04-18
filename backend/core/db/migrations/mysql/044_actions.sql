CREATE TABLE project_actions (
    id VARCHAR(36) NOT NULL,
    sectorId VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    assignedTo VARCHAR(36) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    dueDate BIGINT NULL,
    createdAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);