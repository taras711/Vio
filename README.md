Meris

Overview

Meris is a system for managing, structuring and monitoring operational entities within an organized environment (e.g. production, infrastructure, technical units).

It allows you to model the real world using:

- hierarchical structure (areas, zones, sectors)

- devices and their components

- access and authorization control

- auditable change history

Meris is designed as a foundation for internal operational systems where control over data, relationships and changes is key.

---

Core Capabilities

Environment Structuring

- Hierarchical Division (Area → Zone → Sector)

- Physical or Logical Space Mapping

---

Entity Management

- Device Registration (Machine)

Component Management

- Entity Relationships

- Location within the Structure

---

Access Control

- Role-Based Access Control (RBAC)

- Central Permission Management

- Shared Model between Backend and Frontend

---

Audit and History

- Change Tracking

Operation Logging

Traceability of User Actions

---

Architecture

Meris is divided into:

- Core
System Infrastructure (Database, Authentication, Permissions, Audit, Licensing)

- Modules
Domain Logic (e.g. Device Management, Structures)

- API
Client Entry Point

- Frontend
React Application with Connection to Permission System

The Architecture is Modular, but Controlled by a Central Data Center model.

---

Database

The database layer forms the basis of the system:

- defines the domain model
- contains relationships between entities
- implements data historization

Migration serves as the main source of truth about the system structure.

⚠️ The system contains multiple database adapters, but it is recommended to use one primary database.

---

Current Status

- extensive data model is implemented
- backend infrastructure exists
- frontend is functional, but under development
- project is not ready for production deployment

---

Intended Use

Meris is suitable as a basis for:

- facility and infrastructure management
- accounting and operational systems
- internal business applications
- systems requiring auditability

---

Limitations

- complex data model → higher maintenance requirements
- partly experimental architectural decisions
- insufficient documentation

---

Direction

Further development focuses on:

- refinement of specific use-case
- simplification of architecture
- stabilization of database layer
- creation of clear workflow

---

Summary

Meris is a data-oriented system for managing and monitoring a structured environment and its entities, with an emphasis on relationships, control and history.

The goal is to gradually move from an internal system to a stable product.
