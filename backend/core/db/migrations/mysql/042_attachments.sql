CREATE TABLE project_suggestion_attachments (
    id VARCHAR(36) NOT NULL,
    sectorId VARCHAR(36) NOT NULL,
    suggestionId VARCHAR(36) NOT NULL,
    fileId VARCHAR(36) NOT NULL,
    createdAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);