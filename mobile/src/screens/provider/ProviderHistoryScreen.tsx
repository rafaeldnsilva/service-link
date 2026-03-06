import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../services/supabaseService";
import { Database } from "../../types/supabase";

type BookingStatus = Database["public"]["Enums"]["booking_status"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
    service?: Database["public"]["Tables"]["services"]["Row"];
    client?: Database["public"]["Tables"]["profiles"]["Row"];
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: "check-circle" | "pending" | "cancel" | "hourglass-empty" }> = {
    completed: { label: "Concluído", bg: "bg-green-50", color: "#10B981", icon: "check-circle" },
    accepted:  { label: "Em andamento", bg: "bg-blue-50", color: "#3B82F6", icon: "hourglass-empty" },
    pending:   { label: "Pendente", bg: "bg-orange-50", color: "#F97316", icon: "pending" },
    cancelled: { label: "Cancelado", bg: "bg-red-50", color: "#EF4444", icon: "cancel" },
};

export const ProviderHistoryScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"todos" | BookingStatus>("todos");

    useEffect(() => {
        if (user) loadBookings();
    }, [user]);

    const loadBookings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await bookingService.getProviderBookings(user.id);
            setBookings(data);
        } catch (error) {
            console.error("Error loading provider bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = filter === "todos" ? bookings : bookings.filter(b => b.status === filter);

    const totalEarnings = bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + (b.total_amount ?? 0), 0);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-slate-50">
                <Text className="flex-1 text-xl font-bold text-slate-900">
                    Histórico de Atendimentos
                </Text>
                <TouchableOpacity onPress={loadBookings}>
                    <MaterialIcons name="refresh" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Earnings Summary */}
            {!loading && bookings.length > 0 && (
                <View className="mx-4 mb-4 bg-primary rounded-2xl p-4 flex-row items-center">
                    <MaterialIcons name="account-balance-wallet" size={28} color="white" />
                    <View className="ml-3">
                        <Text className="text-white/80 text-[12px]">Total Ganho</Text>
                        <Text className="text-white font-bold text-[22px]">
                            R$ {totalEarnings.toFixed(2).replace(".", ",")}
                        </Text>
                    </View>
                    <View className="ml-auto">
                        <Text className="text-white/80 text-[12px]">{bookings.filter(b => b.status === "completed").length} concluídos</Text>
                    </View>
                </View>
            )}

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-3 max-h-12">
                {(["todos", "completed", "accepted", "pending", "cancelled"] as const).map((f) => {
                    const labels = { todos: "Todos", completed: "Concluídos", accepted: "Em Andamento", pending: "Pendentes", cancelled: "Cancelados" };
                    return (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilter(f)}
                            className={`mr-3 px-4 py-2 rounded-full border ${filter === f ? "bg-primary border-primary" : "bg-white border-slate-200"}`}
                        >
                            <Text className={`text-[13px] font-semibold ${filter === f ? "text-white" : "text-slate-600"}`}>
                                {labels[f]}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text className="text-slate-500 mt-4">Carregando histórico...</Text>
                </View>
            ) : filtered.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                    <MaterialIcons name="history" size={64} color="#d4d4d8" />
                    <Text className="text-slate-500 mt-4 text-center">
                        {bookings.length === 0 ? "Você ainda não tem atendimentos" : "Nenhum atendimento neste filtro"}
                    </Text>
                </View>
            ) : (
                <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
                    {filtered.map((booking) => {
                        const status = STATUS_CONFIG[booking.status ?? "pending"] ?? STATUS_CONFIG.pending;
                        return (
                            <View key={booking.id} className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1">
                                        <Text className="text-slate-400 text-[13px] mb-1">
                                            {formatDate(booking.scheduled_at)}
                                        </Text>
                                        <Text className="text-slate-900 font-bold text-[18px] mb-1">
                                            {booking.client?.full_name ?? "Cliente"}
                                        </Text>
                                        <Text className="text-slate-500 text-[14px]">
                                            {booking.service?.title ?? "Serviço"}
                                        </Text>
                                    </View>
                                    {booking.total_amount != null && (
                                        <Text className="text-slate-900 font-bold text-[22px]">
                                            R$ {booking.total_amount.toFixed(2).replace(".", ",")}
                                        </Text>
                                    )}
                                </View>

                                <View className={`${status.bg} self-start rounded-full px-3 py-1.5 flex-row items-center mt-2`}>
                                    <MaterialIcons name={status.icon} size={14} color={status.color} />
                                    <Text style={{ color: status.color }} className="font-semibold text-[13px] ml-1">
                                        {status.label}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};
