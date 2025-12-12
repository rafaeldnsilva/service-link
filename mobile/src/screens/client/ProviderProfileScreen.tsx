import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const SERVICES = [
    {
        id: 1,
        title: "Instalação de Tomadas",
        description: "Instalação e troca de tomadas e interruptores.",
        price: "R$ 80"
    },
    {
        id: 2,
        title: "Troca de Disjuntores",
        description: "Substituição de disjuntores antigos ou defeituosos.",
        price: "R$ 120"
    },
    {
        id: 3,
        title: "Projeto de Iluminação",
        description: "Planejamento e instalação de sistemas de iluminação.",
        price: "R$ 150/hora"
    },
    {
        id: 4,
        title: "Manutenção Preventiva",
        description: "Revisão completa da instalação elétrica.",
        price: "R$ 250"
    },
];

export const ProviderProfileScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [activeTab, setActiveTab] = useState<"services" | "portfolio" | "reviews">("services");

    const handleShare = async () => {
        try {
            await Share.share({
                message: "Confira o perfil deste prestador no ServiceLink!",
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-[20px] font-bold text-slate-900">
                    Perfil do Prestador
                </Text>
                <TouchableOpacity onPress={handleShare} className="w-10 items-end">
                    <MaterialIcons name="share" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
            </View>

            <ScrollView className="bg-slate-50">
                {/* Profile Card */}
                <View className="mx-4 mt-4 mb-4 bg-white rounded-3xl p-6 shadow-sm">
                    <View className="flex-row items-start gap-4">
                        <View className="w-28 h-28 rounded-full overflow-hidden bg-slate-200">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/300?img=12" }}
                                className="w-full h-full"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[24px] font-bold text-slate-900 mb-1">José Carlos</Text>
                            <Text className="text-[15px] text-slate-400 mb-2">Eletricista Residencial</Text>
                            <View className="flex-row items-center">
                                <MaterialIcons name="star" size={20} color="#FCD34D" />
                                <Text className="text-[16px] font-bold text-slate-900 ml-1">4.8</Text>
                                <Text className="text-[14px] text-slate-400 ml-1">(124 avaliações)</Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-[14px] text-slate-500 leading-6 mt-4">
                        Eletricista com mais de 10 anos de experiência, especializado em instalações seguras e eficientes para residências e empresas.
                    </Text>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-white border-b border-slate-200">
                    <TouchableOpacity
                        onPress={() => setActiveTab("services")}
                        className={`flex-1 pb-3 pt-3 ${activeTab === "services" ? "border-b-[3px] border-primary" : ""}`}
                    >
                        <Text className={`text-center text-[15px] font-bold ${activeTab === "services" ? "text-primary" : "text-slate-400"}`}>
                            Serviços
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab("portfolio")}
                        className={`flex-1 pb-3 pt-3 ${activeTab === "portfolio" ? "border-b-[3px] border-primary" : ""}`}
                    >
                        <Text className={`text-center text-[15px] font-bold ${activeTab === "portfolio" ? "text-primary" : "text-slate-400"}`}>
                            Portfólio
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab("reviews")}
                        className={`flex-1 pb-3 pt-3 ${activeTab === "reviews" ? "border-b-[3px] border-primary" : ""}`}
                    >
                        <Text className={`text-center text-[15px] font-bold ${activeTab === "reviews" ? "text-primary" : "text-slate-400"}`}>
                            Avaliações
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content - Services */}
                {activeTab === "services" && (
                    <View className="bg-white pb-32">
                        {SERVICES.map((service, index) => (
                            <View
                                key={service.id}
                                className={`px-4 py-5 ${index < SERVICES.length - 1 ? "border-b border-slate-100" : ""}`}
                            >
                                <View className="flex-row items-start justify-between mb-2">
                                    <Text className="flex-1 text-[18px] font-bold text-slate-900">
                                        {service.title}
                                    </Text>
                                    <Text className="text-[16px] font-bold text-slate-900 ml-3">
                                        {service.price}
                                    </Text>
                                </View>
                                <Text className="text-[13px] text-slate-500 leading-5">
                                    {service.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Tab Content - Portfolio */}
                {activeTab === "portfolio" && (
                    <View className="bg-white pb-32">
                        <Text className="text-center text-slate-500 py-8">Nenhum item no portfólio ainda</Text>
                    </View>
                )}

                {/* Tab Content - Reviews */}
                {activeTab === "reviews" && (
                    <View className="bg-white pb-32">
                        <Text className="text-center text-slate-500 py-8">Nenhuma avaliação ainda</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-2xl flex-row gap-3">
                <TouchableOpacity
                    onPress={() => navigation.navigate("ChatScreen")}
                    className="flex-1 bg-white py-4 rounded-3xl items-center justify-center active:bg-slate-50"
                >
                    <Text className="text-slate-700 font-bold text-[17px]">Enviar Mensagem</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("ServiceConfirmation")}
                    className="flex-1 bg-[#1a0a3e] py-4 rounded-3xl items-center justify-center active:opacity-90"
                >
                    <Text className="text-white font-bold text-[17px]">Cancelar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
