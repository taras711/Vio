CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) NOT NULL,
    locationId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    startTime BIGINT NOT NULL,
    endTime BIGINT NOT NULL,
    color VARCHAR(255) NOT NULL,
    type ENUM('event', "meeting", 'training', 'inspection', 'appointment') NOT NULL DEFAULT 'meeting',
    feedbackEnabled BOOLEAN NOT NULL DEFAULT TRUE,
    notifyOrganizerOnFeedback BOOLEAN NOT NULL DEFAULT TRUE,
    notifyAttendeesOnUpdate BOOLEAN NOT NULL DEFAULT TRUE,
    notifyAttendeesBeforeStart BOOLEAN NOT NULL DEFAULT FALSE,

    -- TRIGGER: Organizer: New reactions
    organizerFeedbackApp BOOLEAN NOT NULL DEFAULT TRUE,
    organizerFeedbackEmail BOOLEAN NOT NULL DEFAULT FALSE,

    -- TRIGGER: Attendees: Event updates
    attendeesUpdateApp BOOLEAN NOT NULL DEFAULT TRUE,
    attendeesUpdateEmail BOOLEAN NOT NULL DEFAULT FALSE,

    -- TRIGGER: Attendees: Before event starts
    attendeesBeforeStartApp BOOLEAN NOT NULL DEFAULT TRUE,
    attendeesBeforeStartEmail BOOLEAN NOT NULL DEFAULT FALSE,
    
    description TEXT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id),
    KEY locationId (locationId)
)