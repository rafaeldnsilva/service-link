import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NavigationProp, RootStackParamList } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { reviewService } from "../../services/supabaseService";

type RouteProps = RouteProp<RootStackParamList, "RateProvider">;

export const RateProviderScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { bookingId, providerId } = route.params;
    const { user } = useAuth();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!user || rating === 0) return;

        setSubmitting(true);
        try {
            await reviewService.createReview({
                booking_id: bookingId,
                provider_id: providerId,
                reviewer_id: user.id,
                rating,
                comment: comment.trim() || undefined,
            });
            Alert.alert("Obrigado!", "Sua avaliação foi enviada com sucesso.", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error("Error submitting review:", error);
            Alert.alert("Erro", "Não foi possível enviar a avaliação. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F7F8]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-2">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-12 h-12 items-center justify-center"
                >
                    <MaterialIcons name="close" size={28} color="#111618" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-[#111618]">Avaliar Prestador</Text>
                <View className="w-12 h-12" />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Rating Question */}
                <Text className="text-2xl font-bold text-[#111618] text-center pb-3 pt-12">
                    Como foi sua experiência?
                </Text>
                <Text className="text-[14px] text-slate-500 text-center mb-6">
                    Sua avaliação ajuda outros clientes a escolherem os melhores prestadores.
                </Text>

                {/* Star Rating */}
                <View className="flex-row justify-center gap-2 px-4 py-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            activeOpacity={0.7}
                            className="p-3"
                        >
                            <MaterialIcons
                                name="star"
                                size={44}
                                color={star <= rating ? "#FACC15" : "#CBD5E1"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {rating > 0 && (
                    <Text className="text-center text-[15px] font-semibold text-slate-600 mb-6">
                        {["", "Muito ruim", "Ruim", "Regular", "Bom", "Excelente!"][rating]}
                    </Text>
                )}

                {/* Comment Section */}
                <View className="pt-4">
                    <Text className="text-base font-medium text-[#111618] pb-2">
                        Deixe seu comentário (opcional)
                    </Text>
                    <TextInput
                        placeholder="Descreva sua experiência com o serviço..."
                        placeholderTextColor="#94A3B8"
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        numberOfLines={6}
                        className="w-full bg-white rounded-xl border border-slate-200 p-4 text-base text-[#111618] min-h-[144px]"
                        style={{ textAlignVertical: "top" }}
                    />
                </View>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#F6F7F8] p-4 pb-6 shadow-lg">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={rating === 0 || submitting}
                    className={`w-full py-4 rounded-xl items-center justify-center ${rating === 0 || submitting ? "bg-slate-300" : "bg-primary"}`}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-base">Enviar Avaliação</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
