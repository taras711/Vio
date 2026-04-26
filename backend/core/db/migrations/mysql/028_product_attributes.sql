CREATE TABLE IF NOT EXISTS product_attributes (
    id VARCHAR(36) NOT NULL,
    productId VARCHAR(36) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    `value` TEXT NOT NULL,
    createdAt BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);