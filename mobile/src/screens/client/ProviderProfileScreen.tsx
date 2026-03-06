import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Share, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp, RootStackParamList } from "../../types/navigation";
import { profileService } from "../../services/supabaseService";
import { Database } from "../../types/supabase";

type RouteProps = RouteProp<RootStackParamList, "ProviderProfile">;

type ProviderService = Database["public"]["Tables"]["services"]["Row"];
type ProviderProfile = Database["public"]["Tables"]["profiles"]["Row"];

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 18 }) => (
    <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
            <MaterialIcons
                key={star}
                name="star"
                size={size}
                color={star <= Math.round(rating) ? "#FCD34D" : "#E2E8F0"}
            />
        ))}
    </View>
);

export const ProviderProfileScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { providerId } = route.params;

    const [activeTab, setActiveTab] = useState<"services" | "portfolio" | "reviews">("services");
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProviderProfile | null>(null);
    const [services, setServices] = useState<ProviderService[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        loadProviderData();
    }, [providerId]);

    const loadProviderData = async () => {
        try {
            setLoading(true);
            const data = await profileService.getProviderDetails(providerId);
            setProfile(data.profile);
            setServices(data.services);
            setAverageRating(data.averageRating);
            setTotalReviews(data.totalReviews);
        } catch (error) {
            console.error("Error loading provider:", error);
            Alert.alert("Erro", "Não foi possível carregar o perfil do prestador.");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Confira o perfil de ${profile?.full_name ?? "prestador"} no ServiceLink!`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleHire = (service: ProviderService) => {
        navigation.navigate("ServiceConfirmation", {
            serviceId: service.id,
            providerId,
            serviceTitle: service.title,
            price: service.price,
        });
    };

    const initials = (profile?.full_name ?? "P")
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="text-slate-500 mt-4">Carregando perfil...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-[20px] font-bold text-slate-900">
                    Perfil do Prestador
                </Text>
                <TouchableOpacity onPress={handleShare} className="w-10 items-end">
                    <MaterialIcons name="share" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
            </View>

            <ScrollView className="bg-slate-50" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Profile Card */}
                <View className="mx-4 mt-4 mb-4 bg-white rounded-3xl p-6 shadow-sm">
                    <View className="flex-row items-start gap-4">
                        <View className="w-28 h-28 rounded-full overflow-hidden bg-purple-100 items-center justify-center">
                            {profile?.avatar_url ? (
                                <Image source={{ uri: profile.avatar_url }} className="w-full h-full" />
                            ) : (
                                <Text className="text-primary font-bold text-3xl">{initials}</Text>
                            )}
                        </View>
                        <View className="flex-1">
                            <Text className="text-[22px] font-bold text-slate-900 mb-1">
                                {profile?.full_name ?? "Prestador"}
                            </Text>
                            <Text className="text-[14px] text-slate-400 mb-2">Prestador de Serviços</Text>
                            <View className="flex-row items-center gap-1">
                                <StarRating rating={averageRating} />
                                <Text className="text-[15px] font-bold text-slate-900 ml-1">
                                    {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                                </Text>
                                <Text className="text-[13px] text-slate-400">
                                    ({totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"})
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View className="flex-row mt-5 pt-5 border-t border-slate-100">
                        <View className="flex-1 items-center">
                            <Text className="text-[22px] font-bold text-slate-900">{services.length}</Text>
                            <Text className="text-[12px] text-slate-400 mt-0.5">Serviços</Text>
                        </View>
                        <View className="w-px bg-slate-100" />
                        <View className="flex-1 items-center">
                            <Text className="text-[22px] font-bold text-slate-900">{totalReviews}</Text>
                            <Text className="text-[12px] text-slate-400 mt-0.5">Avaliações</Text>
                        </View>
                        <View className="w-px bg-slate-100" />
                        <View className="flex-1 items-center">
                            <Text className="text-[22px] font-bold text-slate-900">
                                {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                            </Text>
                            <Text className="text-[12px] text-slate-400 mt-0.5">Nota</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-white border-b border-slate-200">
                    {(["services", "portfolio", "reviews"] as const).map((tab) => {
                        const labels = { services: "Serviços", portfolio: "Portfólio", reviews: "Avaliações" };
                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`flex-1 pb-3 pt-3 ${activeTab === tab ? "border-b-[3px] border-primary" : ""}`}
                            >
                                <Text className={`text-center text-[14px] font-bold ${activeTab === tab ? "text-primary" : "text-slate-400"}`}>
                                    {labels[tab]}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Services Tab */}
                {activeTab === "services" && (
                    <View className="bg-white">
                        {services.length === 0 ? (
                            <Text className="text-center text-slate-500 py-8">Nenhum serviço cadastrado</Text>
                        ) : (
                            services.map((service, index) => (
                                <View
                                    key={service.id}
                                    className={`px-4 py-5 ${index < services.length - 1 ? "border-b border-slate-100" : ""}`}
                                >
                                    <View className="flex-row items-start justify-between mb-2">
                                        <Text className="flex-1 text-[17px] font-bold text-slate-900">
                                            {service.title}
                                        </Text>
                                        <Text className="text-[16px] font-bold text-primary ml-3">
                                            R$ {service.price.toFixed(2)}
                                        </Text>
                                    </View>
                                    {service.description ? (
                                        <Text className="text-[13px] text-slate-500 leading-5 mb-3">
                                            {service.description}
                                        </Text>
                                    ) : null}
                                    <TouchableOpacity
                                        onPress={() => handleHire(service)}
                                        className="self-start bg-primary/10 px-4 py-2 rounded-xl active:bg-primary/20"
                                    >
                                        <Text className="text-primary font-semibold text-[13px]">Contratar</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </View>
                )}

                {/* Portfolio Tab */}
                {activeTab === "portfolio" && (
                    <View className="bg-white">
                        <Text className="text-center text-slate-500 py-8">Nenhum item no portfólio ainda</Text>
                    </View>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <View className="bg-white">
                        <Text className="text-center text-slate-500 py-8">Nenhuma avaliação ainda</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-2xl flex-row gap-3">
                <TouchableOpacity
                    onPress={() => navigation.navigate("ChatScreen", { providerId })}
                    className="flex-1 bg-slate-100 py-4 rounded-3xl items-center justify-center active:bg-slate-200"
                >
                    <Text className="text-slate-700 font-bold text-[16px]">Mensagem</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (services.length > 0) {
                            handleHire(services[0]);
                        } else {
                            Alert.alert("Sem serviços", "Este prestador não possui serviços cadastrados.");
                        }
                    }}
                    className="flex-1 bg-primary py-4 rounded-3xl items-center justify-center active:opacity-90"
                >
                    <Text className="text-white font-bold text-[16px]">Contratar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
