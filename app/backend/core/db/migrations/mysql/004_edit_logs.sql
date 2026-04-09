/* backend/core/db/migrations/mysql/004_edit_logs.sql */
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(36) NOT NULL,
  timestamp BIGINT NOT NULL,
  userId VARCHAR(36) NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity VARCHAR(255) NOT NULL,
  entityId VARCHAR(255) NOT NULL,
  userAgent VARCHAR(255),
  details TEXT,
  success TINYINT(1) NOT NULL DEFAULT 1,
  severity VARCHAR(255),
  ipAddress VARCHAR(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;