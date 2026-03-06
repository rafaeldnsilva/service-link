import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

export const SupportScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-slate-50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Suporte ao Cliente</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Title */}
                <View className="px-6 pt-4 pb-6">
                    <Text className="text-3xl font-bold text-slate-900 leading-tight">
                        Como podemos ajudar?
                    </Text>
                </View>

                {/* Search Bar */}
                <View className="px-4 pb-6">
                    <View className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center border border-slate-200">
                        <MaterialIcons name="search" size={24} color="#9CA3AF" />
                        <TextInput
                            placeholder="Pesquisar na Ajuda"
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 ml-3 text-[16px] text-slate-900"
                        />
                    </View>
                </View>

                {/* Support Options */}
                <View className="px-4 pb-4">
                    <TouchableOpacity className="bg-white rounded-2xl p-5 mb-3 active:bg-slate-50">
                        <View className="flex-row items-center">
                            <View className="w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center mr-4">
                                <MaterialIcons name="help" size={32} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[18px] font-semibold text-slate-900 mb-1">
                                    Perguntas Frequentes
                                </Text>
                                <Text className="text-[14px] text-slate-500">
                                    Encontre respostas para dúvidas comuns
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("ChatScreen")}
                        className="bg-white rounded-2xl p-5 mb-3 active:bg-slate-50"
                    >
                        <View className="flex-row items-center">
                            <View className="w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center mr-4">
                                <MaterialIcons name="headset-mic" size={32} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[18px] font-semibold text-slate-900 mb-1">
                                    Contatar Suporte
                                </Text>
                                <Text className="text-[14px] text-slate-500">
                                    Chat, email ou telefone
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white rounded-2xl p-5 mb-3 active:bg-slate-50">
                        <View className="flex-row items-center">
                            <View className="w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center mr-4">
                                <MaterialIcons name="report-problem" size={32} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[18px] font-semibold text-slate-900 mb-1">
                                    Reportar um Problema
                                </Text>
                                <Text className="text-[14px] text-slate-500">
                                    Abra um chamado para nossa equipe
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white rounded-2xl p-5 active:bg-slate-50">
                        <View className="flex-row items-center">
                            <View className="w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center mr-4">
                                <MaterialIcons name="shield" size={32} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[18px] font-semibold text-slate-900 mb-1">
                                    Termos e Privacidade
                                </Text>
                                <Text className="text-[14px] text-slate-500">
                                    Consulte nossos termos de serviço
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
