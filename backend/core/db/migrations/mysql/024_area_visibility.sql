CREATE TABLE IF NOT EXISTS area_visibility (
    areaId VARCHAR(36) NOT NULL,
    visibleAreaId VARCHAR(36) NOT NULL,
    PRIMARY KEY (areaId, visibleAreaId),
    FOREIGN KEY (areaId) REFERENCES areas(id) ON DELETE CASCADE,
    FOREIGN KEY (visibleAreaId) REFERENCES areas(id) ON DELETE CASCADE
);