CREATE TABLE IF NOT EXISTS product_relations (
    id VARCHAR(36) NOT NULL,
    productId VARCHAR(36) NOT NULL,
    relatedProductId VARCHAR(36) NOT NULL,
    relationType VARCHAR(50) NOT NULL,
    createdAt BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (relatedProductId) REFERENCES products(id) ON DELETE CASCADE
);