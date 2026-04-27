Vio

Overview

Vio is a modular backend-frontend platform for managing and controlling operational entities (e.g. devices, areas, components) within a single consistent system.

The goal is not just data recording, but controlled work with them:

- defined relationships between entities

- access and authorization control
- auditability of changes
- extensibility using modules

Vio is aimed at the role of an internal operational platform, not a general framework.

---

Core Principles

1. Modularity

The system is divided into:

- core – infrastructure (auth, DB, permissions, audit, licensing)
- modules – domain logic (e.g. machines, users, areas)

Modules are isolated and communicate via defined interfaces.

---

2. Domain Model

Vio works with a hierarchical and relational entity model, typically:

- Area / Zone / Sector

- Machine / Component

- User / Role

The model is designed to allow:

- mapping of real traffic

- expansion without interfering with the core

---

3. Access Control (RBAC)

Access to data and operations is controlled via:

- roles

- permissions

- resolver logic

Frontend and backend share the same permission model.

---

4. Auditability

Every significant operation can be:

- recorded

- traceable

- traceable

---

5. Extensibility

System functionality is extended through modules:

- each module contains its own logic, API and possibly UI

- core provides infrastructure, not business logic

---

Architecture

backend/
core/
auth/
db/
permissions/
audit/
modules/
modules/
<domain-modules>
api/

frontend/
core/
modules/

shared/
permissions/
version/

---

Database Layer

Vio includes an abstraction layer for multiple databases (e.g. SQL and NoSQL).

⚠️ Current status:

- multiple adapters exist
- full compatibility between databases is not guaranteed

Recommendation:

- use one primary database for production deployment

---

Current Status

The project is in the phase:

«WIP (Work in Progress)»

- architecture is defined
- basic modules exist
- system is not yet stabilized for production use

---

What Vio is NOT

- not a low-code platform
- not a universal framework for any project
- not a finished product

---

Roadmap (high-level)

- stabilization of the domain model
- definition of a clear use-case
- simplification of the database layer
- documentation of modules
- creation of a “golden path” scenario

---

Getting Started (conceptual)

1. Start the backend
2. Initialize the database
3. Log in as admin
4. Work with entities via modules

(exact steps will be added)

---

Philosophy

Vio is not designed as a quick fix for a single problem.

It is an attempt to create a long-term sustainable operational platform where:

- data has structure

- operations have rules

- the system is auditable

The price for this is higher complexity, which must be managed by documentation and clear scope.

---

Author Notes

The project is actively developed and the architecture may change.

The goal is to gradually move:

«from “system” → to “product”»
