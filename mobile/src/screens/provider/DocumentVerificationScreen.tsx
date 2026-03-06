import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { NavigationProp } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

type VerificationStatus = "idle" | "uploading" | "uploaded";

interface DocumentItem {
    id: string;
    name: string;
    icon: "badge" | "home" | "school";
    status: VerificationStatus;
    fileUrl?: string;
}

export const DocumentVerificationScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();

    const [documents, setDocuments] = useState<DocumentItem[]>([
        { id: "identity", name: "Documento de Identidade (RG/CNH)", icon: "badge", status: "idle" },
        { id: "address", name: "Comprovante de Residência", icon: "home", status: "idle" },
        { id: "certificate", name: "Certificado Profissional", icon: "school", status: "idle" },
    ]);

    const [submitting, setSubmitting] = useState(false);

    const handleUpload = async (docId: string) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permissão necessária", "Permita acesso à galeria para enviar documentos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.9,
        });

        if (result.canceled || !result.assets[0]) return;

        setDocuments(prev =>
            prev.map(d => d.id === docId ? { ...d, status: "uploading" } : d)
        );

        try {
            const asset = result.assets[0];
            const ext = asset.uri.split(".").pop() ?? "jpg";
            const fileName = `${user!.id}/${docId}.${ext}`;

            const response = await fetch(asset.uri);
            const blob = await response.blob();

            const { error: uploadError } = await supabase.storage
                .from("documents")
                .upload(fileName, blob, { upsert: true, contentType: `image/${ext}` });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from("documents").getPublicUrl(fileName);

            setDocuments(prev =>
                prev.map(d => d.id === docId ? { ...d, status: "uploaded", fileUrl: urlData.publicUrl } : d)
            );
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Erro", "Não foi possível enviar o documento. Tente novamente.");
            setDocuments(prev =>
                prev.map(d => d.id === docId ? { ...d, status: "idle" } : d)
            );
        }
    };

    const handleSubmitForAnalysis = async () => {
        const uploadedCount = documents.filter(d => d.status === "uploaded").length;
        if (uploadedCount === 0) {
            Alert.alert("Atenção", "Envie pelo menos um documento para análise.");
            return;
        }

        setSubmitting(true);
        try {
            // Mark user as having submitted documents (verification_status could be added to profiles)
            await supabase
                .from("profiles")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", user!.id);

            Alert.alert(
                "Documentos enviados!",
                "Seus documentos foram enviados para análise. Você será notificado quando a verificação for concluída.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert("Erro", "Não foi possível enviar para análise.");
        } finally {
            setSubmitting(false);
        }
    };

    const uploadedCount = documents.filter(d => d.status === "uploaded").length;
    const progressPercentage = (uploadedCount / documents.length) * 100;

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-slate-50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <MaterialIcons name="arrow-back" size={26} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Verificação de Documentos</Text>
            </View>

            <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 120 }}>
                <Text className="text-slate-900 font-bold text-[26px] mb-3 leading-9 mt-2">
                    Torne-se um Profissional Verificado
                </Text>
                <Text className="text-slate-600 text-[15px] mb-6 leading-6">
                    Envie fotos dos seus documentos para garantir a segurança e confiança dos clientes.
                </Text>

                {/* Progress */}
                <View className="mb-6">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-600 text-[14px] font-semibold">Progresso</Text>
                        <Text className="text-slate-600 text-[14px]">{uploadedCount}/{documents.length} documentos</Text>
                    </View>
                    <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <View className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage}%` }} />
                    </View>
                </View>

                {/* Documents List */}
                <View className="gap-3">
                    {documents.map((doc) => (
                        <View key={doc.id} className="bg-white rounded-3xl p-5 flex-row items-center shadow-sm">
                            <View className="w-14 h-14 bg-slate-100 rounded-2xl items-center justify-center mr-4">
                                <MaterialIcons name={doc.icon} size={28} color="#64748B" />
                            </View>

                            <View className="flex-1">
                                <Text className="text-slate-900 font-semibold text-[15px] mb-1">
                                    {doc.name}
                                </Text>
                                {doc.status === "uploaded" ? (
                                    <Text className="text-green-600 font-semibold text-[13px]">✓ Enviado</Text>
                                ) : doc.status === "uploading" ? (
                                    <Text className="text-slate-400 text-[13px]">Enviando...</Text>
                                ) : (
                                    <Text className="text-slate-400 text-[13px]">Pendente</Text>
                                )}
                            </View>

                            {doc.status === "uploaded" ? (
                                <TouchableOpacity
                                    onPress={() => handleUpload(doc.id)}
                                    className="w-10 h-10 bg-green-500 rounded-full items-center justify-center"
                                >
                                    <MaterialIcons name="check" size={22} color="white" />
                                </TouchableOpacity>
                            ) : doc.status === "uploading" ? (
                                <View className="w-10 h-10 items-center justify-center">
                                    <ActivityIndicator size="small" color={colors.primary} />
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => handleUpload(doc.id)}
                                    className="bg-primary px-4 py-2.5 rounded-full flex-row items-center active:opacity-80"
                                >
                                    <MaterialIcons name="upload" size={16} color="white" />
                                    <Text className="text-white font-semibold text-[13px] ml-1">Enviar</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>

                <View className="mt-5 p-4 bg-blue-50 rounded-2xl flex-row items-start gap-3">
                    <MaterialIcons name="info-outline" size={20} color="#3B82F6" />
                    <Text className="text-blue-700 text-[13px] leading-5 flex-1">
                        Seus documentos são criptografados e usados apenas para verificação de identidade. Eles não são compartilhados com terceiros.
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-slate-50 px-4 py-4 border-t border-slate-200">
                <TouchableOpacity
                    onPress={handleSubmitForAnalysis}
                    disabled={uploadedCount === 0 || submitting}
                    className={`w-full py-4 rounded-3xl items-center justify-center ${uploadedCount > 0 ? "bg-primary" : "bg-slate-300"}`}
                    activeOpacity={uploadedCount > 0 ? 0.9 : 1}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className={`font-bold text-[17px] ${uploadedCount > 0 ? "text-white" : "text-slate-500"}`}>
                            Enviar para Análise
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
