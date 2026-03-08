import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NavigationProp, RootStackParamList } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { paymentService, PaymentMethod } from "../../services/paymentService";
import { bookingService } from "../../services/supabaseService";

const { width, height } = Dimensions.get("window");

type RouteProps = RouteProp<RootStackParamList, "ServiceConfirmation">;

const mapStyle = [
    { featureType: "landscape", stylers: [{ color: "#d4e7d7" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#d4d4d4" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fdb462" }] },
    { featureType: "water", stylers: [{ color: "#a8d5f2" }] },
];

const CARD_TYPE_LABELS: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    elo: "Elo",
    amex: "Amex",
    hipercard: "Hipercard",
    other: "Cartão",
};

export const ServiceConfirmationScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { serviceId, providerId, serviceTitle, price } = route.params;
    const { user } = useAuth();

    const [defaultMethod, setDefaultMethod] = useState<PaymentMethod | null>(null);
    const [loadingPayment, setLoadingPayment] = useState(true);
    const [confirming, setConfirming] = useState(false);

    const minDate = new Date(Date.now() + 15 * 60 * 1000);
    const [scheduledAt, setScheduledAt] = useState<Date>(minDate);
    const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);

    useEffect(() => {
        if (!user) return;
        paymentService.getDefaultMethod(user.id)
            .then(setDefaultMethod)
            .catch(() => {})
            .finally(() => setLoadingPayment(false));
    }, [user]);

    const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
        if (event.type === "dismissed") {
            setPickerMode(null);
            return;
        }
        if (!selected) return;

        if (pickerMode === "date") {
            const updated = new Date(scheduledAt);
            updated.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
            setScheduledAt(updated);
            // On Android chain to time picker; on iOS the single picker handles both
            setPickerMode(Platform.OS === "android" ? "time" : null);
        } else {
            const updated = new Date(scheduledAt);
            updated.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
            setScheduledAt(updated);
            setPickerMode(null);
        }
    };

    const formatScheduledAt = (date: Date) =>
        date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const handleConfirm = async () => {
        if (!user) return;

        setConfirming(true);
        try {
            const booking = await bookingService.createBooking({
                client_id: user.id,
                service_id: serviceId,
                provider_id: providerId,
                scheduled_at: scheduledAt.toISOString(),
                total_amount: price,
            });

            // Create a pending payment record
            await paymentService.createPayment({
                bookingId: booking.id,
                paymentMethodId: defaultMethod?.id ?? null,
                amount: price,
            });

            navigation.navigate("SearchingProvider", { bookingId: booking.id });
        } catch {
            Alert.alert("Erro", "Não foi possível confirmar o pedido. Tente novamente.");
        } finally {
            setConfirming(false);
        }
    };

    const paymentLabel = loadingPayment
        ? "Carregando..."
        : defaultMethod
            ? `${CARD_TYPE_LABELS[defaultMethod.card_type] ?? "Cartão"} •••• ${defaultMethod.last4}`
            : "Sem cartão cadastrado";

    return (
        <View className="flex-1 bg-white">
            {/* Background Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ width, height }}
                customMapStyle={mapStyle}
                initialRegion={{
                    latitude: -23.550520,
                    longitude: -46.633308,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                <Marker coordinate={{ latitude: -23.550520, longitude: -46.633308 }}>
                    <View className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white" />
                </Marker>
            </MapView>

            {/* Bottom Sheet */}
            <View className="absolute bottom-0 w-full bg-white rounded-t-[32px] pt-3 pb-8 px-6 shadow-2xl">
                {/* Handle */}
                <View className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

                {/* Service Title */}
                <Text className="text-2xl font-bold text-slate-900 mb-1 text-center">
                    {serviceTitle}
                </Text>

                {/* Price */}
                <Text className="text-xl font-bold text-slate-900 mb-6 text-center">
                    R$ {price.toFixed(2)}
                </Text>

                {/* Info Items */}
                <View className="mb-6 gap-3">
                    <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => setPickerMode("date")}
                        activeOpacity={0.7}
                    >
                        <View className="w-10 h-10 rounded-full bg-slate-900 items-center justify-center">
                            <MaterialIcons name="calendar-today" size={20} color="white" />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-[13px] text-slate-400">Data e hora agendada</Text>
                            <Text className="text-[15px] font-semibold text-slate-800">
                                {formatScheduledAt(scheduledAt)}
                            </Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-full bg-slate-900 items-center justify-center">
                                {loadingPayment ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <MaterialIcons
                                        name={defaultMethod ? "credit-card" : "credit-card-off"}
                                        size={20}
                                        color="white"
                                    />
                                )}
                            </View>
                            <Text className={`ml-3 text-[15px] ${defaultMethod ? "text-slate-700" : "text-red-500"}`}>
                                {paymentLabel}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("PaymentMethods")}>
                            <Text className="text-[15px] font-semibold text-primary">
                                {defaultMethod ? "Alterar" : "Adicionar"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={confirming || loadingPayment}
                    className={`w-full py-4 rounded-2xl items-center justify-center mb-3 shadow-lg ${confirming || loadingPayment ? "bg-slate-300" : "bg-primary shadow-purple-200 active:opacity-90"}`}
                >
                    {confirming ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-[17px]">Solicitar Agora</Text>
                    )}
                </TouchableOpacity>

                {/* Verified Badge */}
                <View className="flex-row items-center justify-center gap-1">
                    <MaterialIcons name="verified" size={16} color="#10B981" />
                    <Text className="text-[13px] text-slate-600">Profissionais verificados</Text>
                </View>
            </View>

            {pickerMode !== null && (
                <DateTimePicker
                    value={scheduledAt}
                    mode={pickerMode}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    minimumDate={minDate}
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};
