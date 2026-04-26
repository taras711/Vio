CREATE TABLE audit_results (
    id VARCHAR(36) NOT NULL,
    auditId VARCHAR(36) NOT NULL,
    fieldKey VARCHAR(255) NOT NULL,
    value TEXT NULL,
    createdAt BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (auditId) REFERENCES audit_instances(id) ON DELETE CASCADE
);