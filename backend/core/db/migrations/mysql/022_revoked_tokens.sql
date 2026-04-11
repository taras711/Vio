CREATE TABLE IF NOT EXISTS revoked_tokens (
    jti VARCHAR(36) NOT NULL,
    revokedAt BIGINT NOT NULL,
    expiresAt BIGINT NOT NULL,
    PRIMARY KEY (jti),
    INDEX idx_revoked_tokens_expires (expiresAt)
);