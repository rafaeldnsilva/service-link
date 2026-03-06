import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthState {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    // Computed
    isProvider: boolean;
    isAuthenticated: boolean;
    // Actions
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setProfile: (profile: Profile | null) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
}

const initialState = {
    user: null,
    session: null,
    profile: null,
    loading: true,
    isProvider: false,
    isAuthenticated: false,
};

export const useAuthStore = create<AuthState>((set) => ({
    ...initialState,

    setUser: (user) =>
        set((state) => ({
            user,
            isAuthenticated: !!user,
            isProvider: state.profile?.role === "provider",
        })),

    setSession: (session) => set({ session }),

    setProfile: (profile) =>
        set({
            profile,
            isProvider: profile?.role === "provider",
        }),

    setLoading: (loading) => set({ loading }),

    reset: () => set(initialState),
}));
