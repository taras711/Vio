CREATE TABLE IF NOT EXISTS task_history (
    id VARCHAR(36) NOT NULL,
    taskId VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)