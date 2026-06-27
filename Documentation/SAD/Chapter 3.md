# Chapter 3

# Overall System Architecture

---

## 3.1 Introduction

Anahanad Studio is designed as a modular, layered Enterprise Resource Planning (ERP) platform specifically tailored for music academies and online classroom management.

Unlike a simple CRUD application, the system separates concerns into independent architectural layers. Each layer has a single responsibility, enabling easier maintenance, testing, scalability, and future feature expansion.

The architecture follows a hybrid of:

- Layered Architecture
- Modular Architecture
- Client–Server Architecture
- Resource-Oriented API Design
- Domain-Driven Data Organization

This approach minimizes coupling while maximizing extensibility.

---

# 3.2 High-Level Architecture

The complete system consists of six major layers.

```text
                    USER
                      │
                      ▼
          React + Refine Frontend
                      │
          React Hook Form + Zod
                      │
                REST API Layer
                      │
          Express.js Backend API
                      │
     Authentication + Middleware Layer
        (Better Auth + Arcjet)
                      │
             Drizzle ORM Layer
                      │
            PostgreSQL (Neon Cloud)
```

Every request passes sequentially through these layers before reaching the database.

---

# 3.3 Layer Responsibilities

## Presentation Layer

Responsible for:

- User Interface
- Navigation
- Forms
- Dashboards
- Reports
- CRUD Screens

Technologies:

- React
- Refine
- TailwindCSS
- shadcn/ui

Example Pages:

- Dashboard
- Departments
- Subjects
- Courses
- Batches
- Sessions
- Attendance
- Faculty
- Students

---

## Validation Layer

Before data reaches the backend, every form undergoes validation.

Implemented using:

- Zod
- React Hook Form

Example validation schemas:

```text
facultySchema

subjectSchema

courseSchema

batchSchema

sessionSchema

attendanceSchema

enrollmentSchema
```

Benefits:

✔ Client-side validation

✔ Strong typing

✔ Prevents malformed requests

✔ Reusable validation logic

---

## API Layer

Responsible for communication between frontend and backend.

Uses:

RESTful APIs

Example:

```
GET /departments

POST /subjects

PUT /courses/:id

DELETE /sessions/:id
```

This layer contains no business rules.

It only transports validated data.

---

## Business Logic Layer

Implemented in Express.

Responsibilities include:

- Role authorization
- Scheduling
- Attendance rules
- Enrollment validation
- Invite code generation
- Capacity checks

This is where ERP logic lives.

---

## Data Access Layer

Implemented using:

Drizzle ORM

Responsibilities:

- Query generation
- Transactions
- Relationships
- Type safety

The application never writes raw SQL directly inside business services.

---

## Database Layer

Implemented using:

PostgreSQL

Hosted on:

Neon Serverless

Responsibilities:

- Permanent storage
- Constraints
- Foreign Keys
- Indexes
- Transactions
- ACID guarantees

---

# 3.4 Architectural Separation

The project intentionally separates Authentication from Business Data.

```text
Authentication

──────────────

user

session

account

verification


Business ERP

──────────────

departments

subjects

courses

batches

class_sessions

enrollments

attendance
```

This separation follows enterprise software design principles.

Authentication knows nothing about music classes.

Business modules know nothing about login providers.

---

# 3.5 Business Hierarchy

The ERP follows a strict educational hierarchy.

```text
Department

↓

Subject

↓

Course

↓

Batch

↓

Class Session

↓

Attendance
```

Example:

Keyboard Department

↓

Piano Subject

↓

Beginner Piano Course

↓

Weekend Batch

↓

Lesson 12

↓

Attendance

Every entity depends only upon its immediate parent.

---

# 3.6 Authentication Hierarchy

Authentication follows Better Auth architecture.

```text
User

│

├── Sessions

│

└── Accounts
```

Example:

Teacher

↓

Google Login

↓

Current Login Session

The authentication layer manages identity only.

---

# 3.7 Business Flow

The operational workflow inside the academy follows the sequence below.

```text
Administrator

↓

Create Department

↓

Create Subject

↓

Create Course

↓

Create Batch

↓

Assign Teacher

↓

Enroll Students

↓

Conduct Session

↓

Record Attendance
```

Each stage depends upon the completion of the previous stage.

---

# 3.8 Request Lifecycle

Every user action follows the same lifecycle.

```text
Browser

↓

React Component

↓

React Hook Form

↓

Zod Validation

↓

REST API

↓

Express Route

↓

Business Service

↓

Drizzle ORM

↓

PostgreSQL

↓

Response

↓

React UI Update
```

Validation occurs before any database interaction.

---

# 3.9 Modular Folder Architecture

The frontend is organized by business modules rather than by file type.

Example:

```text
src/

components/

pages/

departments/

subjects/

courses/

batches/

sessions/

attendance/

faculty/

students/

hooks/

constants/

lib/

schema.ts
```

Every feature owns its own screens and components.

---

# 3.10 Backend Folder Architecture

The backend follows the same modular philosophy.

```text
src/

db/

schema/

app.ts

auth.ts

routes/

controllers/

services/

middlewares/

validators/

utils/

config/
```

Business logic never resides inside routes.

Routes remain thin.

Services contain domain logic.

---

# 3.11 Why Layered Architecture?

Without layers:

```text
React

↓

Database
```

Business rules become scattered.

With layers:

```text
React

↓

API

↓

Business Logic

↓

ORM

↓

Database
```

Responsibilities remain isolated.

Benefits:

- easier debugging
- easier testing
- reusable services
- scalability
- cleaner code

---

# 3.12 Component Interaction

A typical "Create Session" request proceeds as follows.

```text
User

↓

Create Session Form

↓

sessionSchema

↓

POST /sessions

↓

Session Controller

↓

Session Service

↓

Drizzle ORM

↓

class_sessions Table

↓

Success Response
```

Each component has exactly one responsibility.

---

# 3.13 Future Scalability

The architecture supports adding modules without modifying existing ones.

Potential future modules include:

- Fees
- Payments
- Exams
- Certificates
- Live Classes
- Homework
- Announcements
- Notifications
- Student Portal
- Parent Portal
- Mobile App

These modules can plug into the existing layered architecture.

---

# 3.14 Architectural Principles Followed

The project adheres to several software engineering principles.

• Separation of Concerns

• Single Responsibility Principle

• DRY (Don't Repeat Yourself)

• Type Safety

• Modular Design

• Resource-Oriented APIs

• Database Normalization

• Authentication Isolation

• Strong Validation

• Layered Architecture

These principles collectively improve maintainability and long-term scalability.

---

# Chapter Summary

The Anahanad Studio architecture is intentionally layered to separate presentation, validation, business logic, authentication, persistence, and storage concerns.

Authentication and ERP business logic remain independent subsystems connected only through foreign key references to authenticated users. The educational hierarchy (Department → Subject → Course → Batch → Class Session → Attendance) mirrors the real-world workflow of a music academy, while the layered backend ensures that validation, authorization, and persistence remain isolated.

This architecture establishes a scalable foundation capable of supporting future modules such as payments, examinations, certificates, notifications, live classes, and mobile clients without requiring fundamental redesign.