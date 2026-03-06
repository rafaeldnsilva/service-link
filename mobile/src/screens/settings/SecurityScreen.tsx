import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";

export const SecurityScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { signOut } = useAuth();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);

    const appVersion = Constants.expoConfig?.version ?? "1.0.0";

    const handleChangePassword = () => {
        navigation.navigate("ForgotPassword");
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Excluir conta",
            "Tem certeza? Esta ação é irreversível. Todos os seus dados serão apagados permanentemente.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-slate-50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <MaterialIcons name="arrow-back-ios" size={22} color="#3B82F6" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Segurança</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Status Card */}
                <View className="mx-4 mt-4 mb-6 bg-green-500 rounded-3xl p-6 flex-row items-center">
                    <View className="w-16 h-16 bg-white/30 rounded-full items-center justify-center mr-4">
                        <MaterialIcons name="verified-user" size={32} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-white mb-1">Tudo seguro</Text>
                        <Text className="text-[15px] text-white/90">Sua conta está protegida.</Text>
                    </View>
                </View>

                {/* LOGIN & RECUPERAÇÃO */}
                <View className="px-4 pb-4">
                    <Text className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3">LOGIN & RECUPERAÇÃO</Text>

                    <View className="bg-white rounded-2xl overflow-hidden">
                        <TouchableOpacity className="p-4 border-b border-slate-100 active:bg-slate-50" onPress={handleChangePassword}>
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                    <MaterialIcons name="lock" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[17px] font-medium text-slate-900">Alterar Senha</Text>
                                    <Text className="text-[13px] text-slate-500">Altere sua senha de acesso</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                            </View>
                        </TouchableOpacity>

                        <View className="p-4 active:bg-slate-50">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                    <MaterialIcons name="verified-user" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[17px] font-medium text-slate-900">Autenticação de Dois Fat...</Text>
                                    <Text className="text-[13px] text-slate-500">Maior proteção para sua conta</Text>
                                </View>
                                <Switch
                                    value={twoFactorEnabled}
                                    onValueChange={setTwoFactorEnabled}
                                    trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                                    thumbColor="#ffffff"
                                />
                            </View>
                        </View>
                    </View>

                    <Text className="text-[13px] text-slate-500 mt-3 px-1 leading-5">
                        Recomendamos ativar a verificação em duas etapas para evitar acessos não autorizados.
                    </Text>
                </View>

                {/* BIOMETRIA */}
                <View className="px-4 pb-4 pt-2">
                    <Text className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3">BIOMETRIA</Text>

                    <View className="bg-white rounded-2xl overflow-hidden">
                        <View className="p-4">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                    <MaterialIcons name="fingerprint" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[17px] font-medium text-slate-900">Entrar com FaceID</Text>
                                </View>
                                <Switch
                                    value={faceIdEnabled}
                                    onValueChange={setFaceIdEnabled}
                                    trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                                    thumbColor="#ffffff"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* MONITORAMENTO */}
                <View className="px-4 pb-4 pt-2">
                    <Text className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3">MONITORAMENTO</Text>

                    <View className="bg-white rounded-2xl overflow-hidden">
                        <TouchableOpacity className="p-4 border-b border-slate-100 active:bg-slate-50">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                    <MaterialIcons name="devices" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[17px] font-medium text-slate-900">Sessões Ativas</Text>
                                    <Text className="text-[13px] text-slate-500">Gerencie sessões ativas</Text>
                                </View>
                                <View className="bg-slate-100 px-2 py-1 rounded-full mr-2">
                                    <Text className="text-[13px] font-semibold text-slate-700">2</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="p-4 active:bg-slate-50">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                                    <MaterialIcons name="history" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[17px] font-medium text-slate-900">Atividade da Conta</Text>
                                    <Text className="text-[13px] text-slate-500">Veja logins recentes</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* PRIVACIDADE & DADOS */}
                <View className="px-4 pb-4 pt-2">
                    <Text className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-3">PRIVACIDADE & DADOS</Text>

                    <TouchableOpacity className="flex-row items-center py-3 active:opacity-70">
                        <Text className="flex-1 text-[17px] font-medium text-slate-900">Solicitar meus dados</Text>
                        <MaterialIcons name="file-download" size={24} color="#64748B" />
                    </TouchableOpacity>

                    <TouchableOpacity className="py-3 active:opacity-70" onPress={handleDeleteAccount}>
                        <Text className="text-[17px] font-medium text-red-500">Excluir conta</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Info */}
                <View className="px-4 pb-6">
                    <Text className="text-[13px] text-slate-500 text-center leading-5">
                        Se você notar qualquer atividade suspeita em sua conta, entre em contato imediatamente com o{" "}
                        <Text className="text-blue-500 font-medium">suporte ao cliente</Text>.
                    </Text>
                </View>

                <Text className="text-center text-slate-400 text-[12px] pb-6">
                    ServiceLink v{appVersion}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};
