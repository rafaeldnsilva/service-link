import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { Button, Input } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const SignUpScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        // TODO: Implement actual signup logic
        setTimeout(() => {
            setLoading(false);
            navigation.navigate("EmailVerification", { email });
        }, 1000);
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
