# Chapter 2

# Technology Stack & Architectural Decisions

---

## 2.1 Introduction

Selecting the correct technology stack is one of the most critical architectural decisions in enterprise software engineering.

Rather than choosing technologies based on popularity, Anahanad Studio adopts a stack that emphasizes:

- scalability
- maintainability
- strong typing
- modularity
- cloud readiness
- security
- developer productivity

Every framework, library, and service has been chosen based on its role within the overall architecture.

---

# 2.2 Overall Technology Stack

| Layer | Technology |
|----------|----------------------------|
| Language | TypeScript |
| Frontend | React 19 |
| Admin Framework | Refine |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Form Management | React Hook Form |
| Validation | Zod |
| Backend | Express.js |
| ORM | Drizzle ORM |
| Database | PostgreSQL |
| Cloud Database | Neon Serverless |
| Authentication | Better Auth |
| Image Storage | Cloudinary |
| Security | Arcjet |
| Deployment | Vercel + Railway (planned) |
| Version Control | Git + GitHub |

---

# 2.3 Why PERN Stack?

The project follows the PERN architecture.

PERN stands for:

PostgreSQL

↓

Express.js

↓

React

↓

Node.js

This architecture provides complete TypeScript compatibility across the frontend and backend while leveraging PostgreSQL's relational capabilities.

Advantages include:

- end-to-end TypeScript
- relational database support
- scalable APIs
- excellent ORM ecosystem
- production readiness

---

# 2.4 Why React?

React was selected because:

- component-based architecture
- virtual DOM
- ecosystem maturity
- excellent integration with Refine
- huge community support

Every page within Anahanad Studio is built using reusable React components.

Examples:

- Department List
- Subject List
- Create Course
- Create Batch
- Create Session
- Attendance Screen

Each page remains independent while sharing reusable UI components.

---

# 2.5 Why TypeScript?

TypeScript is used throughout the project.

Reasons:

• Static typing

• Better IntelliSense

• Compile-time error detection

• Easier refactoring

• Safer APIs

Example:

Instead of accepting any object,

the compiler already knows

```
CreateCourseDTO
```

contains

```
name

subjectId

durationMonths

feeAmount

description
```

This dramatically reduces runtime bugs.

---

# 2.6 Why Refine?

Refine acts as the administrative application framework.

Instead of manually building CRUD pages repeatedly,

Refine provides:

- routing
- resource management
- forms
- tables
- notifications
- authentication integration

Example resources:

```
Departments

Subjects

Courses

Batches

Sessions

Attendance
```

Each becomes a managed CRUD module.

---

# 2.7 Why TailwindCSS?

TailwindCSS enables utility-first styling.

Advantages:

- no CSS bloat
- responsive layouts
- consistent spacing
- reusable utility classes

Instead of writing

```
.card{
margin:20px;
padding:15px;
}
```

the component directly uses

```
className="p-4 m-5 rounded-xl"
```

making UI development significantly faster.

---

# 2.8 Why shadcn/ui?

shadcn/ui provides accessible, reusable components built upon Radix UI.

Examples used in the project:

- Dialog
- Select
- Input
- Form
- Table
- Button
- Card
- Badge

These components integrate seamlessly with:

React Hook Form

+

Zod

+

TailwindCSS

forming a highly productive UI layer.

---

# 2.9 Why React Hook Form?

Enterprise applications contain many forms.

Examples:

Create Teacher

Create Subject

Create Course

Create Batch

Create Session

Attendance

Enrollment

React Hook Form provides:

- uncontrolled inputs
- minimal re-rendering
- excellent performance
- Zod integration

making complex forms efficient.

---

# 2.10 Why Zod?

Zod performs runtime validation.

Every form has a schema.

Example:

```

courseSchema

facultySchema

sessionSchema

attendanceSchema

```

Instead of validating manually,

the schema guarantees:

✔ required fields

✔ minimum lengths

✔ enums

✔ numeric coercion

✔ strong typing

This eliminates duplicated validation logic.

---

# 2.11 Why Express.js?

Express serves as the backend API server.

Responsibilities:

- Authentication
- Authorization
- CRUD APIs
- Business logic
- File uploads
- Middleware
- Database interaction

It remains lightweight while allowing custom architecture.

---

# 2.12 Why PostgreSQL?

Music academy data is highly relational.

Example:

Department

↓

Subject

↓

Course

↓

Batch

↓

Session

↓

Attendance

Such relationships are naturally modeled in PostgreSQL.

Advantages:

- ACID compliance
- transactions
- foreign keys
- indexing
- normalization
- scalability

Unlike NoSQL databases,

relational integrity is extremely important for ERP systems.

---

# 2.13 Why Neon?

Neon provides serverless PostgreSQL.

Benefits:

- automatic backups
- branching
- instant provisioning
- scalable compute
- free development tier

It integrates directly with Drizzle ORM.

---

# 2.14 Why Drizzle ORM?

Drizzle was selected over Prisma because:

- SQL-first philosophy
- lightweight
- better TypeScript inference
- migration simplicity
- excellent Neon compatibility

Every table is defined directly in TypeScript.

Example:

```

departments

subjects

courses

batches

class_sessions

attendance

```

The schema itself becomes the single source of truth.

---

# 2.15 Why Better Auth?

Authentication is separated from business logic.

Better Auth manages:

- login
- registration
- OAuth
- sessions
- verification
- password reset

Business tables remain completely independent.

This separation follows enterprise architecture principles.

---

# 2.16 Why Cloudinary?

Images are never stored inside PostgreSQL.

Instead:

Cloudinary stores

Teacher images

↓

Course banners

↓

Session banners

↓

Student profile pictures

Only:

```
bannerUrl

bannerCldPubId
```

are stored inside PostgreSQL.

This keeps the database lightweight.

---

# 2.17 Why Arcjet?

Arcjet provides production-grade security.

It protects against:

- bots
- brute-force attacks
- spam
- abuse
- suspicious traffic

before requests even reach the business logic.

---

# 2.18 Why Git & GitHub?

Git provides:

- version history
- branching
- collaboration
- rollback

GitHub hosts:

- source code
- documentation
- releases
- issue tracking

The project follows a Git-based workflow throughout development.

---

# 2.19 Technology Integration Diagram

```text

                Browser

                   │

                   ▼

            React Frontend

                   │

         React Hook Form

                   │

                 Zod

                   │

                Refine

                   │

         REST API Requests

                   │

              Express API

                   │

          Arcjet Middleware

                   │

           Better Auth

                   │

            Drizzle ORM

                   │

         PostgreSQL (Neon)

```

---

# Chapter Summary

The Anahanad Studio technology stack has been carefully selected to build a modern, secure, scalable, cloud-native ERP platform.

Rather than relying on a monolithic framework, the architecture combines specialized technologies where each layer focuses on a single responsibility:

- React handles the user interface.
- Refine accelerates ERP CRUD development.
- React Hook Form and Zod ensure robust validation.
- Express manages backend services.
- Better Auth isolates authentication.
- Drizzle ORM bridges TypeScript and PostgreSQL.
- Neon provides scalable cloud-hosted relational storage.
- Cloudinary manages media assets.
- Arcjet protects the application at the middleware layer.

This layered approach minimizes coupling while maximizing maintainability, extensibility, and long-term scalability.