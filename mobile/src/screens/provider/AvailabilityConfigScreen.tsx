import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE, Circle } from "react-native-maps";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const DAYS = ["S", "T", "Q", "Q", "S", "S", "D"];
const DAY_NAMES = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export const AvailabilityConfigScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();
    const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("18:00");
    const [radius, setRadius] = useState(25);
    const [saving, setSaving] = useState(false);

    const toggleDay = (index: number) => {
        if (selectedDays.includes(index)) {
            setSelectedDays(selectedDays.filter((d) => d !== index));
        } else {
            setSelectedDays([...selectedDays, index]);
        }
    };

    const handleCopyToAllDays = () => {
        setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    };

    const handleFinish = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    is_available: true,
                    coverage_radius_km: radius,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (error) throw error;

            Alert.alert("Sucesso!", "Disponibilidade configurada com sucesso.", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar a configuração.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-slate-50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">
                    Configuração de Disponibilidade
                </Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Progress */}
                <View className="px-4 mb-6">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-600 text-[15px]">Passo 3 de 4</Text>
                        <Text className="text-slate-600 text-[15px]">75%</Text>
                    </View>
                    <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <View className="h-full w-3/4 bg-[#2C097F] rounded-full" />
                    </View>
                </View>

                {/* Description */}
                <Text className="px-4 text-slate-600 text-[15px] mb-6 leading-6">
                    Defina seus horários e área de atuação para receber as melhores oportunidades de serviço.
                </Text>

                {/* Days Selection */}
                <View className="px-4 mb-6">
                    <Text className="text-slate-900 font-bold text-[18px] mb-4">
                        Quais dias você trabalha?
                    </Text>
                    <View className="flex-row flex-wrap gap-3">
                        {DAYS.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => toggleDay(index)}
                                className={`w-14 h-14 rounded-full items-center justify-center ${
                                    selectedDays.includes(index) ? "bg-[#2C097F]" : "bg-slate-200"
                                }`}
                                activeOpacity={0.8}
                            >
                                <Text
                                    className={`font-bold text-[18px] ${
                                        selectedDays.includes(index) ? "text-white" : "text-slate-400"
                                    }`}
                                >
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Working Hours */}
                <View className="px-4 mb-6">
                    <Text className="text-slate-900 font-bold text-[18px] mb-4">
                        Qual seu horário de trabalho?
                    </Text>
                    <View className="flex-row gap-4 mb-3">
                        <View className="flex-1">
                            <Text className="text-slate-600 text-[15px] mb-2">Início</Text>
                            <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center border border-slate-200">
                                <TextInput
                                    value={startTime}
                                    onChangeText={setStartTime}
                                    className="flex-1 text-slate-900 text-[17px]"
                                    placeholder="09:00 AM"
                                />
                                <MaterialIcons name="access-time" size={22} color="#9CA3AF" />
                            </View>
                        </View>

                        <View className="flex-1">
                            <Text className="text-slate-600 text-[15px] mb-2">Fim</Text>
                            <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center border border-slate-200">
                                <TextInput
                                    value={endTime}
                                    onChangeText={setEndTime}
                                    className="flex-1 text-slate-900 text-[17px]"
                                    placeholder="06:00 PM"
                                />
                                <MaterialIcons name="access-time" size={22} color="#9CA3AF" />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleCopyToAllDays}
                        className="bg-purple-50 border border-[#2C097F] rounded-2xl py-3 items-center flex-row justify-center"
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="content-copy" size={20} color="#2C097F" />
                        <Text className="text-[#2C097F] font-semibold text-[15px] ml-2">
                            Copiar para todos os dias
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Coverage Area */}
                <View className="px-4 mb-6">
                    <Text className="text-slate-900 font-bold text-[18px] mb-4">
                        Defina sua área de cobertura
                    </Text>

                    {/* Map with Circle */}
                    <View className="bg-slate-200 rounded-3xl overflow-hidden h-64 mb-4">
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={StyleSheet.absoluteFillObject}
                            initialRegion={{
                                latitude: -23.5505,
                                longitude: -46.6333,
                                latitudeDelta: 0.15,
                                longitudeDelta: 0.15,
                            }}
                            customMapStyle={[
                                {
                                    elementType: "geometry",
                                    stylers: [{ color: "#0d4d4d" }],
                                },
                            ]}
                        >
                            <Circle
                                center={{ latitude: -23.5505, longitude: -46.6333 }}
                                radius={radius * 1000}
                                fillColor="rgba(124, 58, 237, 0.2)"
                                strokeColor="rgba(124, 58, 237, 0.8)"
                                strokeWidth={3}
                            />
                        </MapView>
                    </View>

                    {/* Radius Slider */}
                    <View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-slate-600 text-[15px]">Raio de atendimento</Text>
                            <Text className="text-slate-900 font-bold text-[16px]">{radius} km</Text>
                        </View>
                        <Slider
                            value={radius}
                            onValueChange={setRadius}
                            minimumValue={5}
                            maximumValue={50}
                            step={1}
                            minimumTrackTintColor="#2C097F"
                            maximumTrackTintColor="#E2E8F0"
                            thumbTintColor="#2C097F"
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-slate-50 px-4 py-4 border-t border-slate-200">
                <TouchableOpacity
                    onPress={handleFinish}
                    disabled={saving}
                    className="w-full bg-[#2C097F] py-4 rounded-3xl items-center justify-center active:opacity-90"
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-[18px]">Configurar e Finalizar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
