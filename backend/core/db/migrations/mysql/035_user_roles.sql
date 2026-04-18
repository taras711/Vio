CREATE TABLE user_roles (
    userId VARCHAR(36) NOT NULL,
    roleId VARCHAR(36) NOT NULL,
    assignedAt BIGINT NOT NULL,
    expiresAt BIGINT NULL,
    PRIMARY KEY (userId, roleId),
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE
);