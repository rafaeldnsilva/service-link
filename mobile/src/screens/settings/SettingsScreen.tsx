import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

export const SettingsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-slate-50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Configurações</Text>
            </View>

            <ScrollView className="flex-1">
                {/* CONTA Section */}
                <View className="px-4 pt-4 pb-2">
                    <Text className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3">CONTA</Text>

                    <View className="bg-white rounded-2xl overflow-hidden">
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ClientEditProfile')}
                            className="flex-row items-center p-4 border-b border-slate-100 active:bg-slate-50"
                        >
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <MaterialIcons name="person" size={24} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[17px] font-medium text-slate-900">Perfil</Text>
                                <Text className="text-[13px] text-slate-500">Editar Informações</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Security')}
                            className="flex-row items-center p-4 border-b border-slate-100 active:bg-slate-50"
                        >
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <MaterialIcons name="security" size={24} color="#3B82F6" />
                            </View>
                            <Text className="flex-1 text-[17px] font-medium text-slate-900">Segurança</Text>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('AddCard')}
                            className="flex-row items-center p-4 active:bg-slate-50"
                        >
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <MaterialIcons name="credit-card" size={24} color="#3B82F6" />
                            </View>
                            <Text className="flex-1 text-[17px] font-medium text-slate-900">Adicionar Método de Pagamento</Text>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* APLICATIVO Section */}
                <View className="px-4 pt-6 pb-2">
                    <Text className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3">APLICATIVO</Text>

                    <View className="bg-white rounded-2xl overflow-hidden">
                        <View className="flex-row items-center p-4 border-b border-slate-100">
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <MaterialIcons name="notifications" size={24} color="#3B82F6" />
                            </View>
                            <Text className="flex-1 text-[17px] font-medium text-slate-900">Notificações</Text>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                                thumbColor="#ffffff"
                            />
                        </View>

                        <TouchableOpacity
                            className="flex-row items-center p-4 border-b border-slate-100 active:bg-slate-50"
                        >
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <MaterialIcons name="lock" size={24} color="#3B82F6" />
                            </View>
                            <Text className="flex-1 text-[17px] font-medium text-slate-900">Privacidade</Text>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center p-4 border-b border-slate-100 active:bg-slate-50"
                        >
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <MaterialIcons name="language" size={24} color="#3B82F6" />
                            </View>
                            <Text className="flex-1 text-[17px] font-medium text-slate-900">Idioma do Aplicativo</Text>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('About')}
                            className="flex-row items-center p-4 active:bg-slate-50"
                        >
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <MaterialIcons name="info" size={24} color="#3B82F6" />
                            </View>
                            <Text className="flex-1 text-[17px] font-medium text-slate-900">Sobre o Aplicativo</Text>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SUPORTE Section */}
                <View className="px-4 pt-6 pb-2">
                    <Text className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3">SUPORTE</Text>

                    <View className="bg-white rounded-2xl overflow-hidden">
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Support')}
                            className="flex-row items-center p-4 border-b border-slate-100 active:bg-slate-50"
                        >
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <MaterialIcons name="help" size={24} color="#3B82F6" />
                            </View>
                            <Text className="flex-1 text-[17px] font-medium text-slate-900">Ajuda e Suporte</Text>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center p-4 active:bg-slate-50"
                        >
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <MaterialIcons name="description" size={24} color="#3B82F6" />
                            </View>
                            <Text className="flex-1 text-[17px] font-medium text-slate-900">Termos de Serviço</Text>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Logout */}
                <View className="px-4 pt-8 pb-4">
                    <TouchableOpacity
                        onPress={() => navigation.reset({ index: 0, routes: [{ name: "Auth" }] })}
                        className="flex-row items-center justify-center py-3 active:opacity-70"
                    >
                        <MaterialIcons name="logout" size={22} color="#EF4444" />
                        <Text className="ml-2 text-red-500 font-bold text-[17px]">Sair</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-center text-slate-400 text-[13px] pb-6">Versão 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};
