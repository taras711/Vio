db.createCollection("audit_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["timestamp", "userId", "action", "entity", "entityId"],
      properties: {
        timestamp: { bsonType: "long" },
        userId: { bsonType: "string" },
        action: { bsonType: "string" },
        entity: { bsonType: "string" },
        entityId: { bsonType: "string" },
        details: { bsonType: "string" },
        userAgent: { bsonType: "string" },
        details: { bsonType: "string" },
        success: { bsonType: "bool" },
        severity: { bsonType: "string" },
      }
    }
  }
});

db.audit_logs.createIndex({ timestamp: -1 });