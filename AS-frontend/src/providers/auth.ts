import type { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client.js";
import type { User } from "@/types";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: {
            name: "Login failed (TRY BLOCK)",
            message: error.message,
          },
        };
      }

      localStorage.setItem("user", JSON.stringify(data.user)); // Saves user session in browser

      return {
        success: true,
        redirectTo: "/",
      };
    } catch {
      return {
        success: false,
        error: {
          name: "Login failed (CATCH BLOCK)",
          message: "Unable to login",
        },
      };
    }
  },

  /**
   * REGISTER USER
   */
  register: async (params) => {
    try {
      const { data, error } = await authClient.signUp.email(params);

      if (error) {
        return {
          success: false,
          error: {
            name: "Registation Failed (TRY BLOCK)",
            message: error.message,
          },
        };
      }

      localStorage.setItem("user", JSON.stringify(data.user)); // Saves user session in browser

      return {
        success: true,
        redirectTo: "/",
      };
    } catch {
      return {
        success: false,
        error: {
          name: "Registration Failed (CATCH BLOCK)",
          message: "Unable to register",
        },
      };
    }
  },

  /**
   * LOGOUT USER
   */
  logout: async () => {
    await authClient.signOut();

    localStorage.removeItem("user");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  /**
   * CHECK AUTHENTICATION
   */
  check: async () => {
    const user = localStorage.getItem("user");

    if(user){
        return {
            authenticated: true,
        };
    }

    return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
    };
  },

  /**
   * GET USER PROFILE
   */
  getIdentity: async () => {
    const user = localStorage.getItem("user");

    if(!user) return null;

    return JSON.parse(user);
  },

  /**
   * GET USER PERMISSIONS AFTERING FINDING ROLE
   */
  getPermissions: async () => {
    const user = localStorage.getItem("user");

    if(!user) return null;

    const parsed: User = JSON.parse(user);

    return parsed.role;
  },

  /** 
   * HANDLE ERRORS WHEN AUTHENTICATION FAILS
   */
  onError: async (error) => {
    if(error.statusCode == 401){
        return {
            logout: true, 
        };
    }

    return {};
  },

};
