import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const PAYMENT_METHODS = [
    {
        id: 1,
        type: "Visa Card",
        last4: "1234",
        icon: "credit-card",
        color: "#F5C9B0",
    },
    {
        id: 2,
        type: "Mastercard",
        last4: "5678",
        icon: "credit-card",
        color: "#1F2937",
    },
    {
        id: 3,
        type: "Apple Pay",
        last4: "",
        icon: "apple",
        color: "#1F2937",
    },
];

export const PaymentMethodsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleRemove = (id: number) => {
        console.log("Remove payment method:", id);
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

            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}>
                {PAYMENT_METHODS.map((method) => (
                    <View
                        key={method.id}
                        className="bg-white rounded-2xl p-4 mb-4 flex-row items-center"
                    >
                        {/* Icon */}
                        <View
                            className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                            style={{ backgroundColor: method.color }}
                        >
                            {method.icon === "apple" ? (
                                <FontAwesome name="apple" size={32} color="white" />
                            ) : (
                                <MaterialIcons name="credit-card" size={32} color="white" />
                            )}
                        </View>

                        {/* Details */}
                        <View className="flex-1">
                            <Text className="text-[18px] font-semibold text-slate-900 mb-1">
                                {method.type}
                            </Text>
                            {method.last4 && (
                                <Text className="text-[14px] text-slate-400">
                                    •••• •••• •••• {method.last4}
                                </Text>
                            )}
                        </View>

                        {/* Remove Button */}
                        <TouchableOpacity
                            onPress={() => handleRemove(method.id)}
                            className="px-4 py-2"
                        >
                            <Text className="text-red-500 font-medium text-[15px]">Remover</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Add New Method Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-2xl">
                <TouchableOpacity
                    onPress={() => console.log("Add new payment method")}
                    className="w-full bg-blue-500 py-4 rounded-3xl items-center justify-center active:opacity-90"
                >
                    <Text className="text-white font-bold text-[18px]">Adicionar Novo Método</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
