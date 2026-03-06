import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

export const AboutScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Sobre o Aplicativo</Text>
            </View>

            <ScrollView className="flex-1 bg-slate-50">
                {/* App Icon & Version */}
                <View className="items-center pt-8 pb-6">
                    <View className="w-32 h-32 bg-red-500 rounded-3xl items-center justify-center shadow-lg mb-4">
                        <MaterialIcons name="link" size={64} color="white" />
                    </View>
                    <Text className="text-[16px] text-slate-500 font-medium">Versão 1.0.0</Text>
                </View>

                {/* About Text */}
                <View className="px-6 pb-8">
                    <Text className="text-3xl font-bold text-slate-900 mb-4">
                        Sobre o ServiceLink
                    </Text>
                    <Text className="text-[16px] text-slate-600 leading-7">
                        ServiceLink é um marketplace móvel que conecta clientes a prestadores de serviços confiáveis, como eletricistas, técnicos de TI e encanadores. Nossa missão é tornar a contratação de serviços locais simples, segura e eficiente.
                    </Text>
                </View>

                {/* Menu Items */}
                <View className="px-4 pb-4">
                    <TouchableOpacity className="bg-white rounded-2xl p-5 mb-3 flex-row items-center active:bg-slate-50">
                        <View className="w-14 h-14 rounded-2xl bg-red-50 items-center justify-center mr-4">
                            <MaterialIcons name="flag" size={28} color="#EF4444" />
                        </View>
                        <Text className="flex-1 text-[18px] font-medium text-slate-900">Nossa Missão</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white rounded-2xl p-5 mb-3 flex-row items-center active:bg-slate-50">
                        <View className="w-14 h-14 rounded-2xl bg-red-50 items-center justify-center mr-4">
                            <MaterialIcons name="star" size={28} color="#EF4444" />
                        </View>
                        <Text className="flex-1 text-[18px] font-medium text-slate-900">Avalie o App</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white rounded-2xl p-5 flex-row items-center active:bg-slate-50">
                        <View className="w-14 h-14 rounded-2xl bg-red-50 items-center justify-center mr-4">
                            <MaterialIcons name="code" size={28} color="#EF4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[18px] font-medium text-slate-900">Conheça Nossos</Text>
                            <Text className="text-[18px] font-medium text-slate-900">Desenvolvedores</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
