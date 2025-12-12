import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";

export const ClientProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();

    React.useEffect(() => {
        console.log("ClientProfileScreen MOUNTED");
    }, []);

    const MENU_GROUP_1 = [
        {
            id: 'info',
            label: 'Minhas Informações',
            icon: 'person',
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
            action: () => navigation.navigate('ClientInfo')
        },
        {
            id: 'history',
            label: 'Histórico de Pedidos',
            icon: 'history',
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
            action: () => navigation.navigate('ClientHistory')
        },
        {
            id: 'payments',
            label: 'Métodos de Pagamento',
            icon: 'credit-card',
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
            action: () => navigation.navigate('PaymentMethods')
        },
    ];

    const MENU_GROUP_2 = [
        {
            id: 'notifications',
            label: 'Notificações',
            icon: 'notifications',
            iconBg: '#FED7AA',
            iconColor: '#F97316',
            badge: true,
            action: () => navigation.navigate('Notifications')
        },
        {
            id: 'settings',
            label: 'Configurações',
            icon: 'settings',
            iconBg: '#F1F5F9',
            iconColor: '#64748B',
            action: () => console.log('Navigate to Settings')
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.textPrimaryLight} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text-primary-light">Meu Perfil</Text>
                <View className="w-6" />
            </View>

            <View className="flex-1 px-5">
                {/* Profile Avatar & Name */}
                <View className="items-center pt-2 pb-4">
                    <View className="relative">
                        <View className="w-28 h-28 rounded-full bg-[#F5D7C8] items-center justify-center overflow-hidden shadow-lg">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/300?img=5" }}
                                className="w-full h-full"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ClientEditProfile')}
                            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-4 border-white shadow-md"
                        >
                            <MaterialIcons name="edit" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xl font-bold text-slate-900 mt-3">Ana Souza</Text>
                    <Text className="text-[14px] text-slate-500 mt-0.5">ana.souza@email.com</Text>
                </View>

                {/* Menu Group 1 */}
                <View className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-3 overflow-hidden">
                    {MENU_GROUP_1.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={item.action}
                            className={`flex-row items-center py-3 px-3.5 active:bg-slate-50 ${index < MENU_GROUP_1.length - 1 ? 'border-b border-slate-100' : ''}`}
                        >
                            <View className="w-11 h-11 rounded-2xl items-center justify-center" style={{ backgroundColor: item.iconBg }}>
                                <MaterialIcons name={item.icon as any} size={22} color={item.iconColor} />
                            </View>
                            <Text className="flex-1 ml-3 text-[15px] font-medium text-slate-800">
                                {item.label}
                            </Text>
                            <MaterialIcons name="chevron-right" size={22} color="#CBD5E1" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Menu Group 2 */}
                <View className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {MENU_GROUP_2.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={item.action}
                            className={`flex-row items-center py-3 px-3.5 active:bg-slate-50 ${index < MENU_GROUP_2.length - 1 ? 'border-b border-slate-100' : ''}`}
                        >
                            <View className="w-11 h-11 rounded-2xl items-center justify-center" style={{ backgroundColor: item.iconBg }}>
                                <MaterialIcons name={item.icon as any} size={22} color={item.iconColor} />
                            </View>
                            <Text className="flex-1 ml-3 text-[15px] font-medium text-slate-800">
                                {item.label}
                            </Text>

                            {item.badge && (
                                <View className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2" />
                            )}

                            <MaterialIcons name="chevron-right" size={22} color="#CBD5E1" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Spacer to push logout down */}
                <View className="flex-1" />

                {/* Logout Button */}
                <TouchableOpacity
                    className="flex-row items-center justify-center py-3 mb-4 rounded-2xl border border-red-200"
                    onPress={() => navigation.navigate("Welcome")}
                >
                    <MaterialIcons name="logout" size={20} color="#EF4444" />
                    <Text className="ml-2 text-red-500 font-bold text-[16px]">Sair</Text>
                </TouchableOpacity>

                <Text className="text-center text-slate-400 text-[12px] pb-4">Versão 2.4.0</Text>
            </View>
        </SafeAreaView>
    );
};
