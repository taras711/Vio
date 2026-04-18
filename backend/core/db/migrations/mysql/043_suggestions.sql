CREATE TABLE project_suggestions (
    id VARCHAR(36) NOT NULL,
    sectorId VARCHAR(36) NOT NULL,
    authorId VARCHAR(36) NOT NULL,
    suggestionText TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, under_review, accepted, rejected
    createdAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);