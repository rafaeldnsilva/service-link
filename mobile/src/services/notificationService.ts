import * as ExpoNotifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

export interface AppNotification {
    id: string;
    user_id: string;
    title: string;
    body: string | null;
    type: string;
    booking_id: string | null;
    read_at: string | null;
    created_at: string;
}

// Configure how notifications appear when the app is in the foreground
ExpoNotifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const notificationService = {
    /**
     * Request permission and register the Expo push token.
     * Saves the token to the user's profile in Supabase.
     * Returns null on simulators or when permission is denied.
     */
    async registerPushToken(userId: string): Promise<string | null> {
        if (!Device.isDevice) return null;

        const { status: existing } = await ExpoNotifications.getPermissionsAsync();
        let finalStatus = existing;

        if (existing !== 'granted') {
            const { status } = await ExpoNotifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') return null;

        if (Platform.OS === 'android') {
            await ExpoNotifications.setNotificationChannelAsync('default', {
                name: 'ServiceLink',
                importance: ExpoNotifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#2C097F',
            });
        }

        const token = (await ExpoNotifications.getExpoPushTokenAsync()).data;

        await supabase
            .from('profiles')
            .update({ push_token: token })
            .eq('id', userId);

        return token;
    },

    /**
     * Fetch all notifications for a user (newest first, limit 50).
     */
    async getNotifications(userId: string): Promise<AppNotification[]> {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        return (data ?? []) as AppNotification[];
    },

    /**
     * Mark a single notification as read.
     */
    async markAsRead(notificationId: string): Promise<void> {
        await supabase
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('id', notificationId)
            .is('read_at', null);
    },

    /**
     * Mark all unread notifications as read for a user.
     */
    async markAllAsRead(userId: string): Promise<void> {
        await supabase
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('user_id', userId)
            .is('read_at', null);
    },

    /**
     * Subscribe to new notifications via Supabase Realtime.
     * Returns an unsubscribe function.
     */
    subscribeToNotifications(
        userId: string,
        onNotification: (n: AppNotification) => void,
    ) {
        const channel = supabase
            .channel(`notifications:user=${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    onNotification(payload.new as AppNotification);
                },
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    },

    /**
     * Get unread notification count for badge use.
     */
    async getUnreadCount(userId: string): Promise<number> {
        const { count } = await supabase
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .is('read_at', null);

        return count ?? 0;
    },
};
