import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"; // REMOVED for web
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

const { width, height } = Dimensions.get("window");

// Mock Data
const CATEGORIES = [
    { id: 1, name: "Eletricista", icon: "bolt" as const },
    { id: 2, name: "TI & Redes", icon: "laptop" as const },
    { id: 3, name: "Encanador", icon: "faucet" as const, iconSet: "FontAwesome5" },
    { id: 4, name: "Limpeza", icon: "cleaning-services" as const },
    { id: 5, name: "Montador", icon: "handyman" as const },
    { id: 6, name: "Pintor", icon: "format-paint" as const },
];

import { useNavigation } from "@react-navigation/native";

export const ClientHomeScreen: React.FC = () => {
    const navigation = useNavigation();
    return (
        <View className="flex-1 bg-white">

            {/* 1. Background Map MOCK */}
            <View style={{ width: width, height: height, backgroundColor: "#E5E7EB", alignItems: 'center', justifyContent: 'center', borderWidth: 10, borderColor: '#D1D5DB' }}>
                <MaterialIcons name="map" size={80} color="#9CA3AF" />
                <Text className="text-gray-500 mt-4 font-bold text-lg">MAPA INDISPONÍVEL NA WEB</Text>
                <Text className="text-gray-400 text-sm">Use um dispositivo móvel para ver o Google Maps</Text>

                {/* Simulated Pins */}
                <View className="absolute top-[30%] left-[40%] bg-white p-2 rounded-full shadow-md items-center justify-center w-10 h-10">
                    <MaterialIcons name="bolt" size={20} color={colors.primary} />
                </View>
                <View className="absolute top-[45%] left-[20%] bg-white p-2 rounded-full shadow-md items-center justify-center w-10 h-10">
                    <MaterialIcons name="laptop" size={20} color={colors.primary} />
                </View>
                <View className="absolute top-[35%] right-[30%] bg-white p-2 rounded-full shadow-md items-center justify-center w-10 h-10">
                    <MaterialIcons name="cleaning-services" size={20} color={colors.primary} />
                </View>

                {/* User Location Mock */}
                <View className="absolute top-[50%] left-[50%] ml-[-12px] mt-[-12px] w-6 h-6 bg-blue-500 rounded-full border-2 border-white items-center justify-center shadow-md">
                    <View className="w-full h-full rounded-full border-4 border-blue-200/50" />
                </View>
            </View>

            {/* 2. Floating Header */}
            <View className="absolute top-0 w-full px-5 pt-6 z-10">
                {/* Changed SafeAreaView to View for web absolute positioning behavior usually demands it or z-index */}
                <View className="flex-row items-center bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] p-3 px-5 gap-3 h-14 border border-gray-50">
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <TextInput
                        placeholder="O que você precisa hoje?"
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 text-base text-gray-800 font-medium h-full outline-none" // outline-none for web
                        style={{ outlineStyle: 'none' } as any}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Navigating to ClientProfileMenu");
                            navigation.navigate("ClientProfileMenu" as never);
                        }}
                        className="w-10 h-10 rounded-full bg-[#fdf8f6] items-center justify-center border border-orange-100"
                    >
                        {/* Avatar Placeholder */}
                        <Image
                            source={{ uri: "https://i.pravatar.cc/300?img=5" }}
                            className="w-full h-full rounded-full"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* 3. Bottom Sheet Panel */}
            <View className="absolute bottom-0 w-full bg-white rounded-t-[32px] pt-5 pb-8 px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                {/* Handle */}
                <View className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <Text className="text-[19px] font-bold text-gray-900 mb-5 ml-1">Categorias Populares</Text>

                <View className="flex-row flex-wrap gap-3">
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm active:bg-gray-50 mb-1 hover:bg-gray-50 transition-colors"
                            style={{ flexGrow: 1, flexBasis: '45%' }} // Grid-ish layout
                        >
                            <View className="mr-3 w-8 h-8 items-center justify-center bg-slate-50 rounded-full">
                                {cat.name === "Encanador" ? (
                                    <FontAwesome5 name="faucet" size={16} color={colors.primary} />
                                ) : (
                                    <MaterialIcons name={cat.icon as any} size={20} color={colors.primary} />
                                )}
                            </View>
                            <Text className="text-slate-700 font-semibold text-[14px]">{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom Action Button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("AllServices" as never)}
                    className="w-full bg-[#E9D5FF] py-4 rounded-xl items-center justify-center mt-6 active:bg-[#d8b4fe] hover:bg-[#d8b4fe] transition-colors shadow-sm shadow-purple-200"
                >
                    <Text className="text-[#6B21A8] font-bold text-[17px]">Ver todos os serviços</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
