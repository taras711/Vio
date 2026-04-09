/* backend/core/db/migrations/mysql/006_settings.sql */
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(36) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    val TEXT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)