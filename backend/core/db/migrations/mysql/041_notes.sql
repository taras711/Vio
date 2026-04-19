CREATE TABLE IF NOT EXISTS notes (
    id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    sectorId VARCHAR(36) NOT NULL,
    authorId VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);