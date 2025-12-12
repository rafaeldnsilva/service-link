import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const SERVICES = {
    "Manutenção Residencial": [
        { id: 1, name: "Eletricista", icon: "bolt", iconSet: "MaterialIcons" },
        { id: 2, name: "Encanador", icon: "faucet", iconSet: "FontAwesome5" },
        { id: 3, name: "Montador", icon: "handyman", iconSet: "MaterialIcons" },
    ],
    "Tecnologia": [
        { id: 4, name: "TI & Redes", icon: "laptop", iconSet: "MaterialIcons" },
        { id: 5, name: "Reparo de Computadores", icon: "computer", iconSet: "MaterialIcons" },
    ],
    "Serviços Gerais": [
        { id: 6, name: "Limpeza", icon: "cleaning-services", iconSet: "MaterialIcons" },
        { id: 7, name: "Fretes e Mudanças", icon: "local-shipping", iconSet: "MaterialIcons" },
        { id: 8, name: "Jardinagem", icon: "spa", iconSet: "MaterialIcons" },
    ],
};

export const AllServicesScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-[20px] font-bold text-slate-900">
                    Todos os Serviços
                </Text>
                <View className="w-10" />
            </View>

            {/* Search Bar */}
            <View className="px-4 py-4 bg-slate-50">
                <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-slate-200">
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <TextInput
                        placeholder="Qual serviço você precisa?"
                        placeholderTextColor="#B0B0B0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-[15px] text-slate-900"
                    />
                </View>
            </View>

            {/* Services List */}
            <ScrollView className="bg-slate-50" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>
                {Object.entries(SERVICES).map(([category, services]) => (
                    <View key={category} className="mb-6">
                        <Text className="text-[19px] font-bold text-slate-900 mb-3">{category}</Text>
                        {services.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                onPress={() => navigation.navigate("ProviderProfile")}
                                className="flex-row items-center bg-white rounded-xl p-4 mb-3 active:bg-slate-50"
                            >
                                {service.iconSet === "FontAwesome5" ? (
                                    <FontAwesome5 name={service.icon} size={28} color={colors.primary} />
                                ) : (
                                    <MaterialIcons name={service.icon as any} size={32} color={colors.primary} />
                                )}
                                <Text className="flex-1 ml-4 text-[17px] font-medium text-slate-900">
                                    {service.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};
