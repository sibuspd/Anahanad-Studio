// VALIDATION LAYER
// Defining a Zod schema to validate form inputs from user before adding a class in database; Relates to Create Classes
import * as z from "zod"

// Teacher under each Department
export const facultySchema = z.object( {
    name: z.string().min(2, 'Name must be atleast 2 characters'),
    email: z.string().email(),
    role: z.enum( ['super_admin', 'admin', 'hod', 'teacher', 'accountant'] ),
    department: z.string(),
    image: z.string().optional(),
    imageCldPubId: z.string().optional(), // image will be published in Cloud 
    
});

// ZOD SCHEMA FOR SUBJECT
export const subjectSchema = z.object({
    name: z.string().min(3, "Subject name must be at least 3 characters"),
    code: z.string().min(3, "Subject code must be at least 3 characters"),
    description: z
        .string()
        .min(5, "Subject description must be at least 5 characters"),
    departmentId: z
        .coerce.number()
        .min(2, "Subject department must be at least 2 characters"),
});

// ZOD SCHEMA FOR SCHEDULE
export const scheduleSchema = z.object({
    day: z.string().min(1, "Day is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
});


// ZOD SCHEMA FOR COURSE WHERE FEES ARE ATTACHED
export const courseSchema = z.object( {
    name: z.string(),
    subjectId: z.coerce.number(),
    level: z.enum( ['beginner', 'intermediate', 'advanced'] ),
    durationMonths: z.coerce.number(),
    feeAmount: z.coerce.number(),
    description: z.string(),
});

// ZOD SCHEMA FOR BATCH
export const batchSchema = z.object( {
    name: z.string(),
        capacity: z.coerce
        .number({
            required_error: "Capacity is required",
            invalid_type_error: "Capacity is required",
        })
        .min(1, "Capacity must be at least 1"),
    schedule: z.array(scheduleSchema),
} );

// ZOD SCHEMA FOR SESSION
export const sessionSchema = z.object({ 
    name: z
        .string()
        .min(2, "Class name must be at least 2 characters")
        .max(50, "Class name must be at most 50 characters"),
    description: z
        .string({ required_error: "Description is required" })
        .min(5, "Description must be at least 5 characters"),
    batchId: z.coerce
        .number({
            required_error: "Batch Id is required",
            invalid_type_error: "Batch Id is required",
        })
        .min(1, "Batch Id is required"),
    subjectId: z.coerce.number().optional(), // Optional because the session's subject is not sent to the database
    courseId: z.coerce.number(),
    teacherId: z.coerce.string({
        required_error: "Teacher ID is required",
    }).min(1, "Teacher is required"),
    bannerUrl: z
        .string({ required_error: "Class banner is required" })
        .min(1, "Class banner is required"),
    bannerCldPubId: z
        .string({ required_error: "Banner reference is required" })
        .min(1, "Banner reference is required"),
    inviteCode: z.string().optional(),
    sessionDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    status: z.enum(["scheduled", "completed", "cancelled"]),
});

// ZOD SCHEMA FOR STUDENT ENROLLMENT
export const enrollmentSchema = z.object({
    batchId: z.coerce
        .number({
            required_error: "Batch ID is required",
            invalid_type_error: "Batch ID is required",
        })
        .min(1, "Batch ID is required"),
    studentId: z.string().min(1, "Student ID is required"),
});

// ZOD SCHEMA FOR ATTENDANCE
export const attendanceSchema = z.object({
    sessionId: z.number(),
    studentId: z.string(),
    status: z.enum( [ 'present', 'absent'] ),
})