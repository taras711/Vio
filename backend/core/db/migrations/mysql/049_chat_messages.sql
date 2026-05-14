CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(36) NOT NULL,
    threadId VARCHAR(36) NOT NULL,        -- eventId, taskId, docId...
    authorId VARCHAR(36) NOT NULL,        -- userId
    message TEXT NOT NULL,
    replyToId VARCHAR(36) NULL,           -- reference na jinou zprávu
    mentions TEXT NULL,                   -- JSON string (např. ["1","4"])
    reactions TEXT NULL,                  -- JSON string
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    chat_reactions_id VARCHAR(36) NULL,

    PRIMARY KEY (id),
    KEY threadId (threadId),
    KEY authorId (authorId),
    KEY replyToId (replyToId)
);
