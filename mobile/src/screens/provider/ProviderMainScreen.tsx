import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Alert, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE, Circle } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { NavigationProp } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../services/supabaseService";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";

type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
    service?: Database["public"]["Tables"]["services"]["Row"];
    client?: Database["public"]["Tables"]["profiles"]["Row"];
};

const DEFAULT_REGION = {
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

export const ProviderMainScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();

    const [isOnline, setIsOnline] = useState(true);
    const [region, setRegion] = useState(DEFAULT_REGION);
    const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
    const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        })();
    }, []);

    // LOC-02: Publish location every 30s when online
    useEffect(() => {
        if (!user || !isOnline) return;

        const publish = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            await supabase.from("provider_locations").upsert({
                provider_id: user.id,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                updated_at: new Date().toISOString(),
            });
        };

        publish();
        const interval = setInterval(publish, 30_000);
        return () => clearInterval(interval);
    }, [user, isOnline]);

    useEffect(() => {
        if (user && isOnline) {
            loadPendingBookings();
        } else {
            setPendingBookings([]);
            setCurrentBooking(null);
        }
    }, [user, isOnline]);

    const loadPendingBookings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await bookingService.getPendingBookings(user.id);
            setPendingBookings(data);
            if (data.length > 0 && !currentBooking) {
                setCurrentBooking(data[0]);
            }
        } catch (error) {
            console.error("Error loading pending bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!currentBooking) return;
        setActionLoading(true);
        try {
            await bookingService.acceptBooking(currentBooking.id);
            navigation.navigate("ServiceAcceptance");
            const remaining = pendingBookings.filter(b => b.id !== currentBooking.id);
            setPendingBookings(remaining);
            setCurrentBooking(remaining[0] ?? null);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível aceitar o pedido.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!currentBooking) return;
        setActionLoading(true);
        try {
            await bookingService.cancelBooking(currentBooking.id);
            const remaining = pendingBookings.filter(b => b.id !== currentBooking.id);
            setPendingBookings(remaining);
            setCurrentBooking(remaining[0] ?? null);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível rejeitar o pedido.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <View className="flex-1">
            <StatusBar barStyle="dark-content" />

            {/* Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                region={region}
                showsUserLocation
                customMapStyle={[
                    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
                    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
                ]}
            >
                {isOnline && (
                    <Circle
                        center={{ latitude: region.latitude, longitude: region.longitude }}
                        radius={2000}
                        fillColor="rgba(44, 9, 127, 0.15)"
                        strokeColor="rgba(44, 9, 127, 0.4)"
                        strokeWidth={2}
                    />
                )}
            </MapView>

            {/* Online/Offline Toggle */}
            <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center">
                <View className={`rounded-full px-5 py-2.5 shadow-lg ${isOnline ? "bg-green-500" : "bg-slate-400"}`}>
                    <Text className="text-white font-bold text-[14px]">
                        {isOnline ? "● ONLINE" : "○ OFFLINE"}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => setIsOnline(!isOnline)}
                    className="bg-white rounded-full px-5 py-2.5 shadow-lg"
                >
                    <Text className="font-bold text-[14px] text-slate-600">
                        {isOnline ? "Ficar Offline" : "Ficar Online"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content at bottom */}
            <View className="absolute bottom-8 left-4 right-4">
                {!isOnline ? (
                    <View className="bg-white rounded-3xl p-6 shadow-2xl items-center">
                        <MaterialIcons name="wifi-off" size={40} color="#94A3B8" />
                        <Text className="text-slate-700 font-bold text-[18px] mt-3 text-center">
                            Você está offline
                        </Text>
                        <Text className="text-slate-400 text-[14px] mt-1 text-center">
                            Toque em "Ficar Online" para receber pedidos
                        </Text>
                    </View>
                ) : loading ? (
                    <View className="bg-white rounded-3xl p-6 shadow-2xl items-center">
                        <ActivityIndicator size="large" color="#2C097F" />
                        <Text className="text-slate-500 mt-3">Buscando pedidos...</Text>
                    </View>
                ) : currentBooking ? (
                    <View className="bg-white rounded-3xl p-6 shadow-2xl">
                        <View className="flex-row items-center mb-2">
                            <View className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                            <Text className="text-orange-500 font-semibold text-[13px] uppercase tracking-wide">
                                Novo Pedido
                            </Text>
                        </View>

                        <Text className="text-slate-900 font-bold text-[20px] mb-3">
                            {currentBooking.service?.title ?? "Serviço"}
                        </Text>

                        <View className="flex-row items-center mb-4 gap-4">
                            <View className="flex-row items-center">
                                <MaterialIcons name="person" size={18} color="#64748B" />
                                <Text className="text-slate-600 ml-1 text-[14px]">
                                    {currentBooking.client?.full_name ?? "Cliente"}
                                </Text>
                            </View>
                            {currentBooking.total_amount && (
                                <View className="flex-row items-center">
                                    <MaterialIcons name="attach-money" size={18} color="#64748B" />
                                    <Text className="text-slate-600 ml-1 text-[14px]">
                                        R$ {currentBooking.total_amount.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {pendingBookings.length > 1 && (
                            <Text className="text-[12px] text-slate-400 mb-4">
                                +{pendingBookings.length - 1} pedido(s) aguardando
                            </Text>
                        )}

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleReject}
                                disabled={actionLoading}
                                className="flex-1 bg-slate-100 py-3.5 rounded-2xl items-center active:bg-slate-200"
                            >
                                <Text className="text-slate-700 font-semibold text-[16px]">Rejeitar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleAccept}
                                disabled={actionLoading}
                                className="flex-1 bg-green-500 py-3.5 rounded-2xl items-center active:opacity-90"
                            >
                                {actionLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-[16px]">Aceitar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View className="bg-white rounded-3xl p-6 shadow-2xl items-center">
                        <MaterialIcons name="check-circle-outline" size={40} color="#10B981" />
                        <Text className="text-slate-700 font-bold text-[18px] mt-3 text-center">
                            Aguardando novos pedidos
                        </Text>
                        <Text className="text-slate-400 text-[14px] mt-1 text-center">
                            Você receberá uma notificação quando um cliente solicitar seus serviços
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};
