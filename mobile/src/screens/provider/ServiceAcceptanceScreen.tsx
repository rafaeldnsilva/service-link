import React from "react";
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";

export const ServiceAcceptanceScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const providerLocation = { latitude: -23.5505, longitude: -46.6333 };
    const clientLocation = { latitude: -23.5605, longitude: -46.6433 };

    const handleCall = () => {
        Linking.openURL("tel:+5511999999999");
    };

    const handleMessage = () => {
        navigation.navigate("ChatScreen", {});
    };

    const handleArrived = () => {
        // TODO: Update booking status to in_progress or completed
    };

    return (
        <View className="flex-1">
            <StatusBar barStyle="dark-content" />

            {/* Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    latitude: (providerLocation.latitude + clientLocation.latitude) / 2,
                    longitude: (providerLocation.longitude + clientLocation.longitude) / 2,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
                customMapStyle={[
                    {
                        elementType: "geometry",
                        stylers: [{ color: "#5F9EA0" }],
                    },
                    {
                        elementType: "geometry.fill",
                        stylers: [{ color: "#6FA8AA" }],
                    },
                    {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#4A90A4" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{ color: "#8EBFC2" }],
                    },
                ]}
            >
                {/* Route Line */}
                <Polyline
                    coordinates={[providerLocation, clientLocation]}
                    strokeColor="#2563EB"
                    strokeWidth={4}
                />

                {/* Provider Marker */}
                <Marker coordinate={providerLocation}>
                    <View className="items-center">
                        <View className="w-12 h-12 bg-red-500 rounded-full items-center justify-center border-4 border-white shadow-lg">
                            <MaterialIcons name="location-on" size={28} color="white" />
                        </View>
                    </View>
                </Marker>

                {/* Client Marker */}
                <Marker coordinate={clientLocation}>
                    <View className="items-center">
                        <View className="w-10 h-10 bg-red-500 rounded-full border-4 border-white shadow-lg" />
                    </View>
                </Marker>
            </MapView>

            <SafeAreaView className="flex-1" edges={["top"]}>
                {/* ETA Card */}
                <View className="mx-4 mt-4">
                    <View className="bg-white rounded-full py-4 px-6 items-center shadow-lg">
                        <Text className="text-slate-600 text-[13px] font-medium tracking-wider">
                            CHEGADA EM
                        </Text>
                        <Text className="text-slate-900 font-bold text-[28px] -mt-1">14 min</Text>
                    </View>
                </View>
            </SafeAreaView>

            {/* Bottom Section */}
            <SafeAreaView className="absolute bottom-0 left-0 right-0" edges={["bottom"]}>
                <View className="px-4 pb-4">
                    {/* Client Info Card */}
                    <View className="bg-white rounded-3xl p-5 mb-3 shadow-xl">
                        <View className="flex-row items-center mb-4">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/300?img=12" }}
                                className="w-14 h-14 rounded-full mr-4"
                            />
                            <View className="flex-1">
                                <Text className="text-slate-900 font-bold text-[19px] mb-1">
                                    Carlos Silva
                                </Text>
                                <Text className="text-slate-600 text-[15px]">Manutenção de PC</Text>
                            </View>
                        </View>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleCall}
                                className="flex-1 bg-blue-50 py-3 rounded-2xl flex-row items-center justify-center active:bg-blue-100"
                            >
                                <MaterialIcons name="phone" size={20} color="#3B82F6" />
                                <Text className="text-blue-600 font-semibold text-[15px] ml-2">
                                    Ligar para Cli...
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleMessage}
                                className="flex-1 bg-blue-50 py-3 rounded-2xl flex-row items-center justify-center active:bg-blue-100"
                            >
                                <MaterialIcons name="message" size={20} color="#3B82F6" />
                                <Text className="text-blue-600 font-semibold text-[15px] ml-2">
                                    Enviar Mens...
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Arrived Button */}
                    <TouchableOpacity
                        onPress={handleArrived}
                        className="bg-[#10B981] py-4 rounded-3xl items-center justify-center active:opacity-90 shadow-lg"
                    >
                        <Text className="text-white font-bold text-[18px]">Cheguei ao Local</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};
