import { ReactNode } from "react";
import { Music4, GraduationCap, Users, CalendarDays } from "lucide-react";

type AuthLayoutProps = {
    children: ReactNode;
};

const features = [
    "Student Management",
    "Faculty Management",
    "Course & Batch Management",
    "Attendance & Scheduling",
];

const icons = [
    Users, GraduationCap, Music4, CalendarDays
];

export default function AuthLayout( {children} : AuthLayoutProps ) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-muted/30">
            {/* LEFT PANEL */}
            <div className="hidden lg:flex flex-col justify-center bg-primary text-primary-foreground px-16">
                <div className="max-w-lg">
                    <Music4 className="h-14 w-14 mb-6"/>
                    
                    <h1 className="text-5xl font-bold leading-tight">
                        Anahanad Studio ERP
                    </h1>

                    <p className="mt-5 text-lg opacity-90">
                        Online Music Academy Management Platform    
                    </p>

                    <div className="mt-10 space-y-5">
                        {features.map( (feature, index ) => {
                            const Icon = icons[index];

                            return (
                                <div className="flex items-center gap-3">
                                    <Icon className="h-5 w-5"/>
                                    <span>{feature}</span>
                                </div>
                            );
                        })}    
                    </div>    
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex items-center justify-center p-8">
                {children}
            </div>
        </div>
    );
}