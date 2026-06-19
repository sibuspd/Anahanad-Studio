// FRONTEND DATA + DROPDOWN LAYER
import { GraduationCap, School, ShieldCheck, Users, BadgeDollarSign, Crown, UserCog } from "lucide-react";

export const USER_ROLES = {
    SUPER_ADMIN: "super_admin", // Sabyasachi Sahani who oversees the app 
    ADMIN: "admin", // Anand Sirsat who will own the school
    HOD: "hod", 
    TEACHER: "teacher",
    STUDENT: "student",
    PARENT: "parent", 
    ACCOUNTANT: "accountant", // the one responsible for fee management
} as const;

export const ROLE_OPTIONS = [ // To set the roles in the dropdown
    {
        value: USER_ROLES.STUDENT,
        label: "Student",
        icon: GraduationCap,
    },
    {
        value: USER_ROLES.TEACHER,
        label: "Teacher",
        icon: School,
    },
    {
        value: USER_ROLES.ADMIN,
        label: "Admin",
        icon: ShieldCheck,
    },
    {
        value: USER_ROLES.SUPER_ADMIN,
        label: "Super Admin",
        icon: Crown,
    },
    {
        value: USER_ROLES.PARENT,
        label: "Parent",
        icon: Users,
    },
    {
        value: USER_ROLES.ACCOUNTANT,
        label: "Accountant",
        icon: BadgeDollarSign,
    },
    {
        value: USER_ROLES.HOD,
        label: "Head of Department",
        icon: UserCog,
    },
];

export const DEPARTMENTS = [
    "Keyboard",
    "Strings",
    "Percussions",
    "Vocals",
    "Fine Arts"
] as const;

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
}));

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
export const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

const getEnvVar = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const CLOUDINARY_UPLOAD_URL = getEnvVar("VITE_CLOUDINARY_UPLOAD_URL");
export const CLOUDINARY_CLOUD_NAME = getEnvVar("VITE_CLOUDINARY_CLOUD_NAME");
export const BACKEND_BASE_URL = getEnvVar("VITE_BACKEND_BASE_URL");

export const BASE_URL =  import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

// export const CLOUDINARY_UPLOAD_PRESET = getEnvVar("VITE_CLOUDINARY_UPLOAD_PRESET");

export const teachers = [
    {
        id: 1,
        name: "Anand Sirsat",
    },
    {
        id: 2,
        name: "Sabyasachi Sahani",
    },
    {
        id: 3,
        name: "Prasanna Bhure",
    },
    {
        id: 4,
        name: "Makarand Jadhav",
    },
];

export const subjects = [
    {
        id: 1,
        name: "Piano",
        code: "PIANO",
        departmentCode: "KEYS",
    },
    {
        id: 2,
        name: "Electronic Keyboard",
        code: "EKEY",
        departmentCode: "KEYS",
    },
    {
        id: 3,
        name: "Synthesizer",
        code: "SYNTH",
        departmentCode: "KEYS",
    },
    {
        id: 4,
        name: "Guitar",
        code: "GUITAR",
        departmentCode: "STR",
    },
    {
        id: 5,
        name: "Violin",
        code: "VIOLIN",
        departmentCode: "STR",
    },
    {
        id: 6,
        name: "Ukulele",
        code: "UKULELE",
        departmentCode: "STR",
    },
    {
        id: 7,
        name: "Tabla",
        code: "TABLA",
        departmentCode: "PERC",
    },
    {
        id: 8,
        name: "Drums",
        code: "DRUMS",
        departmentCode: "PERC",
    },
    {
        id: 9,
        name: "Cajon",
        code: "CAJON",
        departmentCode: "PERC",
    },
    {
        id: 10,
        name: "Western Vocals",
        code: "WVOC",
        departmentCode: "VOC",
    },
    {
        id: 11,
        name: "Hindustani Vocals",
        code: "HVOC",
        departmentCode: "VOC",
    },
    {
        id: 12,
        name: "Sketching",
        code: "SKETCH",
        departmentCode: "ART",
    },
    {
        id: 13,
        name: "Painting",
        code: "PAINT",
        departmentCode: "ART",
    },
];