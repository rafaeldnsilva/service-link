import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button, Input } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export const PersonalInfoScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const { user, isProvider } = useAuth(); // Import useAuth
    // Also need 'profile' if we want to pre-fill data, but for now just saving.

    const handleSave = async () => {
        if (!user) return;

        // Simple validation
        if (!fullName || !phone) {
            Alert.alert("Campos obrigatórios", "Por favor, preencha nome e telefone.");
            return;
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    phone: phone,
                    address: address,
                    // bio: bio // Add bio state if needed later
                })
                .eq('id', user.id);

            if (error) {
                console.error("Error updating profile:", error);
                Alert.alert("Erro", "Não foi possível salvar o perfil. Tente novamente.");
            } else {
                // Navigate based on role
                // Since this is "PersonalInfo", it assumes onboarding is done or almost done.
                // If provider -> ProviderMain (stub)
                // If client -> ClientHome
                if (isProvider) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "ProviderMain" }],
                    });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "ClientMain" }],
                    });
                }
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            {/* Top Bar */}
            <View className="flex-row items-center px-4 py-3 bg-white/80 border-b border-gray-200">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center -ml-2"
                >
                    <MaterialIcons name="arrow-back-ios-new" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-lg font-bold text-text-primary-light pr-8">
                    Informações Pessoais
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Profile Photo Placeholder */}
                <View className="items-center mb-8 mt-4">
                    <TouchableOpacity className="relative mb-2">
                        <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden">
                            <MaterialIcons name="photo-camera" size={48} color={colors.textSecondaryLight} />
                        </View>
                        {/* 
                           Note: The design shows "Adicionar Foto" text *below* the circle, 
                           and no plus icon in the HTML provided, but the React implementation had one.
                           The HTML has <p>Adicionar Foto</p> below.
                           I will stick to the HTML design more closely: No plus icon overlay, just the text.
                        */}
                    </TouchableOpacity>
                    <Text className="text-primary font-semibold text-lg mt-2">Adicionar Foto</Text>
                </View>

                {/* Form Fields */}
                <View className="gap-5">
                    {/* Full Name */}
                    <View>
                        <Text className="text-base font-medium text-text-primary-light mb-2">Nome Completo</Text>
                        <Input
                            placeholder="Ex: Joana da Silva"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                            containerStyle={{ borderRadius: 8 }} // rounded-lg
                        />
                    </View>

                    {/* Phone */}
                    <View>
                        <Text className="text-base font-medium text-text-primary-light mb-2">Número de Telefone</Text>
                        <View className="flex-row">
                            <View className="flex-row items-center bg-white border border-slate-300 rounded-l-lg px-3 border-r-0 h-14">
                                <Text className="text-base mr-1 text-text-primary-light">🇧🇷 +55</Text>
                                <MaterialIcons name="expand-more" size={20} color={colors.textSecondaryLight} />
                            </View>
                            <View className="flex-1">
                                <Input
                                    placeholder="Ex: (11) 99999-9999"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    containerStyle={{ borderRadius: 8, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Address */}
                    <View>
                        <Text className="text-base font-medium text-text-primary-light mb-2">Endereço Completo</Text>
                        <View className="relative">
                            <Input
                                placeholder="Comece a digitar seu endereço"
                                value={address}
                                onChangeText={setAddress}
                                containerStyle={{ borderRadius: 8, paddingRight: 40 }}
                            />
                            {/* Icon positioning overlay */}
                            <View className="absolute right-3 top-0 h-14 justify-center pointer-events-none">
                                <MaterialIcons name="location-on" size={24} color={colors.textSecondaryLight} />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="p-4 bg-background-light border-t border-gray-100/50">
                <Button
                    title="Salvar e Continuar"
                    onPress={handleSave}
                    style={{ width: "100%", borderRadius: 8, height: 56 }} // rounded-lg matches design
                />
            </View>
        </SafeAreaView>
    );
};
