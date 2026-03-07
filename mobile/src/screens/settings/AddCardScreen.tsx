import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { paymentService, validateCardNumber, detectCardType } from "../../services/paymentService";

const CARD_TYPE_ICONS: Record<string, string> = {
    visa: "Visa",
    mastercard: "MC",
    elo: "Elo",
    amex: "Amex",
    hipercard: "Hiper",
    other: "Card",
};

function formatCardNumber(text: string): string {
    const cleaned = text.replace(/\D/g, "");
    return (cleaned.match(/.{1,4}/g)?.join(" ") ?? cleaned).slice(0, 19);
}

function formatExpiry(text: string): string {
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
        return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    return cleaned;
}

export const AddCardScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();

    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [setAsDefault, setSetAsDefault] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const cardType = detectCardType(cardNumber);
    const isCardNumberValid = validateCardNumber(cardNumber);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!isCardNumberValid) {
            newErrors.cardNumber = "Número de cartão inválido";
        }
        if (!cardName.trim()) {
            newErrors.cardName = "Nome é obrigatório";
        }

        const [mm, yy] = expiry.split("/");
        const month = parseInt(mm ?? "", 10);
        const year = parseInt("20" + (yy ?? ""), 10);
        const now = new Date();
        if (!mm || !yy || isNaN(month) || month < 1 || month > 12) {
            newErrors.expiry = "Data inválida";
        } else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
            newErrors.expiry = "Cartão expirado";
        }

        if (cvv.length < 3) {
            newErrors.cvv = "CVV inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!user || !validate()) return;

        const [mm, yy] = expiry.split("/");
        const month = parseInt(mm, 10);
        const year = parseInt("20" + yy, 10);

        setSaving(true);
        try {
            await paymentService.addPaymentMethod({
                userId: user.id,
                cardNumber,
                holderName: cardName,
                expiryMonth: month,
                expiryYear: year,
                setDefault: setAsDefault,
            });
            navigation.goBack();
        } catch {
            Alert.alert("Erro", "Não foi possível salvar o cartão. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    const canSave = cardNumber.length >= 13 && cardName.trim().length > 0
        && expiry.length === 5 && cvv.length >= 3 && !saving;

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-slate-50 border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Adicionar Cartão</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
                {/* Número do Cartão */}
                <View className="mb-5">
                    <Text className="text-[15px] font-semibold text-slate-700 mb-2">
                        Número do Cartão
                    </Text>
                    <View className={`bg-white rounded-2xl px-4 py-4 flex-row items-center border ${errors.cardNumber ? "border-red-400" : "border-slate-200"}`}>
                        <TextInput
                            placeholder="0000 0000 0000 0000"
                            placeholderTextColor="#9CA3AF"
                            value={cardNumber}
                            onChangeText={(t) => {
                                setCardNumber(formatCardNumber(t));
                                setErrors(e => ({ ...e, cardNumber: "" }));
                            }}
                            keyboardType="number-pad"
                            maxLength={19}
                            className="flex-1 text-[17px] text-slate-900"
                        />
                        <Text className="text-[13px] font-bold text-slate-500 ml-2">
                            {cardNumber.length > 0 ? CARD_TYPE_ICONS[cardType] ?? "Card" : ""}
                        </Text>
                    </View>
                    {errors.cardNumber ? (
                        <Text className="text-red-500 text-[13px] mt-1">{errors.cardNumber}</Text>
                    ) : cardNumber.replace(/\s/g, "").length >= 13 ? (
                        <Text className={`text-[13px] mt-1 ${isCardNumberValid ? "text-green-600" : "text-red-500"}`}>
                            {isCardNumberValid ? "Número válido" : "Número inválido"}
                        </Text>
                    ) : null}
                </View>

                {/* Nome no Cartão */}
                <View className="mb-5">
                    <Text className="text-[15px] font-semibold text-slate-700 mb-2">
                        Nome no Cartão
                    </Text>
                    <View className={`bg-white rounded-2xl px-4 py-4 border ${errors.cardName ? "border-red-400" : "border-slate-200"}`}>
                        <TextInput
                            placeholder="Seu nome como está no cartão"
                            placeholderTextColor="#9CA3AF"
                            value={cardName}
                            onChangeText={(t) => {
                                setCardName(t.toUpperCase());
                                setErrors(e => ({ ...e, cardName: "" }));
                            }}
                            autoCapitalize="characters"
                            className="text-[17px] text-slate-900"
                        />
                    </View>
                    {errors.cardName && (
                        <Text className="text-red-500 text-[13px] mt-1">{errors.cardName}</Text>
                    )}
                </View>

                {/* Validade e CVV */}
                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1">
                        <Text className="text-[15px] font-semibold text-slate-700 mb-2">
                            Validade
                        </Text>
                        <View className={`bg-white rounded-2xl px-4 py-4 border ${errors.expiry ? "border-red-400" : "border-slate-200"}`}>
                            <TextInput
                                placeholder="MM/AA"
                                placeholderTextColor="#9CA3AF"
                                value={expiry}
                                onChangeText={(t) => {
                                    setExpiry(formatExpiry(t));
                                    setErrors(e => ({ ...e, expiry: "" }));
                                }}
                                keyboardType="number-pad"
                                maxLength={5}
                                className="text-[17px] text-slate-900"
                            />
                        </View>
                        {errors.expiry && (
                            <Text className="text-red-500 text-[13px] mt-1">{errors.expiry}</Text>
                        )}
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-[15px] font-semibold text-slate-700">CVV</Text>
                            <TouchableOpacity className="ml-1">
                                <MaterialIcons name="help-outline" size={16} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                        <View className={`bg-white rounded-2xl px-4 py-4 border ${errors.cvv ? "border-red-400" : "border-slate-200"}`}>
                            <TextInput
                                placeholder="000"
                                placeholderTextColor="#9CA3AF"
                                value={cvv}
                                onChangeText={(t) => {
                                    setCvv(t.replace(/\D/g, "").slice(0, 4));
                                    setErrors(e => ({ ...e, cvv: "" }));
                                }}
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                                className="text-[17px] text-slate-900"
                            />
                        </View>
                        {errors.cvv && (
                            <Text className="text-red-500 text-[13px] mt-1">{errors.cvv}</Text>
                        )}
                    </View>
                </View>

                {/* Set as default */}
                <TouchableOpacity
                    onPress={() => setSetAsDefault(!setAsDefault)}
                    className="flex-row items-center py-3"
                    activeOpacity={0.7}
                >
                    <View className={`w-6 h-6 rounded-md items-center justify-center mr-3 ${setAsDefault ? "bg-primary" : "bg-white border-2 border-slate-300"}`}>
                        {setAsDefault && <MaterialIcons name="check" size={16} color="white" />}
                    </View>
                    <Text className="text-[15px] text-slate-800">
                        Definir como cartão padrão
                    </Text>
                </TouchableOpacity>

                {/* Security note */}
                <View className="mt-4 p-4 bg-green-50 rounded-2xl flex-row items-start gap-3">
                    <MaterialIcons name="lock" size={18} color="#059669" />
                    <Text className="flex-1 text-[13px] text-green-700">
                        Seus dados são criptografados e não armazenamos o número completo do cartão.
                    </Text>
                </View>
            </ScrollView>

            {/* Save Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-slate-50 px-4 py-4 border-t border-slate-200">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={!canSave}
                    className={`w-full py-4 rounded-3xl items-center justify-center ${canSave ? "bg-primary" : "bg-slate-300"}`}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-[17px]">Salvar Cartão</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
