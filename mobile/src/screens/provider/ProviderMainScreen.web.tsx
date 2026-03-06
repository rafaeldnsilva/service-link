import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const ProviderMainScreen: React.FC = () => {
    const [isOnline, setIsOnline] = useState(true);

    const handleReject = () => {
        console.log("Service request rejected");
    };

    const handleAccept = () => {
        console.log("Service request accepted");
    };

    return (
        <View className="flex-1">
            <StatusBar barStyle="dark-content" />

            {/* Map Placeholder for Web */}
            <View className="flex-1 bg-slate-200 items-center justify-center">
                <MaterialIcons name="map" size={64} color="#94A3B8" />
                <Text className="text-slate-500 mt-4 text-lg">Mapa (Web)</Text>
            </View>

            {/* Online/Offline Toggle */}
            <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center">
                <View className="bg-[#10B981] rounded-full px-6 py-3 shadow-lg">
                    <Text className="text-white font-bold text-[15px]">
                        {isOnline ? "ONLINE" : "OFFLINE"}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => setIsOnline(!isOnline)}
                    className={`rounded-full px-6 py-3 shadow-lg ${isOnline ? "bg-white" : "bg-[#10B981]"}`}
                >
                    <Text className={`font-bold text-[15px] ${isOnline ? "text-slate-600" : "text-white"}`}>
                        {isOnline ? "ONLINE" : "OFFLINE"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Service Request Card */}
            <View className="absolute bottom-8 left-4 right-4">
                <View className="bg-white rounded-3xl p-6 shadow-2xl">
                    <Text className="text-xl font-bold text-slate-900 mb-3">
                        Novo Pedido: Manutenção de PC
                    </Text>

                    <View className="flex-row items-center mb-4">
                        <View className="flex-row items-center mr-6">
                            <MaterialIcons name="place" size={20} color="#64748B" />
                            <Text className="text-slate-600 ml-1 text-[15px]">Distância: 2.5km</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MaterialIcons name="attach-money" size={20} color="#64748B" />
                            <Text className="text-slate-600 ml-1 text-[15px]">Valor: R$ 80,00</Text>
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={handleReject}
                            className="flex-1 bg-slate-100 py-3.5 rounded-2xl items-center active:bg-slate-200"
                        >
                            <Text className="text-slate-700 font-semibold text-[16px]">Rejeitar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleAccept}
                            className="flex-1 bg-[#10B981] py-3.5 rounded-2xl items-center active:opacity-90"
                        >
                            <Text className="text-white font-bold text-[16px]">Aceitar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};
