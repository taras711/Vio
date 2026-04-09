CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  userId TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entityId TEXT NOT NULL,
  details TEXT,
  userAgent VARCHAR(255),
  details TEXT,
  success TINYINT(1) NOT NULL,
  severity VARCHAR(255),
);