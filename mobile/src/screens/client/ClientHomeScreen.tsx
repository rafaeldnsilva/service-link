import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions, StatusBar } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";

const { width, height } = Dimensions.get("window");

// Silver/Minimal Map Style
const mapCustomStyle = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#eeeeee" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#e5e5e5" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#dadada" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{ "color": "#e5e5e5" }]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{ "color": "#eeeeee" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#c9c9c9" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    }
];

const CATEGORIES = [
    { id: 1, name: "Eletricista", icon: "bolt" as const },
    { id: 2, name: "TI & Redes", icon: "laptop" as const },
    { id: 3, name: "Encanador", icon: "faucet" as const, iconSet: "FontAwesome5" }, // Using FontAwesome5 for specific icons if needed, or MaterialIcons mapping
    { id: 4, name: "Limpeza", icon: "cleaning-services" as const },
    { id: 5, name: "Montador", icon: "handyman" as const },
    { id: 6, name: "Pintor", icon: "format-paint" as const },
];

const PROVIDERS = [
    { id: 1, lat: -23.550520, lng: -46.633308, type: "bolt" },
    { id: 2, lat: -23.552520, lng: -46.635308, type: "laptop" },
    { id: 3, lat: -23.548520, lng: -46.638308, type: "cleaning-services" },
    { id: 4, lat: -23.555520, lng: -46.630308, type: "handyman" },
];

export const ClientHomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* 1. Background Map */}
            <MapView
                provider={PROVIDER_GOOGLE} // Requires setup, fallback to default if issue
                style={{ width: width, height: height }}
                customMapStyle={mapCustomStyle}
                initialRegion={{
                    latitude: -23.550520,
                    longitude: -46.633308,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
            >
                {/* User Location */}
                <Marker coordinate={{ latitude: -23.550520, longitude: -46.633308 }}>
                    <View className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white items-center justify-center shadow-md">
                        <View className="w-full h-full rounded-full border-4 border-blue-200/50" />
                    </View>
                </Marker>

                {/* Service Providers */}
                {PROVIDERS.map((provider) => (
                    <Marker
                        key={provider.id}
                        coordinate={{ latitude: provider.lat, longitude: provider.lng }}
                    >
                        <View className="bg-white p-2 rounded-full shadow-md items-center justify-center w-10 h-10">
                            <MaterialIcons name={provider.type as any} size={20} color={colors.primary} />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* 2. Floating Header */}
            <SafeAreaView className="absolute top-0 w-full px-5 pt-4">
                <View className="flex-row items-center bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] p-3 px-5 gap-3 h-14 border border-gray-50">
                    <MaterialIcons name="search" size={24} color="#9CA3AF" />
                    <TextInput
                        placeholder="O que você precisa hoje?"
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 text-base text-gray-800 font-medium h-full"
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ClientProfileMenu")}
                        className="w-10 h-10 rounded-full bg-[#fdf8f6] items-center justify-center border border-orange-100"
                    >
                        {/* Avatar Placeholder */}
                        <Image
                            source={{ uri: "https://i.pravatar.cc/300?img=5" }}
                            className="w-full h-full rounded-full"
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* 3. Bottom Sheet Panel */}
            <View className="absolute bottom-0 w-full bg-white rounded-t-[32px] pt-5 pb-8 px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                {/* Handle */}
                <View className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <Text className="text-[19px] font-bold text-gray-900 mb-5 ml-1">Categorias Populares</Text>

                <View className="flex-row flex-wrap gap-3">
                    {CATEGORIES.map((cat) => (
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
