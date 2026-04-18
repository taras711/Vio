CREATE TABLE projects (
    id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    ownerId VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL, -- A3, Kaizen, Problem, Improvement...
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    teamId VARCHAR(36) NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);