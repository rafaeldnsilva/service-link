import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button, Input } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

type PasswordStrength = "fraca" | "média" | "forte";

const getPasswordStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    if (score <= 1) return "fraca";
    if (score <= 3) return "média";
    return "forte";
};

const STRENGTH_COLOR: Record<PasswordStrength, string> = {
    fraca: "#EF4444",
    média: "#F97316",
    forte: "#22C55E",
};

export const SignUpScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
    const strengthWidth = passwordStrength === "fraca" ? "33%" : passwordStrength === "média" ? "66%" : "100%";

    const passwordValid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /\d/.test(password);

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos.");
            return;
        }

        if (!passwordValid) {
            Alert.alert("Senha fraca", "Use ao menos 8 caracteres, uma letra maiúscula e um número.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Senhas diferentes", "As senhas digitadas não coincidem.");
            return;
        }

        if (!acceptTerms) {
            Alert.alert("Termos de uso", "Você precisa aceitar os Termos de Serviço para continuar.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                },
            });

            if (error) {
                Alert.alert("Erro ao criar conta", error.message);
            } else {
                navigation.navigate("RoleSelection");
            }
        } catch {
            Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header with Back Button */}
                    <View className="flex-row items-center p-4 pb-2">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-12 h-12 items-center justify-center"
                        >
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={24}
                                color="#1C1C1E"
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 px-4">
                        {/* Title */}
                        <Text className="text-text-primary-light text-3xl font-bold tracking-tight pt-6 pb-2">
                            Criar Conta
                        </Text>
                        <Text className="text-text-secondary-light text-base font-normal pb-8 pt-1">
                            Preencha os dados abaixo para criar sua conta.
                        </Text>

                        {/* Form */}
                        <View className="gap-4">
                            <Input
                                label="Nome Completo"
                                placeholder="Seu nome"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                autoComplete="name"
                                leftIcon="account-outline"
                            />

                            <Input
                                label="Email"
                                placeholder="seuemail@exemplo.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                leftIcon="email-outline"
                            />

                            <Input
                                label="Senha"
                                placeholder="Crie uma senha"
                                value={password}
                                onChangeText={setPassword}
                                isPassword
                                autoComplete="new-password"
                                leftIcon="lock-outline"
                            />

                            {/* Password strength indicator */}
                            {password.length > 0 && (
                                <View className="mb-1">
                                    <View className="flex-row items-center justify-between mb-1">
                                        <Text className="text-xs text-slate-500">Força da senha</Text>
                                        <Text className="text-xs font-bold capitalize" style={{ color: STRENGTH_COLOR[passwordStrength] }}>
                                            {passwordStrength}
                                        </Text>
                                    </View>
                                    <View className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <View
                                            className="h-full rounded-full"
                                            style={{ width: strengthWidth, backgroundColor: STRENGTH_COLOR[passwordStrength] }}
                                        />
                                    </View>
                                    <Text className="text-xs text-slate-400 mt-1">
                                        Use 8+ caracteres, uma maiúscula e um número
                                    </Text>
                                </View>
                            )}

                            <Input
                                label="Confirmar Senha"
                                placeholder="Confirme sua senha"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                isPassword
                                autoComplete="new-password"
                                leftIcon="lock-outline"
                            />

                            {/* Terms Checkbox */}
                            <TouchableOpacity
                                className="flex-row items-start gap-3 py-2"
                                onPress={() => setAcceptTerms(!acceptTerms)}
                            >
                                <View
                                    className={`w-6 h-6 rounded border-2 items-center justify-center ${acceptTerms
                                        ? "bg-primary border-primary"
                                        : "bg-white border-slate-300"
                                        }`}
                                >
                                    {acceptTerms && (
                                        <MaterialCommunityIcons name="check" size={16} color="#fff" />
                                    )}
                                </View>
                                <Text className="flex-1 text-text-secondary-light text-sm">
                                    Eu concordo com os{" "}
                                    <Text className="text-primary font-medium">
                                        Termos de Serviço
                                    </Text>{" "}
                                    e{" "}
                                    <Text className="text-primary font-medium">
                                        Política de Privacidade
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button */}
                        <View className="py-6">
                            <Button
                                title="Criar Conta"
                                onPress={handleSignUp}
                                loading={loading}
                                disabled={!acceptTerms}
                                style={{ width: "100%" }}
                            />
                        </View>

                        {/* Divider */}
                        <View className="flex-row items-center w-full my-4">
                            <View className="flex-1 h-px bg-slate-300" />
                            <Text className="px-3 text-sm text-slate-500">
                                Ou continue com
                            </Text>
                            <View className="flex-1 h-px bg-slate-300" />
                        </View>

                        {/* Social Login Buttons */}
                        <View className="gap-4 pb-4">
                            <TouchableOpacity className="w-full flex-row items-center justify-center bg-white border border-slate-200 rounded-full py-3 px-4 gap-3">
                                <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
                                <Text className="text-slate-700 font-medium text-base">
                                    Continuar com Google
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="w-full flex-row items-center justify-center bg-black rounded-full py-3 px-4 gap-3">
                                <MaterialCommunityIcons name="apple" size={20} color="#fff" />
                                <Text className="text-white font-medium text-base">
                                    Continuar com Apple
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Link */}
                        <View className="py-6 flex-row items-center justify-center">
                            <Text className="text-slate-500">Já tem uma conta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text className="font-medium text-primary">Entrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
