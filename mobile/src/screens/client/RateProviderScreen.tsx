import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

export const RateProviderScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [rating, setRating] = useState(4); // Default to 4 stars as shown in design
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        console.log("Rating:", rating, "Comment:", comment);
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F7F8]">
            <StatusBar barStyle="dark-content" backgroundColor="#F6F7F8" />

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
                {/* Provider Info */}
                <View className="items-center pt-4 mb-6">
                    <View className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden shadow-sm mb-4">
                        <Image
                            source={{ uri: "https://i.pravatar.cc/300?img=15" }}
                            className="w-full h-full"
                        />
                    </View>
                    <Text className="text-[22px] font-bold text-[#111618] text-center">João da Silva</Text>
                    <Text className="text-base text-slate-500 text-center">Eletricista</Text>
                </View>

                {/* Rating Question */}
                <Text className="text-2xl font-bold text-[#111618] text-center pb-3 pt-8">
                    Como foi sua experiência?
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
                                size={40}
                                color={star <= rating ? "#FACC15" : "#CBD5E1"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Comment Section */}
                <View className="pt-6">
                    <Text className="text-base font-medium text-[#111618] pb-2">
                        Deixe seu Comentário
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
                    disabled={rating === 0}
                    className={`w-full py-4 rounded-xl items-center justify-center ${rating === 0 ? "bg-slate-300" : "bg-[#1193d4]"
                        }`}
                >
                    <Text className="text-white font-bold text-base">Enviar Avaliação</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
