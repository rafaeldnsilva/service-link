import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useServices = (category?: string | null) => {
    return useQuery({
        queryKey: ["services", category ?? "all"],
        queryFn: async () => {
            let query = supabase
                .from("services")
                .select("*, profiles(full_name, avatar_url, rating)");

            if (category) {
                query = query.eq("category", category);
            }

            const { data, error } = await query.order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });
};

export const useService = (serviceId: string) => {
    return useQuery({
        queryKey: ["services", serviceId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("services")
                .select("*, profiles(full_name, avatar_url, rating, phone)")
                .eq("id", serviceId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!serviceId,
    });
};
