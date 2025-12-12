import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

interface FeatureCardProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <View className="flex-row gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <MaterialCommunityIcons name={icon} size={28} color={colors.textPrimaryLight} />
        <View className="flex-1 gap-1">
            <Text className="text-text-primary-light text-base font-bold">
                {title}
            </Text>
            <Text className="text-text-secondary-light text-sm font-normal">
                {description}
            </Text>
        </View>
    </View>
);

export const HowItWorksScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const features = [
        {
            icon: "magnify" as const,
            title: "Encontre seu profissional",
            description: "Pesquise por categoria ou localização para encontrar o especialista certo.",
        },
        {
            icon: "calendar-edit" as const,
            title: "Solicite o serviço",
            description: "Descreva o que você precisa, agende e envie sua solicitação.",
        },
        {
            icon: "map-marker" as const,
            title: "Acompanhe em tempo real",
            description: "Veja o status do seu serviço e a chegada do profissional em tempo real.",
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 pb-2">
                <Text className="text-text-primary-light text-lg font-bold tracking-tight flex-1">
                    Como Funciona
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("GetStarted")}>
                    <Text className="text-text-secondary-light text-base font-bold">
                        Pular
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 p-4">
                <View className="gap-4">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="mt-auto">
                {/* Pagination Dots */}
                <View className="flex-row items-center justify-center gap-3 py-5">
                    <View className="h-2 w-2 rounded-full bg-text-primary-light" />
                    <View className="h-2 w-2 rounded-full bg-slate-300" />
                    <View className="h-2 w-2 rounded-full bg-slate-300" />
                </View>

                {/* Button */}
                <View className="px-4 py-3 pb-8">
                    <Button
                        title="Próximo"
                        onPress={() => navigation.navigate("GetStarted")}
                        style={{ width: "100%" }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};
