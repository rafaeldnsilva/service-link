import React from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const { width, height } = Dimensions.get("window");

export const ServiceTrackingScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View className="flex-1">
            {/* Map Placeholder */}
            <View style={{ width: width, height: height }} className="bg-slate-200 items-center justify-center">
                <MaterialIcons name="map" size={80} color="#CBD5E1" />
                <Text className="text-slate-500 mt-4 font-semibold">Rastreamento disponível apenas no app móvel</Text>

                {/* Simulated route indicator */}
                <View className="mt-6 flex-row items-center gap-2">
                    <View className="w-3 h-3 bg-blue-500 rounded-full" />
                    <View className="w-20 h-1 bg-blue-300" />
                    <View className="w-3 h-3 bg-primary rounded-full" />
                </View>
            </View>

            {/* Back Button */}
            <SafeAreaView className="absolute top-0 left-0 p-4">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.textPrimaryLight} />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Help Button */}
            <SafeAreaView className="absolute top-0 right-0 p-4">
                <TouchableOpacity className="w-10 h-10 bg-slate-900 rounded-full items-center justify-center shadow-lg">
                    <MaterialIcons name="help-outline" size={24} color="white" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Status Badge */}
            <View className="absolute top-20 left-1/2 -ml-32 bg-white px-6 py-2 rounded-full shadow-lg flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-[13px] font-semibold text-slate-900 mr-1">STATUS: A CAMINHO</Text>
                <Text className="text-[11px] text-slate-500">Atualizado agora</Text>
            </View>

            {/* Bottom Card */}
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pt-4 pb-8 px-6 shadow-2xl">
                {/* Time Badge */}
                <View className="bg-slate-50 rounded-2xl p-4 mb-4 flex-row items-center">
                    <View className="flex-1">
                        <Text className="text-3xl font-bold text-slate-900">15 min</Text>
                        <Text className="text-[13px] text-slate-500">Tempo estimado de chegada</Text>
                    </View>
                    <TouchableOpacity className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
                        <MaterialIcons name="my-location" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Provider Info */}
                <View className="flex-row items-center mb-4">
                    <View className="w-14 h-14 rounded-full overflow-hidden bg-slate-200">
                        <Image
                            source={{ uri: "https://i.pravatar.cc/300?img=33" }}
                            className="w-full h-full"
                        />
                    </View>
                    <View className="flex-1 ml-3">
                        <View className="flex-row items-center">
                            <Text className="text-[17px] font-bold text-slate-900">Joana Silva</Text>
                            <View className="ml-2 flex-row items-center">
                                <MaterialIcons name="star" size={16} color="#FCD34D" />
                                <Text className="text-[14px] font-semibold text-slate-700 ml-1">4.9</Text>
                            </View>
                        </View>
                        <Text className="text-[13px] text-slate-500">Eletricista Certificada</Text>
                        <View className="flex-row items-center mt-1">
                            <MaterialIcons name="directions-car" size={14} color="#64748B" />
                            <Text className="text-[12px] text-slate-500 ml-1">Fiat Fiorino • ABC-1234</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ChatScreen")}
                        className="flex-1 bg-blue-500 py-4 rounded-2xl items-center justify-center flex-row shadow-md active:opacity-90"
                    >
                        <MaterialIcons name="phone" size={20} color="white" />
                        <Text className="text-white font-bold text-[15px] ml-2">Ligar para Prestador</Text>
                    </TouchableOpacity>
                </View>

                {/* Cancel Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mt-3 py-3 items-center"
                >
                    <Text className="text-slate-500 font-semibold text-[15px]">Cancelar Serviço</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
