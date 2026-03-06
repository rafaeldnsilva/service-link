import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";

export const ClientEditProfileScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user, profile } = useAuth();

    const [name, setName] = useState(profile?.full_name ?? "");
    const [phone, setPhone] = useState(profile?.phone ?? "");
    const [avatarUri, setAvatarUri] = useState<string | null>(profile?.avatar_url ?? null);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    useEffect(() => {
        if (profile) {
            setName(profile.full_name ?? "");
            setPhone(profile.phone ?? "");
            setAvatarUri(profile.avatar_url ?? null);
        }
    }, [profile]);

    const handlePickPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para alterar a foto.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled || !result.assets[0]) return;

        setUploadingPhoto(true);
        try {
            const asset = result.assets[0];
            const ext = asset.uri.split(".").pop() ?? "jpg";
            const fileName = `${user!.id}.${ext}`;

            const response = await fetch(asset.uri);
            const blob = await response.blob();

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, blob, { upsert: true, contentType: `image/${ext}` });

            if (uploadError) {
                Alert.alert("Erro", "Não foi possível fazer upload da foto.");
                return;
            }

            const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
            setAvatarUri(urlData.publicUrl);
        } catch {
            Alert.alert("Erro", "Ocorreu um erro ao processar a foto.");
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        if (!name.trim()) {
            Alert.alert("Nome obrigatório", "Por favor, insira seu nome completo.");
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: name.trim(),
                    phone: phone.trim() || null,
                    avatar_url: avatarUri,
                })
                .eq("id", user.id);

            if (error) {
                Alert.alert("Erro", error.message);
            } else {
                Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
                    { text: "OK", onPress: () => navigation.goBack() },
                ]);
            }
        } catch {
            Alert.alert("Erro", "Não foi possível salvar as alterações.");
        } finally {
            setSaving(false);
        }
    };

    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?";

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-white">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center rounded-full active:bg-slate-100"
                >
                    <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text className="text-slate-900 text-lg font-bold flex-1 text-center pr-10">
                    Editar Perfil
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Avatar */}
                <View className="flex-col items-center pt-2 pb-8 px-6">
                    <View className="relative mb-4">
                        <View className="h-32 w-32 rounded-full shadow-lg overflow-hidden bg-primary/20 items-center justify-center">
                            {uploadingPhoto ? (
                                <ActivityIndicator color={colors.primary} />
                            ) : avatarUri ? (
                                <Image source={{ uri: avatarUri }} className="w-full h-full" />
                            ) : (
                                <Text className="text-primary font-bold text-3xl">{initials}</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={handlePickPhoto}
                            disabled={uploadingPhoto}
                            className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full border-4 border-white items-center justify-center shadow-md"
                        >
                            <MaterialIcons name="photo-camera" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handlePickPhoto} disabled={uploadingPhoto}>
                        <Text className="text-blue-600 text-[15px] font-semibold">
                            {uploadingPhoto ? "Enviando..." : "Alterar foto de perfil"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View className="px-6 gap-5">
                    <FormField label="Nome Completo" value={name} onChangeText={setName} placeholder="Seu nome completo" />
                    <FormField
                        label="Telefone"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="(00) 00000-0000"
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Buttons */}
                <View className="px-6 mt-10 gap-3">
                    <TouchableOpacity
                        className="w-full bg-blue-600 py-4 rounded-2xl items-center justify-center active:bg-blue-700"
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-[17px]">Salvar Alterações</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full py-4 items-center justify-center rounded-2xl active:bg-slate-50"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="text-slate-400 font-medium text-[16px]">Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const FormField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
}: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
    keyboardType?: "default" | "phone-pad" | "email-address";
}) => (
    <View>
        <Text className="text-slate-700 text-[15px] font-semibold mb-2">{label}</Text>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType ?? "default"}
            className="w-full bg-white rounded-2xl py-4 px-5 text-[16px] text-slate-900 border border-slate-200"
            placeholderTextColor="#CBD5E1"
        />
    </View>
);
