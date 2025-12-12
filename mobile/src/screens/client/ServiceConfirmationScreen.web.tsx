import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const { width, height } = Dimensions.get("window");

export const ServiceConfirmationScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View className="flex-1 bg-white">
            {/* Background Map Placeholder */}
            <View style={{ width: width, height: height }} className="bg-slate-200 items-center justify-center">
                <MaterialIcons name="map" size={80} color="#CBD5E1" />
                <Text className="text-slate-500 mt-4 font-semibold">Mapa disponível apenas no app móvel</Text>
            </View>

            {/* Bottom Sheet */}
            <View className="absolute bottom-0 w-full bg-white rounded-t-[32px] pt-3 pb-8 px-6 shadow-2xl">
                {/* Handle */}
                <View className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

                {/* Service Title */}
                <Text className="text-2xl font-bold text-slate-900 mb-1 text-center">
                    Instalação Elétrica
                </Text>

                {/* Price Range */}
                <Text className="text-xl font-bold text-slate-900 mb-6 text-center">
                    R$ 120,00 - R$ 150,00
                </Text>

                {/* Info Items */}
                <View className="mb-6 gap-3">
                    {/* Arrival Time */}
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-slate-900 items-center justify-center">
                            <MaterialIcons name="access-time" size={20} color="white" />
                        </View>
                        <Text className="ml-3 text-[15px] text-slate-700">Chegada em ~15 min</Text>
                    </View>

                    {/* Payment Method */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-full bg-slate-900 items-center justify-center">
                                <MaterialIcons name="credit-card" size={20} color="white" />
                            </View>
                            <Text className="ml-3 text-[15px] text-slate-700">Cartão de Crédito •••• 4242</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("PaymentMethods")}>
                            <Text className="text-[15px] font-semibold text-primary">Alterar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("SearchingProvider")}
                    className="w-full bg-primary py-4 rounded-2xl items-center justify-center shadow-lg shadow-purple-200 active:opacity-90 mb-3"
                >
                    <Text className="text-white font-bold text-[17px]">Solicitar Eletricista Agora</Text>
                </TouchableOpacity>

                {/* Verified Badge */}
                <View className="flex-row items-center justify-center gap-1">
                    <MaterialIcons name="verified" size={16} color="#10B981" />
                    <Text className="text-[13px] text-slate-600">Profissionais verificados</Text>
                </View>
            </View>
        </View>
    );
};
