import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp, RootStackParamList } from "../../types/navigation";
import { supabase } from "../../lib/supabase";

const { width, height } = Dimensions.get("window");

type RouteProps = RouteProp<RootStackParamList, "ServiceTracking">;

interface ProviderLocation {
    latitude: number;
    longitude: number;
}

interface BookingDetails {
    provider_id: string;
    total_amount: number | null;
    service: { title: string } | null;
    provider: { full_name: string | null; avatar_url: string | null } | null;
}

const CLIENT_COORDS = { latitude: -23.550520, longitude: -46.633308 };

const mapStyle = [
    { featureType: "landscape", stylers: [{ color: "#e8f5e9" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#ffa726" }] },
    { featureType: "water", stylers: [{ color: "#90caf9" }] },
];

export const ServiceTrackingScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { bookingId, providerId } = route.params ?? {};

    const mapRef = useRef<MapView>(null);
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [providerLocation, setProviderLocation] = useState<ProviderLocation | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch booking details for provider name and service info
    useEffect(() => {
        if (!bookingId) { setLoading(false); return; }
        supabase
            .from("bookings")
            .select(`
                provider_id,
                total_amount,
                service:services(title),
                provider:profiles!bookings_provider_id_fkey(full_name, avatar_url)
            `)
            .eq("id", bookingId)
            .single()
            .then(({ data }) => {
                if (data) setBooking(data as unknown as BookingDetails);
            })
            .finally(() => setLoading(false));
    }, [bookingId]);

    // LOC-03: Fetch initial provider location, then subscribe Realtime
    useEffect(() => {
        const pid = providerId ?? booking?.provider_id;
        if (!pid) return;

        // Fetch current position
        supabase
            .from("provider_locations")
            .select("latitude, longitude")
            .eq("provider_id", pid)
            .single()
            .then(({ data }) => {
                if (data) setProviderLocation({ latitude: Number(data.latitude), longitude: Number(data.longitude) });
            });

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`provider-location:${pid}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "provider_locations",
                    filter: `provider_id=eq.${pid}`,
                },
                (payload) => {
                    const loc = payload.new as { latitude: string; longitude: string };
                    setProviderLocation({
                        latitude: Number(loc.latitude),
                        longitude: Number(loc.longitude),
                    });
                },
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [providerId, booking?.provider_id]);

    // Pan map to fit both markers when provider location updates
    useEffect(() => {
        if (!providerLocation || !mapRef.current) return;
        mapRef.current.fitToCoordinates([CLIENT_COORDS, providerLocation], {
            edgePadding: { top: 80, right: 40, bottom: 280, left: 40 },
            animated: true,
        });
    }, [providerLocation]);

    const providerMarker = providerLocation ?? { latitude: -23.556, longitude: -46.638 };
    const providerName = booking?.provider?.full_name ?? "Prestador";
    const serviceTitle = (booking?.service as { title: string } | null)?.title ?? "Serviço";

    return (
        <View className="flex-1">
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ width, height }}
                customMapStyle={mapStyle}
                initialRegion={{
                    latitude: (CLIENT_COORDS.latitude + providerMarker.latitude) / 2,
                    longitude: (CLIENT_COORDS.longitude + providerMarker.longitude) / 2,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                }}
            >
                <Polyline
                    coordinates={[CLIENT_COORDS, providerMarker]}
                    strokeColor="#3B82F6"
                    strokeWidth={4}
                    lineDashPattern={[8, 4]}
                />
                <Marker coordinate={CLIENT_COORDS}>
                    <View className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                </Marker>
                <Marker coordinate={providerMarker}>
                    <View className="w-14 h-14 bg-primary rounded-full border-4 border-white shadow-lg items-center justify-center">
                        <MaterialIcons name="directions-car" size={24} color="white" />
                    </View>
                </Marker>
            </MapView>

            {/* Back Button */}
            <SafeAreaView className="absolute top-0 left-0 p-4">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.textPrimaryLight} />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Status Badge */}
            <View className="absolute top-20 left-1/2 -ml-32 bg-white px-6 py-2 rounded-full shadow-lg flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-[13px] font-semibold text-slate-900 mr-1">A CAMINHO</Text>
                <Text className="text-[11px] text-slate-500">Localização em tempo real</Text>
            </View>

            {/* Bottom Card */}
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pt-4 pb-8 px-6 shadow-2xl">
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 24 }} />
                ) : (
                    <>
                        <View className="bg-slate-50 rounded-2xl p-4 mb-4">
                            <Text className="text-[13px] text-slate-500 mb-1">{serviceTitle}</Text>
                            <Text className="text-3xl font-bold text-slate-900">A caminho</Text>
                            <Text className="text-[13px] text-slate-500 mt-1">Posição atualizada em tempo real</Text>
                        </View>

                        <View className="flex-row items-center mb-4">
                            <View className="w-14 h-14 rounded-full bg-primary items-center justify-center">
                                <Text className="text-white font-bold text-xl">
                                    {providerName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className="text-[17px] font-bold text-slate-900">{providerName}</Text>
                                <Text className="text-[13px] text-slate-500">{serviceTitle}</Text>
                            </View>
                            {bookingId && (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("ChatScreen", { bookingId })}
                                    className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-md"
                                >
                                    <MaterialIcons name="chat" size={22} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity onPress={() => navigation.goBack()} className="py-3 items-center">
                            <Text className="text-slate-500 font-semibold text-[15px]">Voltar</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};
