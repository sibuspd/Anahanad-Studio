import { createAuthClient } from "better-auth/react";

import { BACKEND_BASE_URL, USER_ROLES } from "@/constants";

export const authClient = createAuthClient( {
    baseURL: `${BACKEND_BASE_URL}auth`,
    
    user: {
        additionalFields: {
            role: {
                type: USER_ROLES,
                required: true,
                defaultValue: USER_ROLES.STUDENT,
                input: true
            },
            imageCldPubId: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
});