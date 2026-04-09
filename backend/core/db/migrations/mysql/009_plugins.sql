/* backend/core/db/migrations/mysql/009_plugins.sql */
CREATE TABLE IF NOT EXISTS plugins (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    permissions TEXT,
    status VARCHAR(255), /* 1: Installed, 2: Active, 3: Inactive */
    sector VARCHAR(255), /* sector id (The plugin will be active only in the given sector) or all (The plugin will be active in all sectors)*/
    version VARCHAR(255),
    createdAt BIGINT NOT NULL,
    updatedAt BIGINT NOT NULL,
    PRIMARY KEY (id)
)