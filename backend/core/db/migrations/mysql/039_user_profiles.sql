CREATE TABLE user_profiles (
    userId VARCHAR(36) NOT NULL,
    profileId VARCHAR(36) NOT NULL,
    assignedBy VARCHAR(36) NULL,
    assignedAt BIGINT NOT NULL,
    expiresAt BIGINT NULL,
    isTemporary BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (userId, profileId),
    FOREIGN KEY (profileId) REFERENCES role_profiles(id) ON DELETE CASCADE
);