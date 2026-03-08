import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { notificationService, AppNotification } from "../../services/notificationService";

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

const TYPE_CONFIG: Record<string, { icon: MaterialIconName; color: string }> = {
    new_booking:        { icon: "event-note",       color: "#8B5CF6" },
    booking_accepted:   { icon: "event-available",  color: "#10B981" },
    booking_cancelled:  { icon: "event-busy",       color: "#EF4444" },
    service_completed:  { icon: "check-circle",     color: "#3B82F6" },
    new_message:        { icon: "message",           color: "#F59E0B" },
};

const DEFAULT_CONFIG: { icon: MaterialIconName; color: string } = {
    icon: "notifications",
    color: "#94A3B8",
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "agora";
    if (m < 60) return `${m}m atrás`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h atrás`;
    return `${Math.floor(h / 24)}d atrás`;
}

export const NotificationsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();

    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const data = await notificationService.getNotifications(user.id);
            setNotifications(data);
        } catch {
            Alert.alert("Erro", "Não foi possível carregar as notificações.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // Subscribe to new notifications via Realtime
    useEffect(() => {
        if (!user) return;
        const unsubscribe = notificationService.subscribeToNotifications(user.id, (n) => {
            setNotifications((prev) => [n, ...prev]);
        });
        return unsubscribe;
    }, [user]);

    const handleTap = async (n: AppNotification) => {
        if (!n.read_at) {
            await notificationService.markAsRead(n.id).catch(() => {});
            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === n.id ? { ...item, read_at: new Date().toISOString() } : item
                )
            );
        }
        if (n.booking_id && n.type === "service_completed") {
            // Navigate to rate provider — would need providerId, skip for now
        }
    };

    const handleMarkAllRead = async () => {
        if (!user) return;
        await notificationService.markAllAsRead(user.id).catch(() => {});
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))
        );
    };

    const unreadCount = notifications.filter((n) => !n.read_at).length;

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-[20px] font-bold text-slate-900">
                    Notificações{unreadCount > 0 ? ` (${unreadCount})` : ""}
                </Text>
                <TouchableOpacity onPress={handleMarkAllRead} disabled={unreadCount === 0} className="px-2">
                    <Text className={`text-[15px] font-medium ${unreadCount > 0 ? "text-primary" : "text-slate-300"}`}>
                        Lidas
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : notifications.length === 0 ? (
                <View className="flex-1 items-center justify-center px-8">
                    <MaterialIcons name="notifications-none" size={60} color="#d4d4d8" />
                    <Text className="text-slate-400 mt-4 text-[16px] text-center">
                        Nenhuma notificação ainda.{"\n"}Elas aparecerão aqui conforme você usa o app.
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                    {notifications.map((n, index) => {
                        const config = TYPE_CONFIG[n.type] ?? DEFAULT_CONFIG;
                        const isUnread = !n.read_at;

                        return (
                            <TouchableOpacity
                                key={n.id}
                                onPress={() => handleTap(n)}
                                activeOpacity={0.7}
                                className={`flex-row items-center px-4 py-4 ${isUnread ? "bg-purple-50" : "bg-white"} ${index < notifications.length - 1 ? "border-b border-slate-100" : ""}`}
                            >
                                {/* Icon */}
                                <View
                                    className="w-14 h-14 rounded-full items-center justify-center mr-4"
                                    style={{ backgroundColor: config.color + "20" }}
                                >
                                    <MaterialIcons name={config.icon} size={26} color={config.color} />
                                </View>

                                {/* Content */}
                                <View className="flex-1">
                                    <Text className={`text-[15px] mb-0.5 ${isUnread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                                        {n.title}
                                    </Text>
                                    {n.body && (
                                        <Text className="text-[13px] text-slate-500 mb-1">{n.body}</Text>
                                    )}
                                    <Text className="text-[12px] text-slate-400">{timeAgo(n.created_at)}</Text>
                                </View>

                                {isUnread && (
                                    <View className="w-2.5 h-2.5 rounded-full ml-2" style={{ backgroundColor: config.color }} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};
