import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

export const ClientInfoScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-slate-50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-[20px] font-bold text-slate-900">
                    Minhas Informações
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* Profile Avatar */}
                <View className="flex-col items-center pt-4 pb-8">
                    <View className="relative mb-4">
                        <View className="h-36 w-36 rounded-full overflow-hidden bg-[#F5D7C8]">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/300?img=5" }}
                                className="w-full h-full"
                            />
                        </View>
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-600 p-3.5 rounded-full border-4 border-white items-center justify-center shadow-lg">
                            <MaterialIcons name="photo-camera" size={22} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Alterar foto Text */}
                    <TouchableOpacity>
                        <Text className="text-blue-600 text-[16px] font-semibold">Alterar foto de perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* Info Fields */}
                <View className="gap-6">
                    {/* Nome Completo */}
                    <View>
                        <Text className="text-slate-500 text-[13px] font-bold mb-3 uppercase tracking-wide">
                            NOME COMPLETO
                        </Text>
                        <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center border border-slate-100">
                            <MaterialIcons name="person" size={24} color="#94A3B8" />
                            <Text className="ml-3 text-[17px] text-slate-900">Ana Souza</Text>
                        </View>
                    </View>

                    {/* Número de Telefone */}
                    <View>
                        <Text className="text-slate-500 text-[13px] font-bold mb-3 uppercase tracking-wide">
                            NÚMERO DE TELEFONE
                        </Text>
                        <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center border border-slate-100">
                            <MaterialIcons name="phone" size={24} color="#94A3B8" />
                            <Text className="ml-3 text-[17px] text-slate-900">(11) 99876-5432</Text>
                        </View>
                    </View>

                    {/* Endereço Completo */}
                    <View>
                        <Text className="text-slate-500 text-[13px] font-bold mb-3 uppercase tracking-wide">
                            ENDEREÇO COMPLETO
                        </Text>
                        <View className="bg-white rounded-2xl px-4 py-4 flex-row items-start border border-slate-100">
                            <MaterialIcons name="place" size={24} color="#94A3B8" className="mt-0.5" />
                            <View className="ml-3 flex-1">
                                <Text className="text-[17px] text-slate-900 leading-6">
                                    Rua das Flores, 123, Jardim Botânico
                                </Text>
                                <Text className="text-[17px] text-slate-900 leading-6 mt-1">
                                    Curitiba - PR, 80210-340
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Edit Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-slate-50 px-6 py-4">
                <TouchableOpacity
                    onPress={() => navigation.navigate("ClientEditProfile")}
                    className="w-full bg-blue-600 py-4 rounded-3xl items-center justify-center shadow-lg shadow-blue-200 active:opacity-90 flex-row"
                >
                    <MaterialIcons name="edit" size={22} color="white" />
                    <Text className="text-white font-bold text-[18px] ml-2">Editar Informações</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
