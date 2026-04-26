CREATE TABLE audit_instances (
    id VARCHAR(36) NOT NULL,
    formId VARCHAR(36) NOT NULL,
    entityType VARCHAR(50) NOT NULL, -- machine, sector, training, process...
    entityId VARCHAR(36) NOT NULL,
    performedBy VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, done, cancelled
    createdAt BIGINT NOT NULL,
    completedAt BIGINT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (formId) REFERENCES forms(id)
);