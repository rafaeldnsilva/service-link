import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, StatusBar } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { colors } from "../../theme/colors";
import { mapCustomStyle } from "../../theme/mapStyles";
import { SERVICE_CATEGORIES } from "../../constants/categories";
import { NavigationProp } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { serviceService } from "../../services/supabaseService";

const { width, height } = Dimensions.get("window");

const DEFAULT_REGION = {
    latitude: -23.550520,
    longitude: -46.633308,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
};

export const ClientHomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [region, setRegion] = useState(DEFAULT_REGION);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const initials = (profile?.full_name ?? "U")
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    // Request location on mount
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });
        })();
    }, []);

    // Debounced search — navigate to AllServices with query
    const handleSearchChange = useCallback((text: string) => {
        setSearchQuery(text);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (text.trim().length > 1) {
                navigation.navigate("AllServices");
            }
        }, 300);
    }, [navigation]);

    const handleSearchSubmit = () => {
        navigation.navigate("AllServices");
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* 1. Background Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ width: width, height: height }}
                customMapStyle={mapCustomStyle}
                region={region}
                showsUserLocation
                showsMyLocationButton={false}
            />

            {/* 2. Floating Header */}
            <SafeAreaView className="absolute top-0 w-full px-5 pt-4">
                <View className="flex-row items-center bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] p-3 px-5 gap-3 h-14 border border-gray-50">
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <TextInput
                        placeholder="O que você precisa hoje?"
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 text-base text-gray-800 font-medium h-full"
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        onSubmitEditing={handleSearchSubmit}
                        returnKeyType="search"
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ClientProfileMenu")}
                        className="w-10 h-10 rounded-full bg-primary items-center justify-center"
                    >
                        <Text className="text-white font-bold text-sm">{initials}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* 3. Bottom Sheet Panel */}
            <View className="absolute bottom-0 w-full bg-white rounded-t-[32px] pt-5 pb-8 px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                {/* Handle */}
                <View className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <Text className="text-[19px] font-bold text-gray-900 mb-5 ml-1">Categorias Populares</Text>

                <View className="flex-row flex-wrap gap-3">
                    {SERVICE_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm active:bg-gray-50 mb-1"
                            style={{ flexGrow: 1, flexBasis: '45%' }} // Grid-ish layout
                        >
                            <View className="mr-3 w-8 h-8 items-center justify-center bg-slate-50 rounded-full">
                                {cat.name === "Encanador" ? (
                                    <FontAwesome5 name="faucet" size={16} color={colors.primary} />
                                ) : (
                                    <MaterialIcons name={cat.icon as any} size={20} color={colors.primary} />
                                )}
                            </View>
                            <Text className="text-slate-700 font-semibold text-[14px]">{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom Action Button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("AllServices")}
                    className="w-full bg-[#E9D5FF] py-4 rounded-xl items-center justify-center mt-6 active:bg-[#d8b4fe] shadow-sm shadow-purple-200"
                >
                    <Text className="text-[#6B21A8] font-bold text-[17px]">Ver todos os serviços</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
