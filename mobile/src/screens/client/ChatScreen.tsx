import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View, Text, TextInput, TouchableOpacity, FlatList,
    KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp, RootStackParamList } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { messageService, Message } from "../../services/messageService";

type RouteProps = RouteProp<RootStackParamList, "ChatScreen">;

const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

const MessageBubble: React.FC<{ message: Message; isMine: boolean }> = ({ message, isMine }) => {
    const initials = (message.sender?.full_name ?? "?")
        .split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

    return (
        <View className={`flex-row mb-4 ${isMine ? "justify-end" : "justify-start"}`}>
            {!isMine && (
                <View className="w-9 h-9 rounded-full bg-purple-100 mr-2 items-center justify-center">
                    <Text className="text-primary font-bold text-[12px]">{initials}</Text>
                </View>
            )}
            <View style={{ maxWidth: "75%" }}>
                <View className={`px-4 py-3 rounded-2xl ${isMine ? "bg-primary rounded-tr-sm" : "bg-white rounded-tl-sm border border-slate-200"}`}>
                    <Text className={`text-[15px] leading-5 ${isMine ? "text-white" : "text-slate-900"}`}>
                        {message.content}
                    </Text>
                </View>
                <Text className={`text-[11px] text-slate-400 mt-1 ${isMine ? "text-right" : "text-left"}`}>
                    {formatTime(message.created_at)}
                </Text>
            </View>
        </View>
    );
};

export const ChatScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { bookingId } = route.params ?? {};
    const { user } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const listRef = useRef<FlatList>(null);

    useEffect(() => {
        if (!bookingId) {
            setLoading(false);
            return;
        }
        loadMessages();

        const unsubscribe = messageService.subscribeToMessages(bookingId, (newMessage) => {
            setMessages(prev => {
                const exists = prev.some(m => m.id === newMessage.id);
                if (exists) return prev;
                return [...prev, newMessage];
            });
        });

        return () => { void unsubscribe(); };
    }, [bookingId]);

    const loadMessages = async () => {
        if (!bookingId) return;
        try {
            const data = await messageService.getMessages(bookingId);
            setMessages(data);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);

    const handleSend = useCallback(async () => {
        const text = input.trim();
        if (!text || !bookingId || !user || sending) return;

        setInput("");
        setSending(true);
        try {
            await messageService.sendMessage(bookingId, user.id, text);
        } catch (error) {
            console.error("Error sending message:", error);
            setInput(text); // restore on failure
        } finally {
            setSending(false);
        }
    }, [input, bookingId, user, sending]);

    const renderItem = useCallback(({ item }: { item: Message }) => (
        <MessageBubble message={item} isMine={item.sender_id === user?.id} />
    ), [user?.id]);

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-[17px] font-bold text-slate-900">Chat</Text>
                    {bookingId && (
                        <Text className="text-[12px] text-slate-400">Conversa sobre o pedido</Text>
                    )}
                </View>
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <MaterialIcons name="more-vert" size={24} color={colors.textPrimaryLight} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : !bookingId ? (
                <View className="flex-1 items-center justify-center p-8">
                    <MaterialIcons name="chat-bubble-outline" size={64} color="#d4d4d8" />
                    <Text className="text-slate-500 mt-4 text-center">
                        Selecione um pedido para conversar com o prestador
                    </Text>
                </View>
            ) : (
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 20, flexGrow: 1 }}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center py-16">
                            <MaterialIcons name="chat-bubble-outline" size={48} color="#d4d4d8" />
                            <Text className="text-slate-400 mt-3 text-center">
                                Nenhuma mensagem ainda.{"\n"}Diga olá!
                            </Text>
                        </View>
                    }
                    onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                />
            )}

            {/* Input Area */}
            {bookingId && (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                >
                    <View className="bg-white border-t border-slate-200 px-4 py-3 flex-row items-end gap-3">
                        <View className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 min-h-[48px] max-h-[120px] justify-center">
                            <TextInput
                                placeholder="Digite sua mensagem..."
                                placeholderTextColor="#94A3B8"
                                value={input}
                                onChangeText={setInput}
                                className="text-[15px] text-slate-900"
                                multiline
                                onSubmitEditing={handleSend}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!input.trim() || sending}
                            className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${input.trim() ? "bg-primary shadow-purple-200" : "bg-slate-200"}`}
                        >
                            {sending ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <MaterialIcons name="send" size={20} color={input.trim() ? "white" : "#94A3B8"} />
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
};
