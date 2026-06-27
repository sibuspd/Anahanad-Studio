# Chapter 7

# Authentication & Authorization Architecture

---

# 7.1 Introduction

Authentication is one of the foundational components of any enterprise application.

However, authentication should never be confused with business logic.

Anahanad Studio intentionally separates **identity management** from **music academy operations**.

Instead of embedding authentication details throughout business tables, the application delegates all authentication responsibilities to **Better Auth**, while the ERP manages educational data independently.

This separation results in a cleaner architecture, stronger security, easier maintenance, and greater scalability.

---

# 7.2 Authentication vs Business Data

A common mistake in beginner applications is mixing authentication with business entities.

For example:

```text
Teacher Table

id

name

email

password

role

department

subject

...
```

This approach tightly couples authentication with business data.

Anahanad Studio avoids this.

Instead:

```text
Authentication

──────────────

User

Session

Account

Verification


Business

──────────────

Departments

Subjects

Courses

Batches

Sessions

Attendance
```

The only bridge between the two layers is:

```
user.id
```

Everything else remains independent.

---

# 7.3 Why Better Auth?

Better Auth was selected because it provides a modern authentication framework with native support for:

- Email and Password Authentication
- OAuth Providers
- Session Management
- Secure Cookies
- Email Verification
- Password Reset
- Refresh Sessions
- PostgreSQL
- Drizzle ORM

Instead of implementing authentication from scratch, Anahanad Studio leverages Better Auth as a dedicated identity provider.

---

# 7.4 Authentication Architecture

The authentication subsystem consists of four core tables.

```text
                 User
                /    \
               /      \
         Session      Account

                |
                |
         Verification
```

Each table has a distinct responsibility.

---

# 7.5 User Table

## Purpose

The `user` table represents an authenticated identity within the system.

Every individual who accesses the application—whether an administrator, teacher, student, parent, or accountant—has exactly one user record.

Business entities do **not** duplicate identity information.

Instead, they reference the authenticated user through `user.id`.

---

### Key Fields

| Column | Purpose |
|----------|----------|
| id | Better Auth Primary Key |
| name | Full Name |
| email | Login Email |
| emailVerified | Email Verification Status |
| image | Profile Image URL |
| imageCldPubId | Cloudinary Public ID |
| role | User Role |
| createdAt | Creation Timestamp |
| updatedAt | Last Update Timestamp |

---

## Why `user.id` is Text

Unlike business tables that use integer identity columns,

Better Auth requires:

```text
user.id

↓

TEXT
```

Reasons:

- Universally unique identifiers
- OAuth compatibility
- No collisions
- Provider independence

Business tables simply reference this text identifier.

---

# 7.6 Supported Roles

Anahanad Studio currently defines seven user roles.

```text
SUPER_ADMIN

ADMIN

HOD

TEACHER

STUDENT

PARENT

ACCOUNTANT
```

These roles are implemented as a PostgreSQL enum.

```text
roleEnum
```

which guarantees that only valid roles can exist inside the database.

---

## Role Responsibilities

### Super Administrator

Responsible for:

- Platform management
- Global settings
- Complete system access
- User management
- Security configuration

---

### Administrator

Responsible for:

- Academy administration
- Departments
- Courses
- Teachers
- Student admissions

---

### Head of Department (HOD)

Responsible for:

- Department supervision
- Faculty coordination
- Subject management
- Academic planning

---

### Teacher

Responsible for:

- Conducting sessions
- Recording attendance
- Managing batches
- Uploading learning material
- Student interaction

---

### Student

Responsible for:

- Viewing enrolled batches
- Joining sessions
- Attendance history
- Course progress

---

### Parent

Responsible for:

- Monitoring student progress
- Viewing attendance
- Fee tracking (future)
- Communication

---

### Accountant

Responsible for:

- Fee management
- Payment tracking
- Financial reports
- Receipts
- Installments

---

# 7.7 Session Table

The `session` table stores active login sessions.

Important:

This table **does not** represent music classes.

It stores authentication sessions.

Example:

