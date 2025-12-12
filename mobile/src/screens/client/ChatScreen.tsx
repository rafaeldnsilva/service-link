import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const MESSAGES = [
    {
        id: 1,
        text: "Olá! Vi que você precisa de um eletricista. Como posso ajudar?",
        sender: "provider",
        time: "10:00 AM"
    },
    {
        id: 2,
        text: "Oi Carlos, tudo bem? A tomada da minha sala parou de funcionar. Você consegue dar uma olhada hoje?",
        sender: "client",
        time: "10:01 AM"
    },
    {
        id: 3,
        text: "Claro, posso ir aí por volta das 14h. Fica bom para você?",
        sender: "provider",
        time: "10:02 AM"
    },
    {
        id: 4,
        text: "Perfeito! Te aguardo então. Obrigado!",
        sender: "client",
        time: "10:03 AM"
    },
];

export const ChatScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            // Handle send message
            console.log("Send:", message);
            setMessage("");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>

                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-[#F5D7C8] items-center justify-center overflow-hidden">
                        <Image
                            source={{ uri: "https://i.pravatar.cc/300?img=12" }}
                            className="w-full h-full"
                        />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="text-[18px] font-bold text-slate-900">Carlos Silva</Text>
                        <Text className="text-[13px] text-slate-500">Eletricista</Text>
                    </View>
                </View>

                <TouchableOpacity className="ml-2 w-10 h-10 items-center justify-center">
                    <MaterialIcons name="phone" size={26} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity className="ml-2 w-10 h-10 items-center justify-center">
                    <MaterialIcons name="more-vert" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                className="flex-1"
            >
                {MESSAGES.map((msg) => (
                    <View
                        key={msg.id}
                        className={`flex-row mb-4 ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.sender === "provider" && (
                            <View className="w-10 h-10 rounded-full bg-[#F5D7C8] mr-2 items-center justify-center overflow-hidden">
                                <Image
                                    source={{ uri: "https://i.pravatar.cc/300?img=12" }}
                                    className="w-full h-full"
                                />
                            </View>
                        )}
                        <View className="flex-1 max-w-[75%]">
                            <View
                                className={`px-4 py-3 rounded-2xl ${msg.sender === "client"
                                    ? "bg-purple-100 rounded-tr-sm"
                                    : "bg-white rounded-tl-sm border border-slate-200"
                                    }`}
                            >
                                <Text className={`text-[15px] leading-5 ${msg.sender === "client" ? "text-slate-900" : "text-slate-900"
                                    }`}>
                                    {msg.text}
                                </Text>
                            </View>
                            <Text className={`text-[11px] text-slate-400 mt-1 ${msg.sender === "client" ? "text-right" : "text-left"
                                }`}>
                                {msg.time}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <View className="bg-white border-t border-slate-200 px-4 py-3 flex-row items-center gap-3">
                    <TouchableOpacity className="w-10 h-10 items-center justify-center">
                        <MaterialIcons name="add" size={28} color={colors.textSecondaryLight} />
                    </TouchableOpacity>

                    <View className="flex-1 bg-slate-50 rounded-full px-4 py-3 border border-slate-200">
                        <TextInput
                            placeholder="Digite sua mensagem..."
                            placeholderTextColor="#94A3B8"
                            value={message}
                            onChangeText={setMessage}
                            className="text-[15px] text-slate-900"
                            multiline
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSend}
                        className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-lg shadow-purple-200"
                    >
                        <MaterialIcons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
