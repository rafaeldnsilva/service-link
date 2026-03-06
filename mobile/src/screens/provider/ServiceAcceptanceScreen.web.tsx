import React from "react";
import { View, Text, TouchableOpacity, StatusBar, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";

export const ServiceAcceptanceScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleCall = () => {
        Linking.openURL("tel:+5511999999999");
    };

    const handleMessage = () => {
        console.log("Opening chat");
        navigation.navigate("ChatScreen");
    };

    const handleArrived = () => {
        console.log("Provider arrived at location");
    };

    return (
        <View className="flex-1">
            <StatusBar barStyle="dark-content" />

            {/* Map Placeholder for Web */}
            <View className="flex-1 bg-[#5F9EA0] items-center justify-center">
                <MaterialIcons name="map" size={64} color="#4A90A4" />
                <Text className="text-white mt-4 text-lg">Mapa com Rota (Web)</Text>
            </View>

            <SafeAreaView className="flex-1" edges={["top"]}>
                {/* ETA Card */}
                <View className="mx-4 mt-4">
                    <View className="bg-white rounded-full py-4 px-6 items-center shadow-lg">
                        <Text className="text-slate-600 text-[13px] font-medium tracking-wider">
                            CHEGADA EM
                        </Text>
                        <Text className="text-slate-900 font-bold text-[28px] -mt-1">14 min</Text>
                    </View>
                </View>
            </SafeAreaView>

            {/* Bottom Section */}
            <SafeAreaView className="absolute bottom-0 left-0 right-0" edges={["bottom"]}>
                <View className="px-4 pb-4">
                    {/* Client Info Card */}
                    <View className="bg-white rounded-3xl p-5 mb-3 shadow-xl">
                        <View className="flex-row items-center mb-4">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/300?img=12" }}
                                className="w-14 h-14 rounded-full mr-4"
                            />
                            <View className="flex-1">
                                <Text className="text-slate-900 font-bold text-[19px] mb-1">
                                    Carlos Silva
                                </Text>
                                <Text className="text-slate-600 text-[15px]">Manutenção de PC</Text>
                            </View>
                        </View>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleCall}
                                className="flex-1 bg-blue-50 py-3 rounded-2xl flex-row items-center justify-center active:bg-blue-100"
                            >
                                <MaterialIcons name="phone" size={20} color="#3B82F6" />
                                <Text className="text-blue-600 font-semibold text-[15px] ml-2">
                                    Ligar para Cli...
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleMessage}
                                className="flex-1 bg-blue-50 py-3 rounded-2xl flex-row items-center justify-center active:bg-blue-100"
                            >
                                <MaterialIcons name="message" size={20} color="#3B82F6" />
                                <Text className="text-blue-600 font-semibold text-[15px] ml-2">
                                    Enviar Mens...
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Arrived Button */}
                    <TouchableOpacity
                        onPress={handleArrived}
                        className="bg-[#10B981] py-4 rounded-3xl items-center justify-center active:opacity-90 shadow-lg"
                    >
                        <Text className="text-white font-bold text-[18px]">Cheguei ao Local</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};
