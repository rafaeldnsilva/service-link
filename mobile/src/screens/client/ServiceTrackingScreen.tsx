import React from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const { width, height } = Dimensions.get("window");

const mapStyle = [
    {
        "featureType": "landscape",
        "stylers": [{ "color": "#e8f5e9" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffa726" }]
    },
    {
        "featureType": "water",
        "stylers": [{ "color": "#90caf9" }]
    },
];

// Route coordinates (simulated path)
const routeCoordinates = [
    { latitude: -23.550520, longitude: -46.633308 },
    { latitude: -23.552, longitude: -46.635 },
    { latitude: -23.554, longitude: -46.636 },
    { latitude: -23.556, longitude: -46.638 },
];

export const ServiceTrackingScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View className="flex-1">
            {/* Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ width: width, height: height }}
                customMapStyle={mapStyle}
                initialRegion={{
                    latitude: -23.553,
                    longitude: -46.635,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                {/* Route Line */}
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#3B82F6"
                    strokeWidth={4}
                />

                {/* Destination (Client Location) */}
                <Marker coordinate={routeCoordinates[0]}>
                    <View className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                </Marker>

                {/* Provider Location */}
                <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]}>
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

            {/* Help Button */}
            <SafeAreaView className="absolute top-0 right-0 p-4">
                <TouchableOpacity className="w-10 h-10 bg-slate-900 rounded-full items-center justify-center shadow-lg">
                    <MaterialIcons name="help-outline" size={24} color="white" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Status Badge */}
            <View className="absolute top-20 left-1/2 -ml-32 bg-white px-6 py-2 rounded-full shadow-lg flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-[13px] font-semibold text-slate-900 mr-1">STATUS: A CAMINHO</Text>
                <Text className="text-[11px] text-slate-500">Atualizado agora</Text>
            </View>

            {/* Bottom Card */}
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pt-4 pb-8 px-6 shadow-2xl">
                {/* Time Badge */}
                <View className="bg-slate-50 rounded-2xl p-4 mb-4 flex-row items-center">
                    <View className="flex-1">
                        <Text className="text-3xl font-bold text-slate-900">15 min</Text>
                        <Text className="text-[13px] text-slate-500">Tempo estimado de chegada</Text>
                    </View>
                    <TouchableOpacity className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
                        <MaterialIcons name="my-location" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Provider Info */}
                <View className="flex-row items-center mb-4">
                    <View className="w-14 h-14 rounded-full overflow-hidden bg-slate-200">
                        <Image
                            source={{ uri: "https://i.pravatar.cc/300?img=33" }}
                            className="w-full h-full"
                        />
                    </View>
                    <View className="flex-1 ml-3">
                        <View className="flex-row items-center">
                            <Text className="text-[17px] font-bold text-slate-900">Joana Silva</Text>
                            <View className="ml-2 flex-row items-center">
                                <MaterialIcons name="star" size={16} color="#FCD34D" />
                                <Text className="text-[14px] font-semibold text-slate-700 ml-1">4.9</Text>
                            </View>
                        </View>
                        <Text className="text-[13px] text-slate-500">Eletricista Certificada</Text>
                        <View className="flex-row items-center mt-1">
                            <MaterialIcons name="directions-car" size={14} color="#64748B" />
                            <Text className="text-[12px] text-slate-500 ml-1">Fiat Fiorino • ABC-1234</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ChatScreen")}
                        className="flex-1 bg-blue-500 py-4 rounded-2xl items-center justify-center flex-row shadow-md active:opacity-90"
                    >
                        <MaterialIcons name="phone" size={20} color="white" />
                        <Text className="text-white font-bold text-[15px] ml-2">Ligar para Prestador</Text>
                    </TouchableOpacity>
                </View>

                {/* Cancel Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mt-3 py-3 items-center"
                >
                    <Text className="text-slate-500 font-semibold text-[15px]">Cancelar Serviço</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
