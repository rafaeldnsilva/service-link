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
import { colors } from "../../theme/colors";

export const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        // TODO: Implement actual login logic
        setTimeout(() => {
            setLoading(false);
            // navigation.navigate("Home");
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
                    <View className="flex-1 items-center justify-center p-6 sm:p-8">
                        <View className="w-full max-w-sm mx-auto items-center">
                            {/* Logo Icon */}
                            <View className="bg-primary w-16 h-16 rounded-full items-center justify-center mb-10">
                                <MaterialCommunityIcons name="link" size={36} color="#fff" />
                            </View>

                            {/* Header */}
                            <View className="text-center w-full mb-10">
                                <Text className="text-3xl font-bold text-slate-900 text-center">
                                    Bem-vindo de volta
                                </Text>
                                <Text className="text-slate-500 mt-2 text-center">
                                    Faça login na sua conta ServiceLink
                                </Text>
                            </View>

                            {/* Form */}
                            <View className="w-full gap-6">
                                <Input
                                    label="Email"
                                    placeholder="seuemail@exemplo.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />

                                <View>
                                    <Input
                                        label="Senha"
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChangeText={setPassword}
                                        isPassword
                                        autoComplete="password"
                                    />
                                    <TouchableOpacity
                                        className="self-end mt-2"
                                        onPress={() => navigation.navigate("ForgotPassword")}
                                    >
                                        <Text className="text-sm font-medium text-primary">
                                            Esqueceu sua senha?
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <Button
                                    title="Entrar"
                                    onPress={handleLogin}
                                    loading={loading}
                                    style={{ width: "100%" }}
                                />
                            </View>

                            {/* Divider */}
                            <View className="flex-row items-center w-full my-8">
                                <View className="flex-1 h-px bg-slate-300" />
                                <Text className="px-3 text-sm text-slate-500">
                                    Ou continue com
                                </Text>
                                <View className="flex-1 h-px bg-slate-300" />
                            </View>

                            {/* Social Login Buttons */}
                            <View className="w-full gap-4">
                                {/* Google */}
                                <TouchableOpacity className="w-full flex-row items-center justify-center bg-white border border-slate-200 rounded-full py-3 px-4 gap-3">
                                    <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
                                    <Text className="text-slate-700 font-medium text-base">
                                        Entrar com Google
                                    </Text>
                                </TouchableOpacity>

                                {/* Apple */}
                                <TouchableOpacity className="w-full flex-row items-center justify-center bg-black rounded-full py-3 px-4 gap-3">
                                    <MaterialCommunityIcons name="apple" size={20} color="#fff" />
                                    <Text className="text-white font-medium text-base">
                                        Entrar com Apple
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Sign Up Link */}
                            <View className="mt-10 flex-row items-center">
                                <Text className="text-slate-500">Não tem uma conta? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                                    <Text className="font-medium text-primary">Cadastre-se</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
