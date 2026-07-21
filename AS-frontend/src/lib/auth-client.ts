import { createAuthClient } from "better-auth/react";

import { BACKEND_BASE_URL } from "@/constants";
import { USER_ROLES } from "@/constants/"

export const authClient = createAuthClient( {
    baseUrl: `${BACKEND_BASE_URL}auth`,
    
    user: {
        additionalFields: {
            role: {
                type: USER_ROLES,
                required: true,
                defaultValue: "student",
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