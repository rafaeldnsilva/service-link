import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";

interface MenuItem {
    title: string;
    screens: { name: string; route: keyof typeof navigationRoutes }[];
}

const navigationRoutes = {
    // Auth sub-navigator (onboarding + auth + profile)
    Auth: "Auth",

    // Main navigators
    ClientMain: "ClientMain",
    ProviderMain: "ProviderMain",

    // Service flow (root stack)
    AllServices: "AllServices",
    ProviderProfile: "ProviderProfile",
    ServiceConfirmation: "ServiceConfirmation",
    SearchingProvider: "SearchingProvider",
    ServiceTracking: "ServiceTracking",
    ChatScreen: "ChatScreen",
    RateProvider: "RateProvider",

    // Client account
    ClientInfo: "ClientInfo",
    ClientEditProfile: "ClientEditProfile",

    // Settings
    PaymentMethods: "PaymentMethods",
    Notifications: "Notifications",
    Settings: "Settings",
    Security: "Security",
    About: "About",
    Support: "Support",
    AddCard: "AddCard",

    // Provider overlays
    AvailabilityConfig: "AvailabilityConfig",
    SpecialtyRegistration: "SpecialtyRegistration",
    DocumentVerification: "DocumentVerification",
    ServiceAcceptance: "ServiceAcceptance",
} as const;

export const DevMenuScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const menuItems: MenuItem[] = [
        {
            title: "🔀 Navegadores",
            screens: [
                { name: "Auth (Onboarding/Login)", route: "Auth" },
                { name: "Cliente (Tabs)", route: "ClientMain" },
                { name: "Prestador (Tabs)", route: "ProviderMain" },
            ],
        },
        {
            title: "🔧 Cliente - Serviços",
            screens: [
                { name: "Todos os Serviços", route: "AllServices" },
                { name: "Perfil do Prestador", route: "ProviderProfile" },
                { name: "Confirmação", route: "ServiceConfirmation" },
                { name: "Procurando Prestador", route: "SearchingProvider" },
                { name: "Rastreamento", route: "ServiceTracking" },
                { name: "Chat", route: "ChatScreen" },
                { name: "Avaliar Prestador", route: "RateProvider" },
            ],
        },
        {
            title: "👤 Cliente - Conta",
            screens: [
                { name: "Minhas Informações", route: "ClientInfo" },
                { name: "Editar Perfil", route: "ClientEditProfile" },
            ],
        },
        {
            title: "⚙️ Configurações",
            screens: [
                { name: "Métodos de Pagamento", route: "PaymentMethods" },
                { name: "Notificações", route: "Notifications" },
                { name: "Configurações", route: "Settings" },
                { name: "Segurança", route: "Security" },
                { name: "Sobre", route: "About" },
                { name: "Suporte", route: "Support" },
                { name: "Adicionar Cartão", route: "AddCard" },
            ],
        },
        {
            title: "🛠️ Prestador - Overlays",
            screens: [
                { name: "Config. Disponibilidade", route: "AvailabilityConfig" },
                { name: "Registro de Especialidade", route: "SpecialtyRegistration" },
                { name: "Verificação de Documentos", route: "DocumentVerification" },
                { name: "Aceite de Serviço", route: "ServiceAcceptance" },
            ],
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="px-5 py-4 border-b border-slate-700">
                <Text className="text-white font-bold text-2xl">Menu de Desenvolvimento</Text>
                <Text className="text-slate-400 text-sm mt-1">
                    Navegue para qualquer tela do app
                </Text>
            </View>

            <ScrollView className="flex-1 px-5 py-4" contentContainerStyle={{ paddingBottom: 20 }}>
                {menuItems.map((section, sectionIndex) => (
                    <View key={sectionIndex} className="mb-6">
                        <Text className="text-white font-bold text-lg mb-3">{section.title}</Text>
                        <View className="bg-slate-800 rounded-2xl overflow-hidden">
                            {section.screens.map((screen, screenIndex) => (
                                <TouchableOpacity
                                    key={screen.route}
                                    onPress={() => navigation.navigate(screen.route as any)}
                                    className={`flex-row items-center justify-between px-4 py-3.5 active:bg-slate-700 ${
                                        screenIndex < section.screens.length - 1
                                            ? "border-b border-slate-700"
                                            : ""
                                    }`}
                                >
                                    <Text className="text-white text-[15px]">{screen.name}</Text>
                                    <MaterialIcons name="chevron-right" size={22} color="#94A3B8" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};
