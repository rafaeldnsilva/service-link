import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button } from "../../components";

export const ProfileWelcomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            <View className="flex-1 w-full max-w-md mx-auto justify-between p-4">
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Illustration Container */}
                    <View className="w-full items-center justify-center mb-8">
                        <View className="w-full max-w-xs aspect-square">
                            <View style={{ width: "100%", height: "100%" }}>
                                <Image
                                    source={require("../../../assets/profile-welcome-illustration.png")}
                                    style={{ width: "100%", height: "100%" }}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Text Content */}
                    <View className="w-full px-4 mb-4">
                        <Text className="text-text-primary-light text-[32px] font-bold text-center leading-tight tracking-tight">
                            Quase lá! Complete seu perfil.
                        </Text>
                        <Text className="text-text-secondary-light text-base font-normal text-center pt-3 leading-normal">
                            Um perfil completo ajuda os clientes a encontrar bons prestadores e a confiar nos seus serviços, assim como os prestadores fornecerem serviços de qualidade.
                        </Text>
                    </View>
                </ScrollView>

                {/* Footer Action */}
                <View className="w-full pb-4 px-4">
                    <Button
                        title="Começar"
                        onPress={() => navigation.navigate("RoleSelection")}
                        style={{ width: "100%" }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};
