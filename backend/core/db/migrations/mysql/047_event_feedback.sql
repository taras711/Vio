CREATE TABLE IF NOT EXISTS event_feedback (
    id VARCHAR(36) NOT NULL,
    eventId VARCHAR(36) NOT NULL,
    authorUserId VARCHAR(36) NOT NULL,

    visibility ENUM(
        'organizer_only',
        'selected_attendees',
        'all_attendees'
    ) NOT NULL DEFAULT 'organizer_only',

    visibleTo JSON NULL, -- pole userId, pokud visibility = selected_attendees

    message TEXT NOT NULL,

    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,

    PRIMARY KEY (id),
    KEY eventId (eventId),
    KEY authorUserId (authorUserId)
);
