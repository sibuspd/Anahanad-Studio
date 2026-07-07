# Anahanad Studio
## Technical Architecture Documentation (Version 1.0)

> Online Music Classroom Management ERP

## Vision
Anahanad Studio is a specialized ERP for managing a music academy. It models the hierarchy:

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

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Refine
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- Express
- Better Auth
- Drizzle ORM
- PostgreSQL (Neon)
- Drizzle Kit

### Planned Integrations
- Arcjet
- Cloudinary
- Google Meet
- Google Calendar
- Payment Gateway

---

# Project Architecture

```text
AS-Frontend
├── pages
├── components
├── lib/schema.ts
├── constants
└── routes

AS-Backend
├── db
│   ├── schema
│   │    ├── auth.ts
│   │    └── app.ts
├── controllers
├── middleware
├── routes
└── services
```

# ERP Hierarchy

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

Student
    ↓
Enrollment
    ↓
Batch
```

# Authentication

Better Auth tables:

- user
- session
- account
- verification

Custom fields:

- role
- imageCldPubId

Roles:
- super_admin
- admin
- hod
- teacher
- student
- parent
- accountant

# Business Tables

- departments
- subjects
- courses
- batches
- class_sessions
- enrollments
- attendance

# Frontend Schemas

- facultySchema
- subjectSchema
- scheduleSchema
- courseSchema
- batchSchema
- sessionSchema
- enrollmentSchema
- attendanceSchema

# Database Concepts

- Primary Keys
- Foreign Keys
- One-to-Many Relations
- Unique Constraints
- Indexes
- PostgreSQL Enums
- JSONB
- Cascade Delete
- Restrict Delete

# Entity Relationship Diagram

```text
Department
      │
      ▼
Subject
      │
      ▼
Course
      │
      ▼
Batch
      ├────────► Teacher(User)
      │
      ▼
Class Session
      ├────────► Teacher(User)
      │
      ▼
Attendance
      ▲
      │
Enrollment
      ▲
      │
Student(User)
```

# Current Features

- Authentication architecture
- ERP database design
- Zod validation layer
- Refine forms
- Neon PostgreSQL integration
- Drizzle ORM schema
- Better Auth integration
- Initial CRUD scaffolding

# Roadmap

- Arcjet Middleware
- Cloudinary
- CRUD APIs
- Dashboards
- Reports
- Parent Portal
- Student Portal
- AI Scheduling
