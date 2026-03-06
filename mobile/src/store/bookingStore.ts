import { create } from "zustand";
import { Database } from "../types/supabase";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];

type BookingStatus = "idle" | "searching" | "accepted" | "in_progress" | "completed";

interface BookingState {
    activeBooking: Booking | null;
    bookingStatus: BookingStatus;
    // Actions
    setActiveBooking: (booking: Booking | null) => void;
    setBookingStatus: (status: BookingStatus) => void;
    clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    activeBooking: null,
    bookingStatus: "idle",

    setActiveBooking: (booking) => set({ activeBooking: booking }),
    setBookingStatus: (status) => set({ bookingStatus: status }),
    clearBooking: () => set({ activeBooking: null, bookingStatus: "idle" }),
}));
