import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"; // MaterialCommunityIcons useful for 'credit-card-outline' etc if needed
import { colors } from "../../theme/colors";
import { Button } from "../../components";
import { useNavigation } from "@react-navigation/native";

export const ClientEditProfileScreen: React.FC = () => {
    const navigation = useNavigation();
    // Basic mock state
    const [name, setName] = useState("Ana Souza");
    const [phone, setPhone] = useState("(11) 99876-5432"); // Updated mock value
    const [address, setAddress] = useState("Rua das Flores, 123, Jardim Botânico\nCuritiba - PR, 80210-340"); // Updated mock value

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Top App Bar */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-white sticky top-0 z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center rounded-full active:bg-slate-100"
                >
                    <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text className="text-slate-900 text-lg font-bold flex-1 text-center pr-10">
                    Editar Perfil
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Profile Header (Avatar) */}
                <View className="flex-col items-center pt-2 pb-8 px-6">
                    <View className="relative mb-4">
                        <View className="h-32 w-32 rounded-full shadow-lg overflow-hidden bg-[#F5D7C8]">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/300?img=5" }}
                                className="w-full h-full"
                            />
                        </View>
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full border-4 border-white items-center justify-center shadow-md">
                            <MaterialIcons name="photo-camera" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Alterar foto Text */}
                    <TouchableOpacity>
                        <Text className="text-blue-600 text-[15px] font-semibold">Alterar foto de perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View className="px-6 flex-col gap-5">
                    {/* Nome Completo */}
                    <View>
                        <Text className="text-slate-700 text-[15px] font-semibold mb-2">Nome Completo</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            className="w-full bg-white rounded-2xl py-4 px-5 text-[16px] text-slate-900 border border-slate-200"
                            placeholderTextColor="#CBD5E1"
                        />
                    </View>

                    {/* Número de Telefone */}
                    <View>
                        <Text className="text-slate-700 text-[15px] font-semibold mb-2">Número de Telefone</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholder="(00) 00000-0000"
                            className="w-full bg-white rounded-2xl py-4 px-5 text-[16px] text-slate-900 border border-slate-200"
                            placeholderTextColor="#CBD5E1"
                        />
                    </View>

                    {/* Endereço Completo */}
                    <View>
                        <Text className="text-slate-700 text-[15px] font-semibold mb-2">Endereço Completo</Text>
                        <TextInput
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            numberOfLines={4}
                            placeholder="Rua, número, bairro..."
                            className="w-full bg-white rounded-2xl py-4 px-5 text-[16px] text-slate-900 border border-slate-200"
                            placeholderTextColor="#CBD5E1"
                            style={{ minHeight: 120, textAlignVertical: 'top' }}
                        />
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="px-6 mt-10 gap-3">
                    <TouchableOpacity
                        className="w-full bg-blue-600 py-4 rounded-2xl items-center justify-center shadow-lg shadow-blue-200 active:bg-blue-700"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="text-white font-bold text-[17px]">Salvar Alterações</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full py-4 items-center justify-center rounded-2xl active:bg-slate-50"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="text-slate-400 font-medium text-[16px]">Cancelar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};
