export type Subject = {
    id: number;
    name: string;
    code: string;
    description: string;
    department: Department;
    createdAt?: string;
    updatedAt?: string;
};

export type ListResponse<T = unknown> = {
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type CreateResponse<T = unknown> = {
    data?: T;
};

export type GetOneResponse<T = unknown> = {
    data?: T;
};

declare global {
    interface CloudinaryUploadWidgetResults {
        event: string;
        info: {
            secure_url: string;
            public_id: string;
            delete_token?: string;
            resource_type: string;
            original_filename: string;
        };
    }

    interface CloudinaryWidget {
        open: () => void;
    }

    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (
                    error: unknown,
                    result: CloudinaryUploadWidgetResults
                ) => void
            ) => CloudinaryWidget;
        };
    }
}

export interface UploadWidgetValue {
    url: string;
    publicId: string;
}

export interface UploadWidgetProps {
    value?: UploadWidgetValue | null;
    onChange?: (value: UploadWidgetValue | null) => void;
    disabled?: boolean;
}

export enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    HOD = 'hod',
    TEACHER = "teacher",
    STUDENT = "student",
    PARENT = 'parent',
    ACCOUNTANT = 'accountant',
}

export type User = {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    name: string;
    role: UserRole;
    image?: string;
    imageCldPubId?: string;
    department?: string;
};

export type Schedule = {
    day: string;
    startTime: string;
    endTime: string;
};

export type Department = {
    id: number;
    name: string;
    description: string;
};

// export type ClassSession = {
//     id: number;
//     name: string;
//     description?: string;
//     sessionDate: string;
//     startTime: string;
//     endTime: string;
//     status: "scheduled" | "completed" | "cancelled";
//     inviteCode: string;
//     bannerCldPubId?: string;
//     bannerUrl?: string;
//     batch: Batch;
//     course: Course;
//     teacher: User;
//     department?: Department;
// };

export type SignUpPayload = {
    email: string;
    name: string;
    password: string;
    image?: string;
    imageCldPubId?: string;
    role: UserRole;
};

export type Course = {
    id: number;
    name: string;
    description?: string;
    level: "beginner" | "intermediate" | "advanced";
    durationMonths: number;
    feeAmount: string | number;
    subject: Subject; // GET endpoints usually return joined objects
};

// Batch table is independent of Courses or Subjects
export type Batch = {
    id: number;
    name: string;
    capacity: number;
    schedule: Schedule[];
};

export interface ClassSession {
    id: number;
    name: string;
    status: "scheduled" | "completed" | "cancelled";
    bannerUrl: string;

    course: {
        id: number;
        name: string;

        subject: {
            id: number;
            code: string;
            name: string;

            department: {
                id: number;
                name: string;
            };
        };
    };

    batch: {
        id: number;
        name: string;
    };

    teacher: {
        id: string;
        name: string;
    }
}

export type ClassDetails = {
    id: number;
    name: string;
    description: string;
    status: "active" | "inactive";
    capacity: number;
    courseCode: string;
    courseName: string;
    bannerUrl?: string;
    bannerCldPubId?: string;
    subject?: Subject;
    teacher?: User;
    department?: Department;
    schedules: Schedule[];
    inviteCode?: string;
};