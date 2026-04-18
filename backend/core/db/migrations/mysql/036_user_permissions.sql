CREATE TABLE user_permissions (
    userId VARCHAR(36) NOT NULL,
    permissionId VARCHAR(36) NOT NULL,
    mode VARCHAR(10) NOT NULL, -- "allow" nebo "deny"
    PRIMARY KEY (userId, permissionId),
    FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
);