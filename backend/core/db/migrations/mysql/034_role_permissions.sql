CREATE TABLE role_permissions (
    roleId VARCHAR(36) NOT NULL,
    permissionId VARCHAR(36) NOT NULL,
    PRIMARY KEY (roleId, permissionId),
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
);