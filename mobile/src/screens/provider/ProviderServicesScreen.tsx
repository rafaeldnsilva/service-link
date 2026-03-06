import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { serviceService } from "../../services/supabaseService";
import { Database } from "../../types/supabase";
import { SERVICE_CATEGORIES } from "../../constants/categories";

type Service = Database["public"]["Tables"]["services"]["Row"];

export const ProviderServicesScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // New service form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(SERVICE_CATEGORIES[0]?.name ?? "");
    const [price, setPrice] = useState("");

    useEffect(() => {
        if (user) loadServices();
    }, [user]);

    const loadServices = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await serviceService.getServicesByProvider(user.id);
            setServices(data);
        } catch (error) {
            console.error("Error loading services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = async () => {
        if (!user) return;
        if (!title.trim() || !price.trim()) {
            Alert.alert("Campos obrigatórios", "Preencha o título e o preço do serviço.");
            return;
        }
        const parsedPrice = parseFloat(price.replace(",", "."));
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            Alert.alert("Preço inválido", "Informe um valor numérico válido.");
            return;
        }

        setSaving(true);
        try {
            await serviceService.createService(user.id, {
                title: title.trim(),
                description: description.trim(),
                category,
                price: parsedPrice,
            });
            setShowModal(false);
            setTitle(""); setDescription(""); setPrice("");
            loadServices();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível criar o serviço.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (serviceId: string) => {
        Alert.alert("Excluir serviço", "Tem certeza que deseja excluir este serviço?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await serviceService.deleteService(serviceId);
                        loadServices();
                    } catch {
                        Alert.alert("Erro", "Não foi possível excluir o serviço.");
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-slate-50">
                <Text className="flex-1 text-xl font-bold text-slate-900">Meus Serviços</Text>
                <TouchableOpacity onPress={loadServices}>
                    <MaterialIcons name="refresh" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : services.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                    <MaterialIcons name="build-circle" size={64} color="#d4d4d8" />
                    <Text className="text-slate-500 mt-4 text-center text-[16px]">
                        Você ainda não tem serviços cadastrados
                    </Text>
                    <Text className="text-slate-400 text-center text-[14px] mt-1">
                        Toque no + para adicionar seu primeiro serviço
                    </Text>
                </View>
            ) : (
                <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
                    {services.map((service) => (
                        <View key={service.id} className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1 mr-3">
                                    <Text className="text-slate-900 font-bold text-[18px] mb-1">
                                        {service.title}
                                    </Text>
                                    <Text className="text-slate-400 text-[12px] mb-1">{service.category}</Text>
                                    {service.description ? (
                                        <Text className="text-slate-500 text-[13px] leading-5" numberOfLines={2}>
                                            {service.description}
                                        </Text>
                                    ) : null}
                                </View>
                                <Text className="text-primary font-bold text-[20px]">
                                    R$ {service.price.toFixed(2).replace(".", ",")}
                                </Text>
                            </View>

                            <View className="h-px bg-slate-100 my-3" />

                            <TouchableOpacity
                                onPress={() => handleDelete(service.id)}
                                className="self-start flex-row items-center py-1 active:opacity-60"
                            >
                                <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
                                <Text className="text-red-500 text-[13px] font-medium ml-1">Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* FAB */}
            <TouchableOpacity
                onPress={() => setShowModal(true)}
                className="absolute bottom-6 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg"
                activeOpacity={0.9}
            >
                <MaterialIcons name="add" size={32} color="white" />
            </TouchableOpacity>

            {/* Add Service Modal */}
            <Modal visible={showModal} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setShowModal(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
                    <SafeAreaView className="flex-1 bg-white">
                        <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-100">
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <MaterialIcons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                            <Text className="text-[17px] font-bold text-slate-900">Novo Serviço</Text>
                            <TouchableOpacity onPress={handleAddService} disabled={saving}>
                                {saving ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    <Text className="text-primary font-bold text-[16px]">Salvar</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1 px-4 pt-4">
                            <FormField label="Título *" value={title} onChangeText={setTitle} placeholder="Ex: Instalação elétrica" />
                            <FormField label="Descrição" value={description} onChangeText={setDescription} placeholder="Descreva o serviço..." multiline />
                            <FormField label="Preço (R$) *" value={price} onChangeText={setPrice} placeholder="0,00" keyboardType="decimal-pad" />

                            <Text className="text-slate-700 text-[14px] font-semibold mb-2 mt-1">Categoria *</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                {SERVICE_CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => setCategory(cat.name)}
                                        className={`mr-2 px-4 py-2 rounded-full border ${category === cat.name ? "bg-primary border-primary" : "bg-white border-slate-200"}`}
                                    >
                                        <Text className={`text-[13px] font-semibold ${category === cat.name ? "text-white" : "text-slate-600"}`}>
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </ScrollView>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

const FormField = ({
    label, value, onChangeText, placeholder, keyboardType, multiline,
}: {
    label: string; value: string; onChangeText: (t: string) => void;
    placeholder?: string; keyboardType?: "default" | "decimal-pad" | "phone-pad";
    multiline?: boolean;
}) => (
    <View className="mb-4">
        <Text className="text-slate-700 text-[14px] font-semibold mb-2">{label}</Text>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType ?? "default"}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            className="bg-slate-50 rounded-xl px-4 py-3 text-[15px] text-slate-900 border border-slate-200"
            style={{ textAlignVertical: multiline ? "top" : "center", minHeight: multiline ? 80 : undefined }}
            placeholderTextColor="#CBD5E1"
        />
    </View>
);
