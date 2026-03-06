import { create } from "zustand";
import { Database } from "../types/supabase";

type Service = Database["public"]["Tables"]["services"]["Row"];

interface ServicesState {
    selectedCategory: string | null;
    searchQuery: string;
    selectedService: Service | null;
    // Actions
    setSelectedCategory: (category: string | null) => void;
    setSearchQuery: (query: string) => void;
    setSelectedService: (service: Service | null) => void;
    clearFilters: () => void;
}

export const useServicesStore = create<ServicesState>((set) => ({
    selectedCategory: null,
    searchQuery: "",
    selectedService: null,

    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedService: (service) => set({ selectedService: service }),
    clearFilters: () => set({ selectedCategory: null, searchQuery: "" }),
}));
