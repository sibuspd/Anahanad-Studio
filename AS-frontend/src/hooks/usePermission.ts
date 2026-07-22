// Customized Hook to give access to Users based on Roles | Different from refine hook usePermissions()

import { usePermissions } from "@refinedev/core";

export const usePermission = ( allowedRoles: readonly string[]) => {
    const { data: role } = usePermissions<string>( {} );

    return allowedRoles.includes( role?? "");
};