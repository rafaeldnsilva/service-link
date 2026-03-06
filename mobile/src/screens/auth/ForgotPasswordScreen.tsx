import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
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

export const ForgotPasswordScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendLink = async () => {
        if (!email.trim()) {
            Alert.alert("Email obrigatório", "Por favor, insira seu email.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
            if (error) {
                Alert.alert("Erro", error.message);
            } else {
                navigation.navigate("EmailVerification", { email: email.trim() });
            }
        } catch (e) {
            Alert.alert("Erro", "Não foi possível enviar o email. Tente novamente.");
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
                <View className="flex-1">
                    {/* Header with Back Button */}
                    <View className="flex-row items-center p-4 pb-2">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-12 h-12 items-center justify-center"
                        >
                            <MaterialCommunityIcons
                                name="chevron-left"
                                size={28}
                                color="#1C1C1E"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View className="flex-1 px-4">
                        {/* Title */}
                        <Text className="text-text-primary-light text-3xl font-bold tracking-tight pt-6 pb-2">
                            Recuperar Senha
                        </Text>
                        <Text className="text-text-secondary-light text-base font-normal pb-8 pt-1">
                            Insira seu email para receber um link de redefinição de senha.
                        </Text>

                        {/* Email Input */}
                        <View className="py-3">
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
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="w-full px-4 pt-4 pb-12">
                        <View className="py-3">
                            <Button
                                title="Enviar Link"
                                onPress={handleSendLink}
                                loading={loading}
                                disabled={!email}
                                style={{ width: "100%" }}
                            />
                        </View>

                        <TouchableOpacity
                            className="py-4 items-center"
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text className="text-primary text-base font-medium">
                                Voltar ao Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
