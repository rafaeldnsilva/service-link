import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const NOTIFICATIONS = [
    {
        id: 1,
        title: "Seu serviço foi confirmado",
        time: "5m atrás",
        icon: "event-available",
        iconBg: "#3B82F6",
        unread: true,
    },
    {
        id: 2,
        title: "Nova mensagem de João P.",
        time: "2h atrás",
        icon: "message",
        iconBg: "#3B82F6",
        unread: true,
    },
    {
        id: 3,
        title: "Oferta especial! 15% de desconto.",
        time: "Ontem",
        icon: "local-offer",
        iconBg: "#E5E7EB",
        unread: false,
    },
    {
        id: 4,
        title: "Lembrete: Atualize o pagamento",
        time: "2 dias atrás",
        icon: "notifications",
        iconBg: "#E5E7EB",
        unread: false,
    },
    {
        id: 5,
        title: "Serviço de encanamento concluído",
        time: "3 dias atrás",
        icon: "check-circle",
        iconBg: "#E5E7EB",
        unread: false,
    },
];

export const NotificationsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleClearAll = () => {
        console.log("Clear all notifications");
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-[20px] font-bold text-slate-900">
                    Notificações
                </Text>
                <TouchableOpacity onPress={handleClearAll} className="px-2">
                    <Text className="text-[15px] font-medium text-blue-500">Limpar Tudo</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                {NOTIFICATIONS.map((notification, index) => (
                    <TouchableOpacity
                        key={notification.id}
                        className={`flex-row items-center px-4 py-4 bg-white ${index < NOTIFICATIONS.length - 1 ? "border-b border-slate-100" : ""
                            }`}
                        activeOpacity={0.7}
                    >
                        {/* Icon */}
                        <View
                            className="w-16 h-16 rounded-full items-center justify-center mr-4"
                            style={{ backgroundColor: notification.iconBg }}
                        >
                            <MaterialIcons
                                name={notification.icon as any}
                                size={28}
                                color={notification.iconBg === "#E5E7EB" ? "#64748B" : "white"}
                            />
                        </View>

                        {/* Content */}
                        <View className="flex-1">
                            <Text className="text-[16px] font-medium text-slate-900 mb-1">
                                {notification.title}
                            </Text>
                            <Text className="text-[13px] text-slate-400">{notification.time}</Text>
                        </View>

                        {/* Unread Badge */}
                        {notification.unread && (
                            <View className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2" />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};
