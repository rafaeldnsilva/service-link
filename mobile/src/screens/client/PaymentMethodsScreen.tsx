import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, TouchableOpacity, ScrollView,
    ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { paymentService, PaymentMethod } from "../../services/paymentService";

const CARD_COLORS: Record<string, string> = {
    visa: "#1A1F71",
    mastercard: "#EB001B",
    elo: "#FFD700",
    amex: "#007BC1",
    hipercard: "#8B0000",
    other: "#374151",
};

const CARD_LABELS: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    elo: "Elo",
    amex: "American Express",
    hipercard: "Hipercard",
    other: "Cartão",
};

export const PaymentMethodsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();

    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [settingDefault, setSettingDefault] = useState<string | null>(null);

    const loadMethods = useCallback(async () => {
        if (!user) return;
        try {
            const data = await paymentService.getPaymentMethods(user.id);
            setMethods(data);
        } catch {
            Alert.alert("Erro", "Não foi possível carregar os métodos de pagamento.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadMethods();
    }, [loadMethods]);

    const handleSetDefault = async (methodId: string) => {
        if (!user) return;
        setSettingDefault(methodId);
        try {
            await paymentService.setDefault(user.id, methodId);
            setMethods(prev =>
                prev.map(m => ({ ...m, is_default: m.id === methodId }))
            );
        } catch {
            Alert.alert("Erro", "Não foi possível definir o cartão padrão.");
        } finally {
            setSettingDefault(null);
        }
    };

    const handleRemove = (method: PaymentMethod) => {
        Alert.alert(
            "Remover cartão",
            `Remover ${CARD_LABELS[method.card_type] ?? "Cartão"} •••• ${method.last4}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await paymentService.deletePaymentMethod(method.id);
                            setMethods(prev => prev.filter(m => m.id !== method.id));
                        } catch {
                            Alert.alert("Erro", "Não foi possível remover o cartão.");
                        }
                    },
                },
            ]
        );
    };

    const handleAddCard = () => {
        navigation.navigate("AddCard");
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-slate-50 border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-[20px] font-bold text-slate-900">
                    Métodos de Pagamento
                </Text>
                <View className="w-10" />
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 120 }}>
                    {methods.length === 0 ? (
                        <View className="items-center py-16">
                            <MaterialIcons name="credit-card-off" size={56} color="#d4d4d8" />
                            <Text className="text-slate-500 mt-4 text-[16px] text-center">
                                Nenhum cartão cadastrado.{"\n"}Adicione um para facilitar seus pagamentos.
                            </Text>
                        </View>
                    ) : (
                        methods.map((method) => {
                            const cardColor = CARD_COLORS[method.card_type] ?? CARD_COLORS.other;
                            const cardLabel = CARD_LABELS[method.card_type] ?? "Cartão";
                            const expiryLabel = `${String(method.expiry_month).padStart(2, "0")}/${String(method.expiry_year).slice(-2)}`;

                            return (
                                <View
                                    key={method.id}
                                    className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
                                    style={{ borderWidth: method.is_default ? 2 : 0, borderColor: colors.primary }}
                                >
                                    <View className="flex-row items-center">
                                        {/* Card icon */}
                                        <View
                                            className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                            style={{ backgroundColor: cardColor }}
                                        >
                                            <MaterialIcons name="credit-card" size={28} color="white" />
                                        </View>

                                        {/* Details */}
                                        <View className="flex-1">
                                            <View className="flex-row items-center gap-2">
                                                <Text className="text-[17px] font-semibold text-slate-900">
                                                    {cardLabel}
                                                </Text>
                                                {method.is_default && (
                                                    <View className="bg-purple-100 px-2 py-0.5 rounded-full">
                                                        <Text className="text-primary text-[11px] font-semibold">
                                                            Padrão
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text className="text-[14px] text-slate-500">
                                                •••• •••• •••• {method.last4}
                                            </Text>
                                            <Text className="text-[13px] text-slate-400">
                                                {method.holder_name} · Val: {expiryLabel}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Actions row */}
                                    <View className="flex-row gap-3 mt-3 pt-3 border-t border-slate-100">
                                        {!method.is_default && (
                                            <TouchableOpacity
                                                onPress={() => handleSetDefault(method.id)}
                                                disabled={settingDefault === method.id}
                                                className="flex-1 py-2 rounded-xl bg-purple-50 items-center"
                                            >
                                                {settingDefault === method.id ? (
                                                    <ActivityIndicator size="small" color={colors.primary} />
                                                ) : (
                                                    <Text className="text-primary text-[14px] font-semibold">
                                                        Tornar padrão
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            onPress={() => handleRemove(method)}
                                            className="flex-1 py-2 rounded-xl bg-red-50 items-center"
                                        >
                                            <Text className="text-red-500 text-[14px] font-semibold">
                                                Remover
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            )}

            {/* Add New Method Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-slate-100 shadow-2xl">
                <TouchableOpacity
                    onPress={handleAddCard}
                    className="w-full bg-primary py-4 rounded-3xl flex-row items-center justify-center active:opacity-90"
                >
                    <MaterialIcons name="add" size={22} color="white" />
                    <Text className="text-white font-bold text-[17px] ml-2">Adicionar Cartão</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
