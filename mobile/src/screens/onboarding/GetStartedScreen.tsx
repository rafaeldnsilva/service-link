import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export const GetStartedScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            <View className="flex-1 w-full max-w-md mx-auto justify-between p-4">
                {/* Spacer for status bar */}
                <View className="h-8" />

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Main Content Area */}
                    <View className="w-full items-center justify-center">
                        {/* Illustration */}
                        <View className="w-full max-w-sm py-2 shrink-0">
                            <View style={{ width: "100%", aspectRatio: 1, borderRadius: 9999, overflow: 'hidden' }}>
                                <Image
                                    source={require("../../../assets/get-started-illustration.png")}
                                    style={{ width: "100%", height: "100%" }}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>

                        {/* Text Content */}
                        <View className="w-full px-4 pt-4 pb-2">
                            <Text className="text-text-primary-light text-3xl font-bold text-center tracking-tight leading-tight">
                                Comece Agora!
                            </Text>
                            <Text className="text-text-secondary-light text-base font-normal text-center pt-2">
                                Encontre profissionais de confiança para resolver qualquer problema, a qualquer hora.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Action Buttons */}
                <View className="w-full pb-4">
                    <View className="gap-3 px-4 py-2">
                        <Button
                            title="Criar Conta"
                            onPress={() => navigation.navigate("SignUp")}
                            style={{ width: "100%" }}
                        />
                        <Button
                            title="Entrar"
                            variant="outline"
                            onPress={() => navigation.navigate("Login")}
                            style={{ width: "100%" }}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};
