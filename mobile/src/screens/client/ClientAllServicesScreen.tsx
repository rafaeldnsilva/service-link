import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { serviceService } from "../../services/supabaseService";
import { Database } from "../../types/supabase";

type Service = Database['public']['Tables']['services']['Row'] & {
    provider?: Database['public']['Tables']['profiles']['Row'];
};

// Define the navigation prop type for this screen
type ClientAllServicesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllServices'>;

// Category icon mapping
const CATEGORY_ICONS: Record<string, { icon: string; iconSet: "MaterialIcons" | "FontAwesome5"; rotateIcon?: boolean }> = {
    "Eletricista": { icon: "electrical-services", iconSet: "MaterialIcons" },
    "Encanador": { icon: "plumbing", iconSet: "MaterialIcons", rotateIcon: true },
    "Pintor": { icon: "format-paint", iconSet: "MaterialIcons" },
    "Faxina": { icon: "cleaning-services", iconSet: "MaterialIcons" },
    "Limpeza": { icon: "cleaning-services", iconSet: "MaterialIcons" },
    "TI & Redes": { icon: "lan", iconSet: "MaterialIcons" },
    "Montador": { icon: "construction", iconSet: "MaterialIcons" },
    "Jardinagem": { icon: "yard", iconSet: "MaterialIcons" },
    "Fretes": { icon: "local-shipping", iconSet: "MaterialIcons" },
};

interface ServiceItemProps {
    service: Service;
    onPress: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service, onPress }) => {
    const iconConfig = CATEGORY_ICONS[service.category] || { icon: "build", iconSet: "MaterialIcons" as const };

    return (
        <TouchableOpacity
            className="flex-row items-center p-4 bg-white rounded-2xl shadow-sm mb-3 border border-gray-50 active:bg-gray-50"
            onPress={onPress}
        >
            <View className="mr-4 w-12 h-12 bg-purple-50 rounded-full items-center justify-center">
                {iconConfig.iconSet === "FontAwesome5" ? (
                    <FontAwesome5 name={iconConfig.icon as any} size={20} color="#4C1D95" />
                ) : (
                    <MaterialIcons name={iconConfig.icon as any} size={24} color="#4C1D95" />
                )}
            </View>
            <View className="flex-1">
                <Text className="font-semibold text-zinc-900 text-base">{service.title}</Text>
                <Text className="text-zinc-500 text-sm mt-0.5" numberOfLines={1}>
                    {service.provider?.full_name || 'Prestador'}
                </Text>
            </View>
            <View className="ml-2">
                <Text className="font-bold text-[#4C1D95] text-base">
                    R$ {service.price.toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export const ClientAllServicesScreen: React.FC = () => {
    const navigation = useNavigation<ClientAllServicesNavigationProp>();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const data = await serviceService.getAllServices();
            setServices(data);
        } catch (error) {
            console.error("Error loading services:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter(service => {
        const matchesCategory = !selectedCategory || service.category === selectedCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q ||
            service.title.toLowerCase().includes(q) ||
            service.category.toLowerCase().includes(q) ||
            service.description?.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });

    const servicesByCategory = filteredServices.reduce((acc, service) => {
        if (!acc[service.category]) acc[service.category] = [];
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    const categories = [...new Set(services.map(s => s.category))].sort();

    const handleServicePress = (service: Service) => {
        if (service.provider_id) {
            navigation.navigate("ProviderProfile", { providerId: service.provider_id });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            <View className="p-4 flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2"
                    >
                        <MaterialIcons name="arrow-back-ios" size={20} color="#71717a" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-zinc-900">Todos os Serviços</Text>
                    <View className="w-10 h-10" />
                </View>

                {/* Search Bar */}
                <View className="relative mb-3">
                    <MaterialIcons name="search" size={24} color="#a1a1aa" style={{ position: "absolute", left: 16, top: 12, zIndex: 1 }} />
                    <TextInput
                        className="w-full pl-12 pr-4 py-3 bg-zinc-100 rounded-full text-zinc-900 text-base"
                        placeholder="Qual serviço você precisa?"
                        placeholderTextColor="#a1a1aa"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                </View>

                {/* Category Filter Chips */}
                {categories.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 12, gap: 8 }}
                    >
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full border ${!selectedCategory ? "bg-[#4C1D95] border-[#4C1D95]" : "bg-white border-zinc-200"}`}
                        >
                            <Text className={`text-sm font-semibold ${!selectedCategory ? "text-white" : "text-zinc-600"}`}>
                                Todos
                            </Text>
                        </TouchableOpacity>
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? "bg-[#4C1D95] border-[#4C1D95]" : "bg-white border-zinc-200"}`}
                            >
                                <Text className={`text-sm font-semibold ${selectedCategory === cat ? "text-white" : "text-zinc-600"}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Content */}
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#4C1D95" />
                        <Text className="text-zinc-500 mt-4">Carregando serviços...</Text>
                    </View>
                ) : filteredServices.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <MaterialIcons name="search-off" size={64} color="#d4d4d8" />
                        <Text className="text-zinc-500 mt-4 text-center">
                            {searchQuery ? "Nenhum serviço encontrado" : "Nenhum serviço disponível"}
                        </Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                            <View key={category} className="mb-6">
                                <Text className="text-lg font-bold mb-4 text-zinc-900">{category}</Text>
                                {categoryServices.map((service) => (
                                    <ServiceItem
                                        key={service.id}
                                        service={service}
                                        onPress={() => handleServicePress(service)}
                                    />
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};
