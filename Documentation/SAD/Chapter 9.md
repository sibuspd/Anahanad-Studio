# Chapter 9

# Backend Architecture & API Design

---

# 9.1 Introduction

The backend of Anahanad Studio serves as the central processing layer of the ERP system. It is responsible for enforcing business rules, validating incoming requests, interacting with the PostgreSQL database, authenticating users, and exposing secure REST APIs to the frontend.

Unlike traditional monolithic CRUD applications, the backend follows a layered architecture where each layer has a single responsibility. This separation improves maintainability, scalability, testing, and long-term extensibility.

---

# 9.2 Backend Technology Stack

| Layer | Technology |
|---------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| ORM | Drizzle ORM |
| Authentication | Better Auth |
| Database | PostgreSQL (Neon Serverless) |
| Validation | Zod |
| Environment | dotenv |
| Database Migration | drizzle-kit |
| Future Security | Arcjet |
| Future File Storage | Cloudinary |

---

# 9.3 Backend Layered Architecture

```text
                  React Frontend
                        │
                        │
                 HTTP Request
                        │
                        ▼
                Express Router
                        │
                        ▼
                  Middleware
                        │
                        ▼
                 Route Handler
                        │
                        ▼
                 Business Service
                        │
                        ▼
                 Drizzle ORM
                        │
                        ▼
                PostgreSQL Database
```

Each request flows through every layer before data reaches the database.

---

# 9.4 Responsibilities of Each Layer

## Presentation Layer

Responsible for:

- Receiving HTTP requests
- Returning HTTP responses
- Parsing JSON
- Routing

This layer contains Express routes.

---

## Middleware Layer

Responsible for:

- Authentication
- Authorization
- Rate limiting
- Security headers
- Input sanitization
- Request logging
- Error handling

Every request passes through middleware before reaching business logic.

---

## Business Logic Layer

Responsible for enforcing academy rules.

Examples include:

- Creating a course
- Assigning teachers
- Creating batches
- Scheduling sessions
- Recording attendance
- Enrolling students

Business logic never resides inside routes.

---

## Data Access Layer

Responsible for:

- Query construction
- Transactions
- Inserts
- Updates
- Deletes
- Selects

Implemented using Drizzle ORM.

---

## Database Layer

Responsible for persistent storage.

Uses:

- PostgreSQL
- Neon Serverless

---

# 9.5 Request Lifecycle

Every frontend action follows a predictable lifecycle.

```text
User Clicks Button

↓

React Form

↓

REST API

↓

Express Route

↓

Middleware

↓

Controller

↓

Business Service

↓

Drizzle ORM

↓

PostgreSQL

↓

Database Response

↓

JSON Response

↓

Frontend Update
```

---

# 9.6 Express Folder Structure

The backend follows a modular organization.

```text
src/

│

├── db/

│     ├── schema/

│     ├── migrations/

│     └── index.ts

│

├── routes/

│

├── controllers/

│

├── services/

│

├── middleware/

│

├── utils/

│

├── lib/

│

├── config/

│

├── constants/

│

└── server.ts
```

Each folder has one clear responsibility.

---

# 9.7 Database Module

The database layer consists of:

```text
Drizzle ORM

↓

Schema

↓

Migration

↓

Database Client

↓

Queries
```

Current schema modules:

```text
auth.ts

app.ts
```

This separation isolates authentication from business entities.

---

# 9.8 Schema Organization

Instead of placing every table into one file,

the backend separates schemas into logical modules.

```text
schema/

├── auth.ts

└── app.ts
```

### auth.ts

Contains:

- user
- session
- account
- verification

### app.ts

Contains:

- departments
- subjects
- courses
- batches
- class_sessions
- enrollments
- attendance

This modular approach improves readability as the application grows.

---

# 9.9 API Resource Design

The REST API mirrors ERP entities.

Example endpoints:

```text
/api/departments

/api/subjects

/api/courses

/api/batches

/api/class-sessions

/api/enrollments

/api/attendance
```

Each resource exposes consistent CRUD operations.

---

# 9.10 REST API Convention

Each module follows predictable HTTP methods.

```text
GET

POST

PUT

PATCH

DELETE
```

Example:

```text
GET

/api/courses

↓

Retrieve all courses


POST

/api/courses

↓

Create new course


PUT

/api/courses/:id

↓

Update course


DELETE

/api/courses/:id

↓

Delete course
```

---

# 9.11 Why REST Instead of GraphQL?

The project intentionally adopts REST because:

