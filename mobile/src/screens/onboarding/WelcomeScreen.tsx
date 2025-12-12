import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            <View className="flex-1 items-center justify-center p-4">
                {/* Logo */}
                <View className="mb-6">
                    <View className="w-12 h-12 items-center justify-center">
                        <MaterialCommunityIcons
                            name="check-circle-outline"
                            size={48}
                            color={colors.primary}
                        />
                    </View>
                </View>

                {/* Illustration */}
                <View className="w-full max-w-sm px-4 mb-6 flex-1 justify-center">
                    <Image
                        source={require("../../../assets/welcome-illustration.png")}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="contain"
                    />
                </View>

                {/* Headline - Restored Native Text */}
                <Text className="text-text-primary-light text-3xl font-bold text-center tracking-tight leading-tight">
                    Bem-vindo ao ServiceLink!
                </Text>

                {/* Body Text - Restored Native Text */}
                <Text className="text-text-secondary-light text-base font-normal text-center pt-2 max-w-sm">
                    Conectando você aos melhores profissionais, de forma rápida e segura.
                </Text>
            </View>

            {/* Footer with Button */}
            <View className="w-full p-6 pb-10">
                <Button
                    title="Continuar"
                    onPress={() => navigation.navigate("HowItWorks")}
                    style={{ width: "100%" }}
                />
            </View>
        </SafeAreaView>
    );
};
