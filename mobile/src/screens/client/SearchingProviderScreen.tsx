import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions, Animated } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const { width, height } = Dimensions.get("window");

const mapStyle = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [{ "saturation": -100 }, { "lightness": 50 }]
    },
];

export const SearchingProviderScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Auto navigate to tracking after 3 seconds (simulating finding a provider)
        const timeout = setTimeout(() => {
            navigation.navigate("ServiceTracking");
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View className="flex-1 bg-white">
            {/* Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ width: width, height: height }}
                customMapStyle={mapStyle}
                initialRegion={{
                    latitude: -23.550520,
                    longitude: -46.633308,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            />

            {/* Header */}
            <SafeAreaView className="absolute top-0 left-0 right-0">
                <View className="flex-row items-center justify-between px-4 py-3">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
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
                        opacity: pulseAnim.interpolate({
                            inputRange: [1, 1.3],
                            outputRange: [0.3, 0.1],
                        }),
                    }}
                    className="absolute w-32 h-32 bg-blue-500 rounded-full"
                />
                <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center shadow-2xl shadow-blue-400 border-4 border-white">
                    <MaterialIcons name="person-search" size={36} color="white" />
                </View>
            </View>

            {/* Bottom Card */}
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] pt-6 pb-8 px-6 shadow-2xl">
                <Text className="text-2xl font-bold text-slate-900 text-center mb-3">
                    Aguarde, estamos localizando um prestador de serviços para você...
                </Text>
                <Text className="text-[14px] text-slate-500 text-center mb-6 leading-5">
                    Isso pode levar alguns instantes. Estamos verificando a disponibilidade dos profissionais próximos.
                </Text>

                {/* Cancel Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-full py-4 items-center justify-center"
                >
                    <Text className="text-red-500 font-bold text-[16px]">✕ Cancelar Pedido</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
