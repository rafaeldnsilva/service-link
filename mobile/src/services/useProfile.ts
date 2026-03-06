import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Database } from "../types/supabase";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export const useProfile = (userId?: string) => {
    return useQuery({
        queryKey: ["profile", userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId!)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
    });
};

export const useUpdateProfile = (userId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (updates: ProfileUpdate) => {
            const { data, error } = await supabase
                .from("profiles")
                .update(updates)
                .eq("id", userId)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["profile", userId] });
        },
    });
};
