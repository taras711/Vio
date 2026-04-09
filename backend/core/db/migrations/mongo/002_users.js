db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash", "role", "isActive"],
      properties: {
        email: { bsonType: "string" },
        name: { bsonType: "string" },
        passwordHash: { bsonType: "string" },
        role: { bsonType: "string" },
        permissions: { bsonType: "array" },
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
        personalNumber: { bsonType: "string" },
        lastLoginAt: { bsonType: "string" },
        failedLoginAttempts: { bsonType: "int" },
        mfaEnabled: { bsonType: "bool" },
        avatarUrl: { bsonType: "string" },
        phoneNumber: { bsonType: "string" },
        position: { bsonType: "string" },
        department: { bsonType: "string" },
        section: { bsonType: "string" },
        workGroup: { bsonType: "string" },
        location: { bsonType: "string" },
      }
    }
  }
});

db.users.createIndex({ email: 1 }, { unique: true });