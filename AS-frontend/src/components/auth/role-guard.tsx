// HEART OF THE AUTHORIZATION SYSTEM

import { ReactNode } from "react";
import { Navigate } from "react-router";
import { usePermissions } from "@refinedev/core";

type Role = 
| "super_admin"
| "admin"
| "hod"
| "teacher"
| "student"
| "parent"
| "accountant";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: Role[];
}

const RoleGuard = ( {children, allowedRoles}: RoleGuardProps ) => {
    const { data: role, isLoading } = usePermissions<Role>();

    if(isLoading){
        return <div>Loading...</div>;
    }

    if(!role || !allowedRoles.includes(role)){
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
};

export default RoleGuard;