- Simpler debugging
- Native browser support
- Easier integration with Refine
- Predictable endpoints
- Better learning experience
- Smaller development overhead

GraphQL remains a possible future enhancement.

---

# 9.12 Drizzle ORM Workflow

Every query follows the same lifecycle.

```text
Service

↓

Drizzle Query

↓

SQL Generation

↓

Neon PostgreSQL

↓

Result

↓

Type-safe Object
```

Developers rarely write raw SQL.

---

# 9.13 Database Migrations

Schema evolution is managed through Drizzle Kit.

Workflow:

```text
Modify Schema

↓

Generate Migration

↓

Review SQL

↓

Apply Migration

↓

Database Updated
```

This keeps database structure synchronized with code.

---

# 9.14 Environment Variables

Sensitive configuration is never hardcoded.

Examples include:

```text
DATABASE_URL

BETTER_AUTH_SECRET

BETTER_AUTH_URL

CLOUDINARY_URL

ARCJET_KEY

API_BASE_URL
```

These values remain outside source control.

---

# 9.15 Validation Pipeline

Every incoming request passes through multiple validation stages.

```text
Frontend Zod

↓

API Request

↓

Backend Validation

↓

Business Logic

↓

Database Constraints
```

This layered validation significantly reduces invalid data.

---

# 9.16 Error Handling Strategy

Errors are categorized into:

### Validation Errors

```text
400 Bad Request
```

---

### Authentication Errors

```text
401 Unauthorized
```

---

### Authorization Errors

```text
403 Forbidden
```

---

### Resource Errors

```text
404 Not Found
```

---

### Server Errors

```text
500 Internal Server Error
```

Centralized middleware will return standardized JSON responses.

---

# 9.17 Logging Strategy

Future logging layers will capture:

- Request URL
- User ID
- Execution Time
- Error Stack
- IP Address
- Timestamp

Logs simplify debugging and auditing.

---

# 9.18 File Upload Workflow (Planned)

Teacher profile images and session banners will follow this pipeline.

```text
Frontend

↓

Upload Widget

↓

Cloudinary

↓

Receive URL

↓

Receive Public ID

↓

Store in Database

↓

Display Image
```

Only metadata is stored inside PostgreSQL.

Images remain in Cloudinary.

---

# 9.19 Business Rules Enforcement

The backend enforces academy rules beyond database constraints.

Examples include:

- Student cannot enroll twice in the same batch.
- Session cannot exist without a valid batch.
- Teacher must exist before batch assignment.
- Attendance requires a valid enrollment.
- Deleted subjects cascade to courses.
- Protected teachers cannot be deleted while assigned to active batches.

These rules are implemented in the service layer.

---

# 9.20 Security Pipeline

Every API request will eventually pass through multiple security checkpoints.

```text
Request

↓

Arcjet

↓

Better Auth

↓

Authorization

↓

Validation

↓

Business Logic

↓

Database
```

Each layer protects against a different category of attacks.

---

# 9.21 Planned Backend Modules

The backend will eventually contain dedicated modules for:

```text
Authentication

Departments

Subjects

Courses

Batches

Class Sessions

Attendance

Enrollment

Faculty

Students

Parents

Dashboard

Reports

Notifications

Payments

Cloudinary

Calendar Integration
```

Each module remains independent while sharing common infrastructure.

---

# 9.22 Backend Component Diagram

```text
                    Express Server
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼

 Authentication      Business APIs      Middleware

        │                  │                  │

 Better Auth       CRUD Resources      Arcjet

        │                  │                  │

        └──────────────┬──────────────────────┘
                       ▼

                Drizzle ORM

                       ▼

              PostgreSQL (Neon)
```

---

# 9.23 Design Principles

The backend adheres to the following engineering principles:

- Separation of Concerns
- Layered Architecture
- Type Safety
- Modular Design
- Single Responsibility Principle
- RESTful Resource Design
- Database Normalization
- Security by Design
- Scalability
- Maintainability

These principles ensure that the backend remains extensible as the academy grows.

---

# Chapter Summary

The backend of Anahanad Studio is built around a layered architecture using Express.js, Drizzle ORM, Better Auth, and PostgreSQL. By separating routing, middleware, business logic, and data access, the system achieves a clean and maintainable design.

Authentication is isolated from business modules through dedicated schemas, while RESTful APIs expose consistent interfaces for every ERP entity. Future integrations such as Arcjet, Cloudinary, and Google Calendar will extend the backend without altering its foundational architecture.