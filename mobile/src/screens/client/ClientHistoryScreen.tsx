import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

// Mock Data
const ORDERS = [
    {
        id: 1,
        service: "Serviço de Encanamento",
        provider: "João Silva",
        date: "25 de out. de 2023",
        status: "completed",
        value: "R$ 250,00",
        icon: "plumbing"
    },
    {
        id: 2,
        service: "Eletricista",
        provider: "Maria Oliveira",
        date: "15 de out. de 2023",
        status: "in_progress",
        value: "R$ 200,00 (Est.)",
        icon: "lightbulb"
    },
    {
        id: 3,
        service: "Técnico de TI",
        provider: "Suporte Express",
        date: "28 de set. de 2023",
        status: "cancelled",
        value: "R$ 0,00",
        icon: "computer"
    }
];

export const ClientHistoryScreen: React.FC = () => {
    const [filter, setFilter] = useState("todos");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "#34C759";
            case "in_progress": return "#FF9500";
            case "cancelled": return "#FF3B30";
            default: return "#8A8A8E";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed": return "Concluído";
            case "in_progress": return "Em Andamento";
            case "cancelled": return "Cancelado";
            default: return "";
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-100/50";
            case "in_progress": return "bg-orange-100/50";
            case "cancelled": return "bg-red-100/50";
            default: return "bg-gray-100";
        }
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
                    />
                </View>
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pb-2 max-h-14">
                <FilterChip label="Todos" active={filter === "todos"} onPress={() => setFilter("todos")} />
                <FilterChip label="Concluído" active={filter === "completed"} onPress={() => setFilter("completed")} />
                <FilterChip label="Em Andamento" active={filter === "in_progress"} onPress={() => setFilter("in_progress")} />
                <FilterChip label="Cancelado" active={filter === "cancelled"} onPress={() => setFilter("cancelled")} />
                <View className="w-6" /> {/* Spacer */}
            </ScrollView>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text className="text-lg font-bold text-text-primary-light mb-4">Este Mês</Text>

                {ORDERS.filter(item => item.id <= 2).map((item) => (
                    <View key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="w-12 h-12 bg-slate-50 rounded-xl items-center justify-center">
                                <MaterialIcons name={item.icon as any} size={26} color={colors.textPrimaryLight} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[17px] font-semibold text-text-primary-light mb-0.5">{item.service}</Text>
                                <Text className="text-[13px] text-text-secondary-light">{item.date} - {item.provider}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className={`px-3 py-1.5 rounded-lg ${getStatusBg(item.status)}`}>
                                <Text style={{ color: getStatusColor(item.status), fontSize: 13, fontWeight: "600" }}>
                                    {getStatusText(item.status)}
                                </Text>
                            </View>
                            <Text className="text-[15px] font-semibold text-text-primary-light">
                                {item.status === "completed" ? "Valor Final: " : "Estimativa: "}{item.value}
                            </Text>
                        </View>
                    </View>
                ))}

                <Text className="text-lg font-bold text-text-primary-light mb-4 mt-2">Mês Passado</Text>

                {ORDERS.filter(item => item.id > 2).map((item) => (
                    <View key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="w-12 h-12 bg-slate-50 rounded-xl items-center justify-center">
                                <MaterialIcons name={item.icon as any} size={26} color={colors.textPrimaryLight} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[17px] font-semibold text-text-primary-light mb-0.5">{item.service}</Text>
                                <Text className="text-[13px] text-text-secondary-light">{item.date}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className={`px-3 py-1.5 rounded-lg ${getStatusBg(item.status)}`}>
                                <Text style={{ color: getStatusColor(item.status), fontSize: 13, fontWeight: "600" }}>
                                    {getStatusText(item.status)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
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
