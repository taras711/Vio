/* backend/core/db/migrations/mysql/007_roles.sql */
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    role_permissions TEXT,
    user_roles TEXT,
    PRIMARY KEY (id)
)