import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { serviceService } from "../../services/supabaseService";
import { SERVICE_CATEGORIES } from "../../constants/categories";

interface Service {
    id: string;
    name: string;
    price: string;
}

export const SpecialtyRegistrationScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();
    const [selectedSpecialty, setSelectedSpecialty] = useState(SERVICE_CATEGORIES[0]?.name ?? "");
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [saving, setSaving] = useState(false);
    const [services, setServices] = useState<Service[]>([
        { id: "1", name: "", price: "" },
    ]);

    const addService = () => {
        const newService: Service = {
            id: Date.now().toString(),
            name: "",
            price: "",
        };
        setServices([...services, newService]);
    };

    const removeService = (id: string) => {
        setServices(services.filter((s) => s.id !== id));
    };

    const updateServiceName = (id: string, name: string) => {
        setServices(services.map((s) => (s.id === id ? { ...s, name } : s)));
    };

    const updateServicePrice = (id: string, price: string) => {
        setServices(services.map((s) => (s.id === id ? { ...s, price } : s)));
    };

    const handleSave = async () => {
        if (!user) return;

        const validServices = services.filter(s => s.name.trim() && s.price.trim());
        if (validServices.length === 0) {
            Alert.alert("Atenção", "Adicione pelo menos um serviço com nome e preço.");
            return;
        }

        setSaving(true);
        try {
            await Promise.all(
                validServices.map(s =>
                    serviceService.createService(user.id, {
                        title: s.name.trim(),
                        description: "",
                        category: selectedSpecialty,
                        price: parseFloat(s.price.replace(",", ".")) || 0,
                    })
                )
            );
            Alert.alert("Sucesso!", "Especialidade e serviços salvos com sucesso.", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar os serviços.");
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
                <Text className="text-xl font-bold text-slate-900">Registro de Especialidade</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Progress */}
                <View className="px-4 mb-6">
                    <Text className="text-slate-600 text-[15px] mb-2">Passo 2 de 4</Text>
                    <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <View className="h-full w-1/2 bg-[#2C097F] rounded-full" />
                    </View>
                </View>

                {/* Área de Atuação */}
                <View className="px-4 mb-8">
                    <Text className="text-slate-900 font-bold text-[24px] mb-4">Área de Atuação</Text>
                    <TouchableOpacity
                        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                        className="bg-white rounded-3xl px-5 py-4 flex-row items-center justify-between border border-slate-200"
                    >
                        <Text className={`text-[17px] ${selectedSpecialty ? "text-slate-900" : "text-slate-400"}`}>
                            {selectedSpecialty || "Selecione sua especialidade"}
                        </Text>
                        <MaterialIcons name={showCategoryPicker ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={28} color="#9CA3AF" />
                    </TouchableOpacity>
                    {showCategoryPicker && (
                        <View className="bg-white rounded-2xl mt-2 border border-slate-100 overflow-hidden shadow-lg">
                            {SERVICE_CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => { setSelectedSpecialty(cat.name); setShowCategoryPicker(false); }}
                                    className={`px-5 py-4 border-b border-slate-50 active:bg-slate-50 ${selectedSpecialty === cat.name ? "bg-purple-50" : ""}`}
                                >
                                    <Text className={`text-[16px] ${selectedSpecialty === cat.name ? "text-primary font-semibold" : "text-slate-700"}`}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Serviços Oferecidos */}
                <View className="px-4 mb-6">
                    <Text className="text-slate-900 font-bold text-[24px] mb-4">
                        Serviços Oferecidos
                    </Text>

                    {services.map((service) => (
                        <View key={service.id} className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
                            <View className="flex-row justify-between items-start mb-4">
                                <Text className="text-slate-600 text-[16px] font-semibold">
                                    Nome do Serviço
                                </Text>
                                <TouchableOpacity onPress={() => removeService(service.id)}>
                                    <MaterialIcons name="delete" size={24} color="#EF4444" />
                                </TouchableOpacity>
                            </View>

                            <View className="bg-slate-50 rounded-2xl px-4 py-4 mb-4 border border-slate-200">
                                <TextInput
                                    value={service.name}
                                    onChangeText={(text) => updateServiceName(service.id, text)}
                                    placeholder="Digite o nome do serviço"
                                    placeholderTextColor="#9CA3AF"
                                    className="text-slate-900 text-[17px]"
                                />
                            </View>

                            <Text className="text-slate-600 text-[16px] font-semibold mb-3">
                                Preço/Hora
                            </Text>

                            <View className="bg-slate-50 rounded-2xl px-4 py-4 border border-slate-200">
                                <TextInput
                                    value={service.price}
                                    onChangeText={(text) => updateServicePrice(service.id, text)}
                                    placeholder="0,00"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="decimal-pad"
                                    className="text-slate-900 text-[17px]"
                                />
                            </View>
                        </View>
                    ))}

                    {/* Add Service Button */}
                    <TouchableOpacity
                        onPress={addService}
                        className="bg-white border-2 border-[#2C097F] rounded-3xl py-4 items-center flex-row justify-center"
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="add" size={24} color="#2C097F" />
                        <Text className="text-[#2C097F] font-bold text-[16px] ml-2">
                            Adicionar Serviço
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-slate-50 px-4 py-4 border-t border-slate-200">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className="w-full bg-[#2C097F] py-4 rounded-3xl items-center justify-center active:opacity-90"
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-[18px]">Salvar e Continuar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
