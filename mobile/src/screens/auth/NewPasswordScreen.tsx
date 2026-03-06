import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button, Input } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { supabase } from "../../lib/supabase";

interface PasswordRequirement {
    label: string;
    met: boolean;
}

export const NewPasswordScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const requirements: PasswordRequirement[] = useMemo(() => [
        {
            label: "Mínimo de 8 caracteres",
            met: password.length >= 8,
        },
        {
            label: "Pelo menos um número",
            met: /\d/.test(password),
        },
        {
            label: "Pelo menos um símbolo",
            met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
    ], [password]);

    const allRequirementsMet = requirements.every((req) => req.met);
    const passwordsMatch = password === confirmPassword && password.length > 0;

    const handleResetPassword = async () => {
        if (!allRequirementsMet || !passwordsMatch) return;

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
                Alert.alert("Erro", error.message);
            } else {
                navigation.navigate("PasswordSuccess");
            }
        } catch {
            Alert.alert("Erro", "Não foi possível redefinir a senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="flex-row items-center p-4 pb-2 justify-between">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 items-center justify-center"
                        >
                            <MaterialCommunityIcons
                                name="chevron-left"
                                size={28}
                                color="#1C1C1E"
                            />
                        </TouchableOpacity>
                        <Text className="text-text-primary-light text-lg font-bold flex-1 text-center pr-10">
                            Definir Nova Senha
                        </Text>
                    </View>

                    <View className="flex-1 px-4 pt-4">
                        {/* Body Text */}
                        <Text className="text-text-secondary-light text-base font-normal text-center pb-8 pt-2">
                            Crie uma senha nova e segura para sua conta.
                        </Text>

                        {/* Password Fields */}
                        <View className="gap-4 py-3">
                            <Input
                                label="Nova Senha"
                                placeholder="Digite sua nova senha"
                                value={password}
                                onChangeText={setPassword}
                                isPassword
                                leftIcon="lock-outline"
                            />

                            <Input
                                label="Confirmar Nova Senha"
                                placeholder="Confirme sua nova senha"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                isPassword
                                leftIcon="lock-outline"
                                error={
                                    confirmPassword && !passwordsMatch
                                        ? "As senhas não coincidem"
                                        : undefined
                                }
                            />
                        </View>

                        {/* Password Requirements */}
                        <View className="pt-4 pb-3">
                            <View className="gap-2">
                                {requirements.map((req, index) => (
                                    <View key={index} className="flex-row items-center">
                                        <MaterialCommunityIcons
                                            name={req.met ? "check-circle" : "checkbox-blank-circle-outline"}
                                            size={18}
                                            color={req.met ? colors.success : colors.textSecondaryLight}
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text
                                            className={`text-sm ${req.met ? "text-success" : "text-text-secondary-light"
                                                }`}
                                        >
                                            {req.label}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <View className="w-full p-4 pb-8">
                        <Button
                            title="Redefinir Senha"
                            onPress={handleResetPassword}
                            loading={loading}
                            disabled={!allRequirementsMet || !passwordsMatch}
                            style={{ width: "100%" }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
