db.createCollection("machines", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "isActive", "createdAt", "updatedAt"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        serialNumber: { bsonType: "string" },
        location: { bsonType: "string" },
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
        status: { bsonType: "string" },
        lastSeenAt: { bsonType: "string" },
        firmwareVersion: { bsonType: "string" },
        ownerUserId: { bsonType: "string" },
        tags: { bsonType: "array", items: { bsonType: "string" } },
      }
    }
  }
});