```text
Teacher

↓

Logs In

↓

New Session Created
```

If the teacher logs in from another device,

another session is created.

Thus,

```text
User

↓

Many Sessions
```

---

## Stored Information

Examples include:

- Session Token
- Expiration Time
- IP Address
- Browser Information
- User Reference

---

# 7.8 Account Table

The account table stores authentication provider information.

Examples:

```text
Email

Google

GitHub

Microsoft
```

Currently,

Anahanad Studio primarily supports:

Email + Password.

However,

future OAuth providers can be added without modifying the ERP schema.

---

## Why Separate Account?

A user may have multiple login providers.

Example:

```text
Rahul

↓

Email Login

↓

Google Login

↓

Microsoft Login
```

All belong to one user.

Hence:

```text
User

↓

Many Accounts
```

---

# 7.9 Verification Table

Temporary authentication data belongs here.

Examples:

- Email Verification

- OTP

- Password Reset

- Verification Tokens

Unlike user data,

verification records are temporary.

Most expire automatically.

---

# 7.10 Authentication Lifecycle

The login process follows this sequence.

```text
User

↓

Login Screen

↓

Better Auth

↓

Credentials Verified

↓

Session Created

↓

Cookie Issued

↓

Access Granted
```

The ERP is never involved in password validation.

---

# 7.11 Authorization (RBAC)

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Anahanad Studio implements **Role-Based Access Control (RBAC)**.

After login,

the user's role determines accessible modules.

Example:

```text
Teacher

↓

Can Record Attendance

Cannot Manage Departments
```

---

### Example Permission Matrix

| Module | Super Admin | Admin | HOD | Teacher | Student | Parent | Accountant |
|---------|-------------|-------|-----|----------|----------|---------|-------------|
| Departments | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ |
| Subjects | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ |
| Courses | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ |
| Batches | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ |
| Sessions | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ |
| Attendance | ✔ | ✔ | ✔ | ✔ | View | View | ✖ |
| Fees | ✔ | ✔ | ✖ | ✖ | View | View | ✔ |
| Users | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ |

---

# 7.12 Relationship with Business Tables

Authentication remains independent.

Business tables simply reference authenticated users.

```text
User

├──────────────► Batch.teacherId

├──────────────► Session.teacherId

├──────────────► Enrollment.studentId

└──────────────► Attendance.studentId
```

No passwords or login information are stored in business tables.

---

# 7.13 Future Profile Tables

The current architecture intentionally keeps the `user` table lightweight.

As the ERP grows, specialized profile tables may be introduced.

Examples:

```text
User

├── Teacher Profile

├── Student Profile

├── Parent Profile

└── Accountant Profile
```

These tables would store role-specific business information such as qualifications, instruments taught, guardian details, payroll data, or academic records.

This keeps authentication data separate from domain-specific information.

---

# 7.14 Security Principles

The authentication subsystem follows several security principles:

- Separation of Authentication and Business Logic
- Least Privilege Access
- Role-Based Authorization
- Secure Session Management
- Email Verification
- Provider Independence
- Cloud Image Separation
- Referential Integrity

These principles reduce the attack surface while simplifying long-term maintenance.

---

# 7.15 Authentication Sequence Diagram

```text
          User

            │

            ▼

     Login Form

            │

            ▼

      Better Auth

            │

            ▼

     Verify Credentials

            │

     ┌──────┴──────┐

     │             │

 Invalid        Valid

     │             │

     ▼             ▼

 Error      Create Session

                    │

                    ▼

            Issue Cookie

                    │

                    ▼

             Open Dashboard
```

---

# Chapter Summary

The authentication subsystem of Anahanad Studio is intentionally isolated from the ERP business model. Better Auth manages identity, sessions, providers, and verification, while the business schema focuses exclusively on educational and administrative data.

By combining Better Auth with PostgreSQL, Drizzle ORM, and Role-Based Access Control, the application achieves a secure, extensible authentication architecture capable of supporting future OAuth providers, profile extensions, and enterprise-grade authorization policies without impacting the core ERP design.