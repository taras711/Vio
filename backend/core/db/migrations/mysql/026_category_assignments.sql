CREATE TABLE IF NOT EXISTS category_assignments (
    id VARCHAR(36) NOT NULL,
    categoryId VARCHAR(36) NOT NULL,
    entityType VARCHAR(50) NOT NULL,
    entityId VARCHAR(36) NOT NULL,
    createdAt BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);