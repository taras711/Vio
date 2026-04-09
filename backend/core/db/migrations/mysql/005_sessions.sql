/* backend/core/db/migrations/mysql/005_sessions.sql */
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL,
    createdAt BIGINT NOT NULL,
    lastActivityAt BIGINT NOT NULL,
    userAgent VARCHAR(255),
    isActive TINYINT(1) NOT NULL,
    expiresAt BIGINT NOT NULL,
    ipAddress VARCHAR(255),
    PRIMARY KEY (id)
)