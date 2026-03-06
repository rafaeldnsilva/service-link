import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

/**
 * AuthGateScreen — tela de entrada do app.
 * Verifica o estado de autenticação e redireciona:
 *   - Sem sessão          → Auth (onboarding/login)
 *   - Sessão + sem role   → Auth (RoleSelection via AuthNavigator)
 *   - Sessão + client     → ClientMain (tab navigator)
 *   - Sessão + provider   → ProviderMain (tab navigator)
 */
export const AuthGateScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user, profile, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
            return;
        }

        if (!profile?.role) {
            navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
            return;
        }

        if (profile.role === "provider") {
            navigation.reset({ index: 0, routes: [{ name: "ProviderMain" }] });
        } else {
            navigation.reset({ index: 0, routes: [{ name: "ClientMain" }] });
        }
    }, [loading, user, profile]);

    return (
        <View className="flex-1 items-center justify-center bg-background-light">
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
};
