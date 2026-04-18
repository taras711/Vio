CREATE TABLE role_profile_permissions (
    profileId VARCHAR(36) NOT NULL,
    permissionId VARCHAR(36) NOT NULL,
    mode VARCHAR(10) NOT NULL, -- "allow" nebo "deny"
    PRIMARY KEY (profileId, permissionId),
    FOREIGN KEY (profileId) REFERENCES role_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
);