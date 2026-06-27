# Chapter 5

# Database Architecture & Schema Design

---

# 5.1 Introduction

At the heart of every Enterprise Resource Planning (ERP) system lies a well-designed relational database.

Unlike traditional applications where data is stored in isolated collections, an ERP requires multiple business entities to interact while preserving consistency, integrity, and scalability.

For Anahanad Studio, PostgreSQL was selected as the relational database engine because the application models highly structured relationships between departments, subjects, courses, batches, faculty, students, enrollments, sessions, and attendance.

The database design follows three major principles:

- Normalization
- Referential Integrity
- Business-driven relationships

Every table has a single responsibility, and every relationship mirrors the workflow of a real-world music academy.

---

# 5.2 Database Technology Stack

| Component | Technology |
|-----------|------------|
| Database Engine | PostgreSQL |
| Cloud Provider | Neon Serverless |
| ORM | Drizzle ORM |
| Migration Tool | drizzle-kit |
| Query Language | SQL generated via Drizzle |
| Language | TypeScript |

---

# 5.3 Why PostgreSQL?

Anahanad Studio is fundamentally a relational application.

Consider the following questions:

- Which department owns Piano?
- Which subject belongs to Keyboard?
- Which course belongs to Piano?
- Which batch belongs to Beginner Piano?
- Which students belong to Weekend Batch?
- Which teacher conducted Lesson 8?
- Which students attended Lesson 8?

These questions naturally require joins across multiple entities.

PostgreSQL excels at modeling such relationships while ensuring:

- ACID-compliant transactions
- Foreign key constraints
- Cascading operations
- Rich indexing
- High-performance joins
- Strong consistency

These characteristics make PostgreSQL an ideal foundation for an educational ERP.

---

# 5.4 Why Drizzle ORM?

Drizzle ORM serves as the bridge between TypeScript and PostgreSQL.

Instead of writing raw SQL, tables are declared directly in TypeScript using strongly typed schemas.

Example:

```ts
export const departments = pgTable(...)
```

Advantages include:

- Compile-time type safety
- Automatic TypeScript inference
- Schema-first development
- Migration generation
- Minimal runtime overhead
- SQL-first philosophy

Every table definition becomes the single source of truth for both the database and the application.

---

# 5.5 Database Separation

One of the key architectural decisions in Anahanad Studio is separating **authentication data** from **business data**.

```text
                PostgreSQL Database

        ┌─────────────────────────────┐
        │     Authentication Schema   │
        ├─────────────────────────────┤
        │ user                        │
        │ session                     │
        │ account                     │
        │ verification                │
        └─────────────────────────────┘

                    │
                    │ references user.id
                    ▼

        ┌─────────────────────────────┐
        │       Business Schema       │
        ├─────────────────────────────┤
        │ departments                 │
        │ subjects                    │
        │ courses                     │
        │ batches                     │
        │ class_sessions              │
        │ enrollments                 │
        │ attendance                  │
        └─────────────────────────────┘
```

This separation follows enterprise software practices by isolating identity management from business operations.

---

# 5.6 Authentication Schema Overview

Authentication is implemented using Better Auth and consists of four core tables.

```text
user
 │
 ├─────────────┐
 │             │
 ▼             ▼
session     account

verification
```

Each table has a distinct responsibility:

### user

Stores identity information such as:

- name
- email
- password hash (through account)
- role
- profile image

### session

Tracks active login sessions.

Each login creates a new session record.

### account

Stores authentication provider details such as:

- email/password
- Google OAuth
- future providers

### verification

Stores temporary verification data including:

- email verification
- password reset
- OTP

These tables are maintained by Better Auth and are not coupled with the ERP hierarchy.

---

# 5.7 Business Schema Overview

The business database follows the educational hierarchy.

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
      │
      ▼
Class Session
      │
      ▼
Attendance

Student
      │
      ▼
Enrollment
      │
      ▼
Batch
```

This structure mirrors the operational flow of a music academy.

---

# 5.8 Complete Entity Relationship Diagram

```text
                Department
                     │
              (1 : N)
                     │
                     ▼
                  Subject
                     │
              (1 : N)
                     │
                     ▼
                  Course
                     │
              (1 : N)
                     │
                     ▼
                  Batch
              ┌──────┴──────┐
              │             │
              ▼             ▼
        Teacher(User)   Enrollment
                              │
                       Student(User)

                     │
              (1 : N)
                     │
                     ▼
              Class Session
                     │
              (1 : N)
                     │
                     ▼
                Attendance
```

---

# 5.9 Database Normalization

The schema is normalized to eliminate redundancy.

### First Normal Form (1NF)

Every field stores only atomic values.

Examples:

✔ subjectId

✔ teacherId

✔ feeAmount

No comma-separated lists or repeating groups are stored.

---

### Second Normal Form (2NF)

Each non-key attribute depends entirely on its primary key.

For example:

Course:

- durationMonths
- feeAmount
- level

depend only on:

course.id

and not on any other attribute.

---

### Third Normal Form (3NF)

No transitive dependencies exist.

Example:

Instead of storing:

Department Name

inside Courses,

the course stores only:

subjectId

and the department is derived through the relationship:

Course → Subject → Department.

This eliminates duplication and update anomalies.

---

# 5.10 Primary Keys

Each business entity uses an integer identity column.

Example:

```text
departments.id

subjects.id

courses.id

batches.id

class_sessions.id
```

Authentication is the exception.

Better Auth requires:

```text
user.id → text
```

This allows globally unique identifiers compatible with authentication providers.

---

# 5.11 Foreign Keys

Foreign keys preserve relationships between tables.

Example:

```text
subjects.departmentId

↓

departments.id
```

This ensures that every subject belongs to an existing department.

Similarly:

```text
courses.subjectId

↓

subjects.id
```

and so on throughout the hierarchy.

Foreign keys prevent orphan records and enforce referential integrity.

---

# 5.12 Database Constraints

The schema employs several categories of constraints:

### Primary Keys

Uniquely identify each row.

### Foreign Keys

Maintain relationships.

### Unique Constraints

Examples:

- subject.code
- department.code
- inviteCode
- (student_id, batch_id)
- (session_id, student_id)

### Default Values

Examples:

- timestamps
- capacity
- role
- session status

These defaults simplify inserts while ensuring consistency.

---

# 5.13 Indexing Strategy

Indexes are added to columns frequently used in joins or searches.

Examples include:

- department_id
- subject_id
- course_id
- batch_id
- teacher_id
- student_id
- session_id

Proper indexing reduces lookup time significantly as the database grows.

---

# 5.14 Timestamp Strategy

Every business table includes:

```text
created_at

updated_at
```

using a shared helper object.

Benefits:

- auditing
- reporting
- debugging
- synchronization
- future analytics

The `updated_at` column automatically refreshes whenever a record is modified.

---

# 5.15 Enumerations

Business rules are enforced through PostgreSQL enums.

Examples:

### Role

- super_admin
- admin
- hod
- teacher
- student
- parent
- accountant

### Course Level

- beginner
- intermediate
- advanced

### Session Status

- scheduled
- completed
- cancelled

### Attendance Status

- present
- absent

Enums prevent invalid values from entering the database.

---

# Chapter Summary

The database architecture of Anahanad Studio is designed around a normalized relational model that mirrors the workflow of a real music academy. Authentication data is isolated from business entities, while foreign keys and constraints preserve consistency across departments, subjects, courses, batches, sessions, enrollments, and attendance.

By combining PostgreSQL with Drizzle ORM, the project achieves strong type safety, maintainable schema definitions, and scalable database design suitable for enterprise-grade educational software.