import { AUTH_CONFIG } from "@/config/auth";
import { springBootFetch } from "@/config/db";
import { User } from "@/types";
import { LoginInput, LoginSchema, RegisterInput, RegisterSchema } from "./schema";

/**
 * Login against Spring Boot backend (or 2s debounced mock API)
 * Tip: Use admin@tage.studio or any email containing "admin" to sign in with ADMIN role
 */
export async function loginService(rawInput: LoginInput) {
  const input = LoginSchema.parse(rawInput);

  return springBootFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    debounceKey: "auth-login",
    mockResolver: () => {
      const isAdmin =
        input.email.toLowerCase() === AUTH_CONFIG.demoAdminCredentials.email ||
        input.email.toLowerCase().includes("admin");

      return {
        id: `usr-${Date.now()}`,
        name: input.email.split("@")[0],
        email: input.email,
        role: isAdmin ? "ADMIN" : "CUSTOMER",
        addresses: [
          {
            id: "addr-default",
            firstName: input.email.split("@")[0],
            lastName: "TAGE",
            phone: "0909123456",
            addressLine: "68 Dong Khoi, District 1",
            city: "Ho Chi Minh City",
            postalCode: "700000",
            country: "Vietnam",
            isDefault: true,
          },
        ],
      };
    },
  });
}

/**
 * Register account against Spring Boot backend (or 2s debounced mock API)
 */
export async function registerService(rawInput: RegisterInput) {
  const input = RegisterSchema.parse(rawInput);

  return springBootFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
    debounceKey: "auth-register",
    mockResolver: () => {
      const isAdmin = input.email.toLowerCase().includes("admin");
      return {
        id: `usr-${Date.now()}`,
        name: input.name.trim().split(" ")[0],
        email: input.email,
        role: isAdmin ? "ADMIN" : "CUSTOMER",
        addresses: [],
      };
    },
  });
}

