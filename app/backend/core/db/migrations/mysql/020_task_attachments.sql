CREATE TABLE IF NOT EXISTS task_attachments (
    id VARCHAR(36) NOT NULL,
    taskId VARCHAR(36) NOT NULL,
    attachmentId VARCHAR(36) NOT NULL,
    filePath VARCHAR(255) NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)