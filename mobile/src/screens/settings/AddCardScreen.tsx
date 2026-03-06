import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

export const AddCardScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [saveCard, setSaveCard] = useState(true);

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\s/g, "");
        const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
        return formatted.slice(0, 19); // Max 16 digits + 3 spaces
    };

    const formatExpiryDate = (text: string) => {
        const cleaned = text.replace(/\D/g, "");
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    const handleAddCard = () => {
        console.log("Adding card:", { cardNumber, cardName, expiryDate, cvv, saveCard });
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-slate-50 border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Adicionar Cartão</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Número do Cartão */}
                <View className="mb-5">
                    <Text className="text-[16px] font-semibold text-slate-900 mb-3">
                        Número do Cartão
                    </Text>
                    <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center border border-slate-200">
                        <TextInput
                            placeholder="0000 0000 0000 0000"
                            placeholderTextColor="#9CA3AF"
                            value={cardNumber}
                            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                            keyboardType="number-pad"
                            maxLength={19}
                            className="flex-1 text-[17px] text-slate-900"
                        />
                        <MaterialIcons name="credit-card" size={24} color="#9CA3AF" />
                    </View>
                </View>

                {/* Nome no Cartão */}
                <View className="mb-5">
                    <Text className="text-[16px] font-semibold text-slate-900 mb-3">
                        Nome no Cartão
                    </Text>
                    <View className="bg-white rounded-2xl px-4 py-4 border border-slate-200">
                        <TextInput
                            placeholder="Seu nome completo"
                            placeholderTextColor="#9CA3AF"
                            value={cardName}
                            onChangeText={setCardName}
                            autoCapitalize="words"
                            className="text-[17px] text-slate-900"
                        />
                    </View>
                </View>

                {/* Data de Validade e CVV */}
                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-[16px] font-semibold text-slate-900">
                                Data de Validade
                            </Text>
                        </View>
                        <View className="bg-white rounded-2xl px-4 py-4 border border-slate-200">
                            <TextInput
                                placeholder="MM/AA"
                                placeholderTextColor="#9CA3AF"
                                value={expiryDate}
                                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                                keyboardType="number-pad"
                                maxLength={5}
                                className="text-[17px] text-slate-900"
                            />
                        </View>
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-[16px] font-semibold text-slate-900">CVV</Text>
                            <TouchableOpacity className="ml-1">
                                <MaterialIcons name="help-outline" size={18} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                        <View className="bg-white rounded-2xl px-4 py-4 border border-slate-200">
                            <TextInput
                                placeholder="000"
                                placeholderTextColor="#9CA3AF"
                                value={cvv}
                                onChangeText={(text) => setCvv(text.slice(0, 4))}
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                                className="text-[17px] text-slate-900"
                            />
                        </View>
                    </View>
                </View>

                {/* Save Card Checkbox */}
                <TouchableOpacity
                    onPress={() => setSaveCard(!saveCard)}
                    className="flex-row items-center py-4"
                    activeOpacity={0.7}
                >
                    <View className={`w-6 h-6 rounded-md items-center justify-center mr-3 ${saveCard ? "bg-blue-500" : "bg-white border-2 border-slate-300"}`}>
                        {saveCard && <MaterialIcons name="check" size={18} color="white" />}
                    </View>
                    <Text className="text-[16px] text-slate-900">
                        Salvar este cartão para futuras compras
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Add Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-slate-50 px-4 py-4 border-t border-slate-200">
                <TouchableOpacity
                    onPress={handleAddCard}
                    className="w-full bg-blue-500 py-4 rounded-3xl items-center justify-center active:opacity-90"
                >
                    <Text className="text-white font-bold text-[18px]">Adicionar Cartão</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
