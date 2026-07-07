# Chapter 6

# Database Design Specification (DDS)

---

# 6.1 Introduction

This chapter provides a detailed specification of every database entity used within Anahanad Studio.

Unlike the previous chapter, which discussed the database architecture at a conceptual level, this chapter documents each table individually from both a technical and business perspective.

Each entity description includes:

- Business Purpose
- Table Responsibility
- Primary Key
- Foreign Keys
- Important Attributes
- Relationships
- Constraints
- Indexes
- Future Extension Possibilities

The database follows a normalized relational design implemented using PostgreSQL and Drizzle ORM.

---

# 6.2 Complete Database Overview

The complete database currently consists of two logical groups.

```text
Authentication

──────────────

User
Session
Account
Verification



Business ERP

──────────────

Departments
Subjects
Courses
Batches
Class Sessions
Enrollments
Attendance
```

Authentication tables are maintained by Better Auth.

Business tables implement the ERP.

Both are connected through:

```
user.id
```

which acts as the identity reference for teachers, students, administrators and accountants.

---

# 6.3 Department Table

## Purpose

The Department table represents the highest academic division inside the academy.

Every subject belongs to exactly one department.

Examples:

- Keyboard
- Strings
- Percussions
- Vocals
- Fine Arts

---

### Primary Key

```
id
```

(Integer Identity)

---

### Columns

| Column | Type | Description |
|---------|------|-------------|
| id | Integer | Primary Key |
| code | Varchar(50) | Unique Department Code |
| name | Varchar(80) | Department Name |
| description | Varchar(500) | Department Description |
| created_at | Timestamp | Creation Timestamp |
| updated_at | Timestamp | Last Update Timestamp |

---

### Relationships

```text
Department

1

↓

N

Subjects
```

---

### Constraints

- code UNIQUE
- id PRIMARY KEY

---

### Business Rule

A department may contain multiple subjects but a subject cannot belong to multiple departments.

---

### Example Record

| Code | Name |
|------|------|
| KEYS | Keyboard |
| STR | Strings |
| VOC | Vocals |

---

# 6.4 Subject Table

## Purpose

Subjects represent individual disciplines taught inside a department.

Examples:

- Piano

- Guitar

- Violin

- Tabla

- Drums

---

### Parent Entity

Department

---

### Child Entity

Course

---

### Columns

| Column | Description |
|---------|-------------|
| id | Primary Key |
| departmentId | FK → Department |
| code | Subject Code |
| name | Subject Name |
| description | Description |
| timestamps | Audit Fields |

---

### Relationships

```text
Department

↓

Subject

↓

Course
```

---

### Business Rule

Every subject must belong to one department.

Deleting a department is restricted if subjects exist.

---

### Example

Keyboard

↓

Piano

Keyboard

↓

Electronic Keyboard

Keyboard

↓

Synthesizer

---

# 6.5 Course Table

## Purpose

A course represents a structured learning program.

Unlike subjects,

courses define

- syllabus
- duration
- fees
- level

Examples

Beginner Piano

Intermediate Piano

Advanced Piano

---

### Parent Entity

Subject

---

### Child Entity

Batch

---

### Columns

| Column | Description |
|---------|-------------|
| id | Primary Key |
| subjectId | FK |
| name | Course Name |
| description | Course Description |
| level | Beginner / Intermediate / Advanced |
| durationMonths | Duration |
| feeAmount | Course Fee |
| timestamps | Audit Fields |

---

### Relationships

```text
Subject

1

↓

N

Courses
```

---

### Business Rule

Courses do not contain students.

Students join batches,

not courses directly.

---

# 6.6 Batch Table

## Purpose

A batch groups students studying together.

Unlike courses,

batches define scheduling.

Examples

Kids Batch

Weekend Batch

Evening Batch

---

### Parent

Course

---

### Child

Class Sessions

---

### Teacher

User

---

### Columns

| Column | Description |
|---------|-------------|
| id | Primary Key |
| courseId | FK |
| teacherId | FK(User) |
| name | Batch Name |
| capacity | Student Capacity |
| schedule | Weekly Schedule |
| timestamps | Audit Fields |

---

### Relationships

```text
Course

↓

Batch

↓

Sessions
```

---

### Business Rule

One teacher normally manages one batch.

However,

individual sessions may assign substitute teachers.

---

### Example

Weekend Piano Batch

Teacher:

Anand Sirsat

Capacity:

20

Schedule:

Saturday

5 PM

---

# 6.7 Class Session Table

## Purpose

Represents one actual class conducted.

Every attendance record belongs to a session.

---

### Parent

Batch

---

### Child

Attendance

---

### Columns

| Column | Description |
|---------|-------------|
| id | Primary Key |
| batchId | FK |
| courseId | FK |
| teacherId | FK(User) |
| name | Lesson Name |
| description | Description |
| sessionDate | Date |
| startTime | Time |
| endTime | Time |
| bannerUrl | Cloudinary URL |
| bannerCldPubId | Cloudinary Public ID |
| inviteCode | Unique Invite |
| status | Scheduled / Completed / Cancelled |
| timestamps | Audit |

---

### Relationships

```text
Batch

↓

Session

↓

Attendance
```

---

### Business Rule

Each session belongs to exactly one batch.

A batch can contain unlimited sessions.

---

### Example

Weekend Piano Batch

↓

Lesson 07

↓

Saturday

↓

5 PM

---

# 6.8 Enrollment Table

## Purpose

Represents which students belong to which batch.

This is a junction table.

---

### Parent

Student(User)

Batch

---

### Child

None

---

### Columns

| Column | Description |
|---------|-------------|
| id | Primary Key (or composite key, depending on implementation) |
| studentId | FK(User) |
| batchId | FK |
| enrolledAt | Enrollment Date |
| timestamps | Audit |

---

### Constraint

Unique:

```
(student_id, batch_id)
```

---

### Meaning

A student cannot enroll twice into the same batch.

---

### Relationships

```text
Student

↓

Enrollment

↓

Batch
```

---

### Example

Rahul

↓

Weekend Piano Batch

---

# 6.9 Attendance Table

## Purpose

Stores attendance for each class session.

Attendance exists only after a session is conducted.

---

### Parent

Session

Student(User)

---

### Columns

| Column | Description |
|---------|-------------|
| id | Primary Key |
| sessionId | FK |
| studentId | FK(User) |
| status | Present / Absent |
| remarks | Optional |
| timestamps | Audit |

---

### Constraint

Unique

```
(session_id,

student_id)
```

---

### Meaning

A student can have only one attendance record for one session.

---

### Relationships

```text
Session

↓

Attendance

↑

Student
```

---

### Example

Lesson 08

↓

Rahul

↓

Present

---

# 6.10 Database Growth Flow

The ERP grows in the following order.

```text
Department

↓

Subject

↓

Course

↓

Batch

↓

Enrollment

↓

Session

↓

Attendance
```

This sequence also represents the order in which records are typically created by administrators.

---

# Chapter Summary

The Database Design Specification formalizes each entity used by Anahanad Studio and maps it directly to its business responsibility. Every table has a single, clearly defined purpose, minimizing redundancy while preserving referential integrity. The resulting schema provides a scalable foundation capable of supporting advanced ERP features such as examinations, certifications, fee management, notifications, and analytics without requiring structural redesign.