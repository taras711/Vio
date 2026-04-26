CREATE TABLE IF NOT EXISTS event_attendees (
    id VARCHAR(36) NOT NULL,
    eventId VARCHAR(36) NOT NULL,

    userId VARCHAR(36) NULL,
    roleId VARCHAR(36) NULL,
    sectorId VARCHAR(36) NULL,
    locationId VARCHAR(36) NULL,

    isOrganizer BOOLEAN NOT NULL DEFAULT FALSE,
    required BOOLEAN NOT NULL DEFAULT TRUE,

    status ENUM(
        'invited',
        'accepted',
        'declined',
        'tentative',
        'present',
        'absent',
        'checked_in',
        'checked_out',
        'late',
        'left_early'
    ) NOT NULL DEFAULT 'invited',

    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,

    PRIMARY KEY (id),
    KEY eventId (eventId),
    KEY userId (userId),
    KEY roleId (roleId),
    KEY sectorId (sectorId),
    KEY locationId (locationId)
);

