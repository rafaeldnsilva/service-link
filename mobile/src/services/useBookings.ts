import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Database } from "../types/supabase";

type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

export const useBookings = (userId?: string) => {
    return useQuery({
        queryKey: ["bookings", userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("bookings")
                .select("*, services(title, category), profiles!bookings_provider_id_fkey(full_name, avatar_url)")
                .eq("client_id", userId!)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
    });
};

export const useProviderBookings = (providerId?: string) => {
    return useQuery({
        queryKey: ["provider-bookings", providerId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("bookings")
                .select("*, services(title, category), profiles!bookings_client_id_fkey(full_name, avatar_url)")
                .eq("provider_id", providerId!)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!providerId,
    });
};

export const useCreateBooking = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (booking: BookingInsert) => {
            const { data, error } = await supabase
                .from("bookings")
                .insert(booking)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
};
