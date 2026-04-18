CREATE TABLE role_profile_conditions (
    id VARCHAR(36) NOT NULL,
    profileId VARCHAR(36) NOT NULL,
    conditionType VARCHAR(50) NOT NULL, -- "area", "shift", "skill", "department", "custom"
    operator VARCHAR(20) NOT NULL,      -- "=", "!=", "in", "not_in", ">", "<"
    value TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (profileId) REFERENCES role_profiles(id) ON DELETE CASCADE
);