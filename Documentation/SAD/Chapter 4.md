# Chapter 4

# Business Domain Model & ERP Design

---

## 4.1 Introduction

Anahanad Studio is not merely an online classroom application. It is designed as a complete Enterprise Resource Planning (ERP) system for music academies.

Unlike conventional Learning Management Systems (LMS), which usually revolve around a simple **Teacher → Class → Student** structure, Anahanad Studio models the actual operational workflow of a professional music academy.

The system captures both the academic hierarchy and the administrative processes required to manage departments, courses, batches, faculty, students, schedules, and attendance.

The domain model was intentionally designed to closely resemble how music institutions function in the real world.

---

# 4.2 Real World Business Structure

A music academy generally operates in the following order:

```text
Music Academy

│

├── Departments

│      │

│      ├── Subjects

│      │       │

│      │       ├── Courses

│      │       │      │

│      │       │      ├── Batches

│      │       │      │      │

│      │       │      │      ├── Sessions

│      │       │      │      │

│      │       │      │      └── Attendance

│

├── Teachers

├── Students

├── Parents

└── Administration
```

This hierarchy directly inspired the database design.

---

# 4.3 Why This Hierarchy?

One of the most important architectural decisions was choosing the hierarchy.

Instead of:

```text
Subject

↓

Class

↓

Student
```

the project follows:

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

This provides significantly greater flexibility.

For example:

Keyboard Department

↓

Piano Subject

↓

Beginner Piano Course

↓

Weekend Batch

↓

Lesson 08

↓

Attendance

This mirrors the real-world educational process.

---

# 4.4 Department

Departments represent the highest academic division within the academy.

Examples:

- Keyboard
- Strings
- Percussions
- Vocals
- Fine Arts

Responsibilities:

- Organize subjects
- Organize faculty
- Administrative grouping

Relationship:

```text
Department

1

↓

N

Subjects
```

---

# 4.5 Subject

Subjects define the discipline being taught.

Examples:

- Piano
- Guitar
- Tabla
- Drums
- Violin
- Hindustani Vocals
- Western Vocals

Each subject belongs to exactly one department.

Relationship:

```text
Department

↓

Subject
```

A subject may have multiple courses.

---

# 4.6 Course

A course represents a structured learning program.

Examples:

Beginner Piano

Intermediate Piano

Advanced Piano

A course defines:

- curriculum
- duration
- fee structure
- difficulty level

It does NOT contain students.

It does NOT contain attendance.

Relationship:

```text
Subject

↓

Course
```

---

# 4.7 Batch

A batch represents a group of students studying together.

Examples:

Kids Batch

Weekend Batch

Evening Batch

Morning Batch

Corporate Batch

Unlike subjects and courses,

a batch represents scheduling rather than curriculum.

Each batch stores:

- assigned teacher
- weekly schedule
- student capacity

Relationship:

```text
Course

↓

Batch
```

---

# 4.8 Why Batch Exists Separately

One of the biggest architectural differences from traditional LMS systems is the existence of the Batch entity.

Suppose:

Beginner Piano

may be taught in

Morning Batch

Weekend Batch

Kids Batch

Corporate Batch

All four batches follow exactly the same syllabus.

Only:

- students
- timings
- teacher

change.

Without a Batch entity,

the course would need to be duplicated multiple times.

This violates database normalization.

---

# 4.9 Class Session

A session represents one actual class conducted.

Example:

Saturday

5 PM

Lesson 08

Introduction to Musical Modes

Teacher:

Anand Sirsat

This is a single teaching event.

Relationship:

```text
Batch

↓

Session
```

One batch produces many sessions.

---

# 4.10 Why Sessions are Separate

A common beginner mistake is to confuse:

Course

Batch

Session

They represent completely different concepts.

Course:

"What will be taught?"

Batch:

"Who learns together?"

Session:

"What happens today?"

Example:

Course

↓

Beginner Piano

Batch

↓

Weekend Batch

Session

↓

15 July

5 PM

Lesson 12

Attendance

↓

Present

Absent

---

# 4.11 Attendance

Attendance belongs only to a session.

Not:

Course

Not:

Batch

Why?

Because attendance changes every class.

Example:

Saturday

Student A

Present

Sunday

Student A

Absent

Hence:

```text
Session

↓

Attendance
```

---

# 4.12 Enrollment

Enrollment records which students belong to which batch.

Relationship:

```text
Student

↓

Enrollment

↓

Batch
```

A student can belong to multiple batches.

Example:

Piano Weekend

+

Western Vocals Evening

This requires a junction table.

---

# 4.13 Why Enrollment Uses Batch Instead of Course

One of the key architectural improvements made during the project was deciding that students enroll into **batches**, not directly into courses.

Reason:

A course defines *what* is taught, but a batch defines *when* and *with whom* it is taught.

For example:

Course:

> Beginner Piano

Available as:

- Kids Batch
- Weekend Batch
- Evening Batch

If enrollment were attached directly to the course, the application would have no way of distinguishing which group a student actually attends.

By linking enrollments to batches:

- Scheduling becomes accurate.
- Attendance can be tracked correctly.
- Capacity limits are enforced.
- Teachers know exactly which students belong to their batch.

This mirrors real academy operations.

---

# 4.14 Attendance Lifecycle

Attendance follows this sequence:

```text
Student

↓

Enrollment

↓

Batch

↓

Session

↓

Attendance
```

Attendance cannot exist unless:

- student exists
- enrollment exists
- session exists

This dependency chain maintains referential integrity.

---

# 4.15 Teacher Assignment

Teachers are assigned at multiple levels for flexibility.

Currently:

Primary assignment occurs at:

```text
Batch
```

Reason:

One teacher usually handles one batch.

However,

each Session also stores:

teacherId

allowing substitute teachers whenever required.

Example:

Weekend Batch

↓

Regular Teacher

↓

Absent

↓

Substitute Teacher

↓

Session

This design avoids modifying the batch itself.

---

# 4.16 Business Entity Relationship Diagram (Conceptual)

```text
Department
      │
      │ 1:N
      ▼
Subject
      │
      │ 1:N
      ▼
Course
      │
      │ 1:N
      ▼
Batch
   │        │
   │        └──────────────► Teacher (User)
   │
   │ 1:N
   ▼
Class Session
   │
   │ 1:N
   ▼
Attendance
   ▲
   │
Student (User)

Student
   │
   │ 1:N
   ▼
Enrollment
   ▲
   │
Batch
```

---

# 4.17 Why This Model is Scalable

The hierarchy naturally supports future enhancements without restructuring existing tables.

Examples include:

- Online examinations
- Certificates
- Homework and assignments
- Practice logs
- Student progress reports
- Parent dashboards
- Fee installments
- Live class integration
- AI-assisted lesson recommendations

Each module can attach to the appropriate entity (Course, Batch, Session, or Student) while preserving the overall architecture.

---

# Chapter Summary

The business domain model of Anahanad Studio has been carefully aligned with the operational workflow of a real music academy rather than a generic learning management system. The hierarchical progression from Department to Attendance ensures proper normalization, eliminates data duplication, and clearly separates curriculum, scheduling, enrollment, and classroom activities.

The introduction of dedicated entities such as Courses, Batches, and Class Sessions provides the flexibility needed to support multiple schedules, substitute teachers, attendance tracking, and future ERP modules while maintaining a clean and scalable relational design.