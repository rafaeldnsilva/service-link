import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { NavigationProp } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";

export const ClientInfoScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profile, user } = useAuth();

    const displayName = profile?.full_name ?? "—";
    const displayPhone = profile?.phone ?? "Não informado";
    const displayEmail = user?.email ?? "—";
    const initials = displayName
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-slate-50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-[20px] font-bold text-slate-900">
                    Minhas Informações
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* Profile Avatar */}
                <View className="flex-col items-center pt-4 pb-8">
                    <View className="relative mb-4">
                        <View className="h-36 w-36 rounded-full overflow-hidden bg-primary/20 items-center justify-center">
                            {profile?.avatar_url ? (
                                <Image source={{ uri: profile.avatar_url }} className="w-full h-full" />
                            ) : (
                                <Text className="text-primary font-bold text-4xl">{initials}</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ClientEditProfile")}
                            className="absolute bottom-0 right-0 bg-blue-600 p-3.5 rounded-full border-4 border-white items-center justify-center shadow-lg"
                        >
                            <MaterialIcons name="photo-camera" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("ClientEditProfile")}>
                        <Text className="text-blue-600 text-[16px] font-semibold">Alterar foto de perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* Info Fields */}
                <View className="gap-6">
                    <InfoRow icon="person" label="NOME COMPLETO" value={displayName} />
                    <InfoRow icon="email" label="EMAIL" value={displayEmail} />
                    <InfoRow icon="phone" label="TELEFONE" value={displayPhone} />
                </View>
            </ScrollView>

            {/* Edit Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-slate-50 px-6 py-4">
                <TouchableOpacity
                    onPress={() => navigation.navigate("ClientEditProfile")}
                    className="w-full bg-blue-600 py-4 rounded-3xl items-center justify-center shadow-lg active:opacity-90 flex-row"
                >
                    <MaterialIcons name="edit" size={22} color="white" />
                    <Text className="text-white font-bold text-[18px] ml-2">Editar Informações</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    value: string;
}) => (
    <View>
        <Text className="text-slate-500 text-[13px] font-bold mb-3 uppercase tracking-wide">{label}</Text>
        <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center border border-slate-100">
            <MaterialIcons name={icon} size={24} color="#94A3B8" />
            <Text className="ml-3 text-[17px] text-slate-900 flex-1">{value}</Text>
        </View>
    </View>
);
