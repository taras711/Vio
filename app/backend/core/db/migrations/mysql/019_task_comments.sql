CREATE TABLE IF NOT EXISTS task_comments (
    id VARCHAR(36) NOT NULL,
    taskId VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)