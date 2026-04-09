/* backend/core/db/migrations/mysql/017_tasks.sql */
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) NOT NULL,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    createdBy VARCHAR(36) NOT NULL,
    status ENUM('open', 'inProgress', 'waiting', 'done', 'cancelled', 'failed') NOT NULL,
    dueDate BIGINT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    description TEXT NOT NULL,
    sectorId VARCHAR(36) NOT NULL,
    assignedTo VARCHAR(36),
    forMachineId VARCHAR(36) NULL,
    forShiftId VARCHAR(36) NULL,
    forZoneId VARCHAR(36) NULL,
    forSkillId VARCHAR(36) NULL,
    forGroupId VARCHAR(36) NULL,
    formId VARCHAR(36) NOT NULL,
    completedAt BIGINT NULL,
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)