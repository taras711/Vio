CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp BIGINT NOT NULL,
  userId UUID NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity VARCHAR(255) NOT NULL,
  entityId VARCHAR(255) NOT NULL,
  details TEXT,
  userAgent VARCHAR(255),
  details TEXT,
  success TINYINT(1) NOT NULL,
  severity VARCHAR(255),
);