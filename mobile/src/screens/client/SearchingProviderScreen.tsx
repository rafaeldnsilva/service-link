import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Animated } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import * as Location from "expo-location";
import { colors } from "../../theme/colors";
import { NavigationProp, RootStackParamList } from "../../types/navigation";
import { supabase } from "../../lib/supabase";
import { bookingService } from "../../services/supabaseService";

const { width, height } = Dimensions.get("window");
const SEARCH_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

type RouteProps = RouteProp<RootStackParamList, "SearchingProvider">;

interface NearbyProvider {
    provider_id: string;
    latitude: number;
    longitude: number;
}

const mapStyle = [
    { featureType: "all", elementType: "all", stylers: [{ saturation: -100 }, { lightness: 50 }] },
];

export const SearchingProviderScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { bookingId } = route.params ?? {};

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [clientCoords, setClientCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [nearbyProviders, setNearbyProviders] = useState<NearbyProvider[]>([]);

    // Pulse animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    // Get client location for map centering + nearby provider query
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setClientCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        })();
    }, []);

    // LOC-04: Query nearby available providers to display on map
    useEffect(() => {
        if (!clientCoords) return;
        const { latitude, longitude } = clientCoords;
        const delta = 0.05; // ~5 km bounding box
        supabase
            .from("provider_locations")
            .select("provider_id, latitude, longitude")
            .gte("latitude", latitude - delta)
            .lte("latitude", latitude + delta)
            .gte("longitude", longitude - delta)
            .lte("longitude", longitude + delta)
            .then(({ data }) => {
                if (data) setNearbyProviders(data as NearbyProvider[]);
            });
    }, [clientCoords]);

    // Subscribe to booking status changes via Realtime
    useEffect(() => {
        if (!bookingId) {
            // Fallback: simulate finding provider after 5s
            const t = setTimeout(() => navigation.navigate("ServiceTracking", {}), 5000);
            return () => clearTimeout(t);
        }

        // Hard timeout: cancel search after 2 minutes
        const timeout = setTimeout(async () => {
            await bookingService.cancelBooking(bookingId);
            navigation.goBack();
        }, SEARCH_TIMEOUT_MS);

        const channel = supabase
            .channel(`booking-status:${bookingId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "bookings",
                    filter: `id=eq.${bookingId}`,
                },
                (payload) => {
                    const updated = payload.new as { status: string; provider_id: string };
                    if (updated.status === "accepted") {
                        clearTimeout(timeout);
                        navigation.navigate("ServiceTracking", {
                            bookingId,
                            providerId: updated.provider_id,
                        });
                    } else if (updated.status === "cancelled") {
                        clearTimeout(timeout);
                        navigation.goBack();
                    }
                },
            )
            .subscribe();

        return () => {
            clearTimeout(timeout);
            supabase.removeChannel(channel);
        };
    }, [bookingId]);

    const handleCancel = async () => {
        if (bookingId) {
            await bookingService.cancelBooking(bookingId).catch(() => {});
        }
        navigation.goBack();
    };

    const region = clientCoords
        ? { ...clientCoords, latitudeDelta: 0.05, longitudeDelta: 0.05 }
        : { latitude: -23.5505, longitude: -46.6333, latitudeDelta: 0.05, longitudeDelta: 0.05 };

    return (
        <View className="flex-1 bg-white">
            {/* Map with nearby providers */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ width, height }}
                customMapStyle={mapStyle}
                region={region}
            >
                {clientCoords && (
                    <Marker coordinate={clientCoords}>
                        <View className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                    </Marker>
                )}
                {nearbyProviders.map((p) => (
                    <Marker
                        key={p.provider_id}
                        coordinate={{ latitude: Number(p.latitude), longitude: Number(p.longitude) }}
                    >
                        <View className="w-10 h-10 bg-primary rounded-full border-2 border-white shadow-lg items-center justify-center">
                            <MaterialIcons name="build" size={18} color="white" />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Header */}
            <SafeAreaView className="absolute top-0 left-0 right-0">
                <View className="flex-row items-center justify-between px-4 py-3">
                    <TouchableOpacity
                        onPress={handleCancel}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimaryLight} />
                    </TouchableOpacity>
                    <Text className="text-slate-400 text-[13px] font-medium tracking-widest uppercase">
                        SERVICELINK
                    </Text>
                    <View className="w-10" />
                </View>
            </SafeAreaView>

            {/* Animated Search Icon */}
            <View className="absolute top-1/2 left-1/2 -ml-16 -mt-16 items-center justify-center">
                <Animated.View
                    style={{
                        transform: [{ scale: pulseAnim }],
                        opacity: pulseAnim.interpolate({ inputRange: [1, 1.3], outputRange: [0.3, 0.1] }),
                    }}
                    className="absolute w-32 h-32 bg-blue-500 rounded-full"
                />
                <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center shadow-2xl border-4 border-white">
                    <MaterialIcons name="person-search" size={36} color="white" />
                </View>
            </View>

            {/* Bottom Card */}
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] pt-6 pb-8 px-6 shadow-2xl">
                <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
                    Localizando seu prestador...
                </Text>
                <Text className="text-[14px] text-slate-500 text-center mb-2 leading-5">
                    Estamos verificando a disponibilidade dos profissionais próximos.
                </Text>
                {nearbyProviders.length > 0 && (
                    <Text className="text-[13px] text-primary text-center font-semibold mb-4">
                        {nearbyProviders.length} prestador{nearbyProviders.length > 1 ? "es" : ""} disponível{nearbyProviders.length > 1 ? "is" : ""} na sua área
                    </Text>
                )}
                <TouchableOpacity onPress={handleCancel} className="w-full py-4 items-center justify-center">
                    <Text className="text-red-500 font-bold text-[16px]">✕ Cancelar Pedido</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
