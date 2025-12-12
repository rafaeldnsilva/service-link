import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

type RoleType = "client" | "provider" | null;

export const RoleSelectionScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [selectedRole, setSelectedRole] = useState<RoleType>(null);

    const handleContinue = () => {
        if (selectedRole) {
            navigation.navigate("PersonalInfo");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            <View className="flex-1 w-full max-w-md mx-auto">
                {/* Header */}
                <View className="flex-row items-center p-4 pb-2 bg-background-light z-10">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimaryLight} />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-lg font-bold text-text-primary-light tracking-tight">
                        Selecione sua função
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 }}>
                    <Text className="text-center text-text-secondary-light text-base font-normal mb-6">
                        Como você usará o ServiceLink?
                    </Text>

                    <View className="gap-4">
                        {/* Client Card */}
                        <RoleCard
                            title="Cliente"
                            description="Para contratar serviços e encontrar profissionais."
                            icon="person"
                            selected={selectedRole === "client"}
                            onPress={() => setSelectedRole("client")}
                        />

                        {/* Provider Card */}
                        <RoleCard
                            title="Prestador de Serviços"
                            description="Para oferecer seus serviços e encontrar clientes."
                            icon="construction"
                            selected={selectedRole === "provider"}
                            onPress={() => setSelectedRole("provider")}
                        />
                    </View>
                </ScrollView>

                {/* Footer Action */}
                <View className="p-4 bg-background-light border-t border-gray-100/50">
                    <Button
                        title="Continuar"
                        onPress={handleContinue}
                        disabled={!selectedRole}
                        style={{ width: "100%", height: 56, borderRadius: 9999 }} // rounded-full h-14
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

// Helper Component for Cards to keep code clean and consistent
const RoleCard: React.FC<{
    title: string;
    description: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    selected: boolean;
    onPress: () => void;
}> = ({ title, description, icon, selected, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        className={`flex-row items-start p-4 rounded-xl border transition-all ${selected
                ? "bg-white border-primary"
                : "bg-white border-transparent"
            }`}
        style={
            selected
                ? {
                    // Matches .selected-card shadow: 0 4px 12px rgba(17, 82, 212, 0.2)
                    shadowColor: "#1152d4",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                    elevation: 4, // for Android
                    borderWidth: 2 // outline: 2px solid
                }
                : {
                    // Matches default shadow: shadow-[0_1px_3px_rgba(0,0,0,0.05)]
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 1
                }
        }
    >
        <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
            <MaterialIcons name={icon} size={24} color={colors.primary} />
        </View>
        <View className="flex-1 justify-center">
            <Text className="text-lg font-bold text-text-primary-light mb-1 leading-tight">
                {title}
            </Text>
            <Text className="text-text-secondary-light text-base leading-normal">
                {description}
            </Text>
        </View>
    </TouchableOpacity>
);
