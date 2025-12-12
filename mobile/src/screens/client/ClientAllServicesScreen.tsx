import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

// Define the navigation prop type for this screen
type ClientAllServicesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ClientAllServices'>;

interface ServiceItemProps {
    icon: string;
    label: string;
    iconSet?: "MaterialIcons" | "FontAwesome5";
    rotateIcon?: boolean;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon, label, iconSet = "MaterialIcons", rotateIcon = false }) => (
    <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-2xl shadow-sm mb-3 border border-gray-50 active:bg-gray-50">
        <View className="mr-4">
            {iconSet === "FontAwesome5" ? (
                <FontAwesome5 name={icon as any} size={24} color="#4C1D95" style={rotateIcon ? { transform: [{ rotate: '90deg' }] } : {}} />
            ) : (
                <MaterialIcons name={icon as any} size={24} color="#4C1D95" style={rotateIcon ? { transform: [{ rotate: '90deg' }] } : {}} />
            )}
        </View>
        <Text className="font-medium text-zinc-800 text-base">{label}</Text>
    </TouchableOpacity>
);

export const ClientAllServicesScreen: React.FC = () => {
    const navigation = useNavigation<ClientAllServicesNavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            <View className="p-4 flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2"
                    >
                        <MaterialIcons name="arrow-back-ios" size={20} color="#71717a" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-zinc-900">Todos os Serviços</Text>
                    <View className="w-10 h-10" />
                </View>

                {/* Search Bar */}
                <View className="relative mb-6">
                    <MaterialIcons name="search" size={24} color="#a1a1aa" style={{ position: 'absolute', left: 16, top: 12, zIndex: 1 }} />
                    <TextInput
                        className="w-full pl-12 pr-4 py-3 bg-zinc-100 rounded-full text-zinc-900 placeholder:text-zinc-400 text-base"
                        placeholder="Qual serviço você precisa?"
                        placeholderTextColor="#a1a1aa"
                    />
                </View>

                {/* Content */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

                    {/* Manutenção Residencial */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold mb-4 text-zinc-900">Manutenção Residencial</Text>
                        <ServiceItem icon="electrical-services" label="Eletricista" />
                        <ServiceItem icon="plumbing" label="Encanador" rotateIcon />
                        <ServiceItem icon="construction" label="Montador" />
                    </View>

                    {/* Tecnologia */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold mb-4 text-zinc-900">Tecnologia</Text>
                        <ServiceItem icon="lan" label="TI & Redes" />
                        <ServiceItem icon="computer" label="Reparo de Computadores" />
                    </View>

                    {/* Serviços Gerais */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold mb-4 text-zinc-900">Serviços Gerais</Text>
                        <ServiceItem icon="cleaning-services" label="Limpeza" />
                        <ServiceItem icon="local-shipping" label="Fretes e Mudanças" />
                        <ServiceItem icon="yard" label="Jardinagem" />
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};
