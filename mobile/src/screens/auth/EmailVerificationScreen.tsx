import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NavigationProp, RootStackParamList } from "../../types/navigation";
import { Button } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { supabase } from "../../lib/supabase";

export const EmailVerificationScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp<RootStackParamList, "EmailVerification">>();
    const email = route.params?.email || "seuemail@dominio.com";
    const [resending, setResending] = useState(false);

    const handleResendEmail = async () => {
        setResending(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) {
                Alert.alert("Erro", error.message);
            } else {
                Alert.alert("Email reenviado", `Um novo link foi enviado para ${email}.`);
            }
        } catch {
            Alert.alert("Erro", "Não foi possível reenviar. Tente novamente.");
        } finally {
            setResending(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            {/* Header with Back Button */}
            <View className="flex-row items-center p-4 pb-2">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-12 h-12 items-center justify-center rounded-xl"
                >
                    <MaterialCommunityIcons
                        name="chevron-left"
                        size={28}
                        color="#1C1C1E"
                    />
                </TouchableOpacity>
            </View>

            <View className="flex-1 justify-between px-4">
                {/* Content */}
                <View className="items-center pt-8">
                    {/* Icon */}
                    <View className="items-center justify-center bg-primary/10 rounded-full w-24 h-24 mb-8">
                        <MaterialCommunityIcons
                            name="email-check-outline"
                            size={48}
                            color={colors.primary}
                        />
                    </View>

                    {/* Title */}
                    <Text className="text-text-primary-light text-3xl font-bold tracking-tight text-center pb-3">
                        Verifique seu Email
                    </Text>

                    {/* Body Text */}
                    <Text className="text-text-secondary-light text-base font-normal text-center leading-relaxed max-w-sm">
                        Enviamos um link para redefinir sua senha para{" "}
                        <Text className="font-semibold text-text-primary-light">
                            {email}
                        </Text>
                        . Por favor, verifique sua caixa de entrada e spam.
                    </Text>
                </View>

                {/* Buttons */}
                <View className="w-full pb-8 pt-4">
                    <View className="py-3">
                        <Button
                            title="Voltar ao Login"
                            onPress={() => navigation.navigate("Login")}
                            style={{ width: "100%" }}
                        />
                    </View>

                    <TouchableOpacity
                        className="py-4 items-center"
                        onPress={handleResendEmail}
                        disabled={resending}
                    >
                        <Text className={`text-base font-bold ${resending ? "text-slate-400" : "text-primary"}`}>
                            {resending ? "Reenviando..." : "Reenviar Email"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};
