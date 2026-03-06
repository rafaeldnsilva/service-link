import { supabase } from '../lib/supabase';

export interface Message {
    id: string;
    booking_id: string;
    sender_id: string;
    content: string;
    read_at: string | null;
    created_at: string;
    sender?: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

export const messageService = {
    /**
     * Get all messages for a booking, ordered by creation time
     */
    async getMessages(bookingId: string): Promise<Message[]> {
        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
            `)
            .eq('booking_id', bookingId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return (data ?? []) as Message[];
    },

    /**
     * Send a message in a booking conversation
     */
    async sendMessage(bookingId: string, senderId: string, content: string): Promise<Message> {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                booking_id: bookingId,
                sender_id: senderId,
                content: content.trim(),
            })
            .select(`
                *,
                sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
            `)
            .single();

        if (error) throw error;
        return data as Message;
    },

    /**
     * Subscribe to new messages in real-time
     * Returns unsubscribe function
     */
    subscribeToMessages(bookingId: string, onMessage: (message: Message) => void) {
        const channel = supabase
            .channel(`messages:booking_id=eq.${bookingId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `booking_id=eq.${bookingId}`,
                },
                async (payload) => {
                    // Fetch full message with sender profile
                    const { data } = await supabase
                        .from('messages')
                        .select(`
                            *,
                            sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (data) onMessage(data as Message);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    },

    /**
     * Mark a message as read
     */
    async markAsRead(messageId: string): Promise<void> {
        const { error } = await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('id', messageId)
            .is('read_at', null);

        if (error) throw error;
    },

    /**
     * Get unread message count for a user across all their bookings
     */
    async getUnreadCount(userId: string): Promise<number> {
        const { count, error } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .neq('sender_id', userId)
            .is('read_at', null);

        if (error) throw error;
        return count ?? 0;
    },
};
