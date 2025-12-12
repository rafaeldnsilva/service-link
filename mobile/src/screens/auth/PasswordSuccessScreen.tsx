import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export const PasswordSuccessScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            <View className="flex-1 items-center justify-center p-6 sm:p-8">
                <View className="w-full max-w-sm items-center gap-8 text-center">
                    {/* Success Icon */}
                    <View className="h-24 w-24 items-center justify-center rounded-full bg-success">
                        <MaterialCommunityIcons
                            name="check"
                            size={60}
                            color="#fff"
                        />
                    </View>

                    {/* Text Content */}
                    <View className="items-center gap-2">
                        <Text className="text-2xl font-bold tracking-tight text-text-primary-light text-center">
                            Senha redefinida com sucesso!
                        </Text>
                        <Text className="text-base text-text-secondary-light text-center">
                            Agora você pode fazer login com sua nova senha.
                        </Text>
                    </View>

                    {/* Button */}
                    <Button
                        title="Voltar ao Login"
                        onPress={() => navigation.navigate("Login")}
                        style={{ width: "100%" }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};
