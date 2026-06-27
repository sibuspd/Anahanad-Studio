// typescript declaration file for express / Type Augmentation (Declaration Merging)

// We are declaring the user roles here for each API requests

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role?: "super_admin" | "admin" | "hod" | "teacher" | "student" | "parent" | "accountant";  
            };
        }
    }
}

export {};

// req.user comes from Authentication middleware

