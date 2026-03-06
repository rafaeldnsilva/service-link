import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../services/supabaseService";
import { Database } from "../../types/supabase";

type BookingStatus = Database['public']['Enums']['booking_status'];

type Booking = Database['public']['Tables']['bookings']['Row'] & {
    service?: Database['public']['Tables']['services']['Row'];
    provider?: Database['public']['Tables']['profiles']['Row'];
};

// Category icon mapping
const CATEGORY_ICONS: Record<string, string> = {
    "Eletricista": "electrical-services",
    "Encanador": "plumbing",
    "Pintor": "format-paint",
    "Faxina": "cleaning-services",
    "Limpeza": "cleaning-services",
    "TI & Redes": "computer",
    "Montador": "construction",
    "Jardinagem": "yard",
    "Fretes": "local-shipping",
};

export const ClientHistoryScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();
    const [filter, setFilter] = useState<"todos" | BookingStatus>("todos");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user) {
            loadBookings();
        }
    }, [user]);

    useEffect(() => {
        let filtered = bookings;

        // Apply status filter
        if (filter !== "todos") {
            filtered = filtered.filter(b => b.status === filter);
        }

        // Apply search filter
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(b =>
                b.service?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.provider?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBookings(filtered);
    }, [filter, searchQuery, bookings]);

    const loadBookings = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await bookingService.getClientBookings(user.id);
            setBookings(data);
            setFilteredBookings(data);
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "#34C759";
            case "in_progress": return "#FF9500";
            case "cancelled": return "#FF3B30";
            default: return "#8A8A8E";
        }
    };

    const getStatusText = (status: BookingStatus) => {
        switch (status) {
            case "completed": return "Concluído";
            case "accepted": return "Aceito";
            case "pending": return "Pendente";
            case "cancelled": return "Cancelado";
            default: return "";
        }
    };

    const getStatusBg = (status: BookingStatus) => {
        switch (status) {
            case "completed": return "bg-green-100/50";
            case "accepted": return "bg-blue-100/50";
            case "pending": return "bg-orange-100/50";
            case "cancelled": return "bg-red-100/50";
            default: return "bg-gray-100";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getIconForCategory = (category: string | undefined): any => {
        if (!category) return "build";
        return CATEGORY_ICONS[category] || "build";
    };

    const handleCancel = (bookingId: string) => {
        Alert.alert(
            "Cancelar pedido",
            "Tem certeza que deseja cancelar este pedido?",
            [
                { text: "Não", style: "cancel" },
                {
                    text: "Sim, cancelar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await bookingService.cancelBooking(bookingId);
                            loadBookings();
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível cancelar o pedido.");
                        }
                    },
                },
            ]
        );
    };

    const handleRate = (bookingId: string, providerId: string) => {
        navigation.navigate("RateProvider", { bookingId, providerId });
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            {/* Header */}
            <View className="flex-row items-center p-4 bg-background-light border-b border-gray-100 shadow-sm z-10">
                <View className="w-10">
                    {/* Placeholder for back or menu if needed */}
                </View>
                <Text className="flex-1 text-center text-lg font-bold text-text-primary-light">
                    Histórico de Pedidos
                </Text>
                <View className="w-10" />
            </View>

            {/* Search */}
            <View className="p-4 bg-background-light">
                <View className="flex-row items-center bg-white rounded-lg h-12 shadow-sm border border-gray-200/50 px-3">
                    <MaterialIcons name="search" size={24} color="#8A8A8E" />
                    <TextInput
                        placeholder="Buscar por serviço ou profissional"
                        placeholderTextColor="#8A8A8E"
                        className="flex-1 ml-2 text-base text-text-primary-light h-full"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pb-2 max-h-14">
                <FilterChip label="Todos" active={filter === "todos"} onPress={() => setFilter("todos")} />
                <FilterChip label="Concluído" active={filter === "completed"} onPress={() => setFilter("completed")} />
                <FilterChip label="Aceito" active={filter === "accepted"} onPress={() => setFilter("accepted")} />
                <FilterChip label="Pendente" active={filter === "pending"} onPress={() => setFilter("pending")} />
                <FilterChip label="Cancelado" active={filter === "cancelled"} onPress={() => setFilter("cancelled")} />
                <View className="w-6" /> {/* Spacer */}
            </ScrollView>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text className="text-text-secondary-light mt-4">Carregando histórico...</Text>
                </View>
            ) : filteredBookings.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                    <MaterialIcons name="history" size={64} color="#d4d4d8" />
                    <Text className="text-text-secondary-light mt-4 text-center">
                        {searchQuery ? "Nenhum pedido encontrado" : "Você ainda não tem pedidos"}
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {filteredBookings.map((booking) => (
                        <View key={booking.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                            <View className="flex-row items-center gap-3 mb-4">
                                <View className="w-12 h-12 bg-slate-50 rounded-xl items-center justify-center">
                                    <MaterialIcons
                                        name={getIconForCategory(booking.service?.category)}
                                        size={26}
                                        color={colors.textPrimaryLight}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[17px] font-semibold text-text-primary-light mb-0.5">
                                        {booking.service?.title || 'Serviço'}
                                    </Text>
                                    <Text className="text-[13px] text-text-secondary-light">
                                        {formatDate(booking.scheduled_at)} - {booking.provider?.full_name || 'Prestador'}
                                    </Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                            </View>

                            <View className="flex-row justify-between items-center">
                                <View className={`px-3 py-1.5 rounded-lg ${getStatusBg(booking.status || 'pending')}`}>
                                    <Text style={{
                                        color: getStatusColor(booking.status || 'pending'),
                                        fontSize: 13,
                                        fontWeight: "600"
                                    }}>
                                        {getStatusText(booking.status || 'pending')}
                                    </Text>
                                </View>
                                {booking.total_amount && (
                                    <Text className="text-[15px] font-semibold text-text-primary-light">
                                        R$ {booking.total_amount.toFixed(2)}
                                    </Text>
                                )}
                            </View>

                            {/* Action buttons */}
                            {(booking.status === "pending" || booking.status === "accepted") && (
                                <TouchableOpacity
                                    onPress={() => handleCancel(booking.id)}
                                    className="mt-3 py-2.5 rounded-xl border border-red-200 items-center active:bg-red-50"
                                >
                                    <Text className="text-red-500 font-semibold text-[14px]">Cancelar Pedido</Text>
                                </TouchableOpacity>
                            )}
                            {booking.status === "completed" && booking.provider_id && (
                                <TouchableOpacity
                                    onPress={() => handleRate(booking.id, booking.provider_id!)}
                                    className="mt-3 py-2.5 rounded-xl bg-primary/10 items-center active:bg-primary/20"
                                >
                                    <Text className="text-primary font-semibold text-[14px]">Avaliar Prestador</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const FilterChip: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        className={`h-9 px-4 rounded-full items-center justify-center mr-3 border ${active ? "bg-primary border-primary" : "bg-white border-gray-200"
            }`}
    >
        <Text className={`text-sm font-medium ${active ? "text-white" : "text-text-primary-light"}`}>
            {label}
        </Text>
    </TouchableOpacity>
);
