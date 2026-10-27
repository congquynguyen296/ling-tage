"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Address, User } from "@/types";
import { AUTH_CONFIG } from "@/config/auth";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  logout: () => void;
}

function setRoleCookie(role: string | null) {
  if (typeof document === "undefined") return;
  if (!role) {
    document.cookie = `${AUTH_CONFIG.cookieName}=; path=/; max-age=0`;
  } else {
    document.cookie = `${AUTH_CONFIG.cookieName}=${role}; path=/; max-age=604800; SameSite=Lax`;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => {
        setRoleCookie(user?.role || null);
        set({ user });
      },

      addAddress: (addr) =>
        set((state) => {
          if (!state.user) return state;
          const newAddr: Address = {
            ...addr,
            id: `addr-${Date.now()}`,
          };
          const current = state.user.addresses || [];
          return {
            user: {
              ...state.user,
              addresses: [newAddr, ...current],
            },
          };
        }),

      removeAddress: (id) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: (state.user.addresses || []).filter((a) => a.id !== id),
            },
          };
        }),

      logout: () => {
        setRoleCookie(null);
        set({ user: null });
      },
    }),
    {
      name: AUTH_CONFIG.tokenStorageKey,
    }
  )
);

