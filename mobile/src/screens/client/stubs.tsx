import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const StubScreen = ({ title }: { title: string }) => {
    const navigation = useNavigation();
    return (
        <SafeAreaView className= "flex-1 items-center justify-center bg-white" >
        <Text className="text-xl font-bold mb-4" > { title } </Text>
            < Text className = "text-gray-500 mb-8" > Em construção...</Text>
                < TouchableOpacity
    onPress = {() => navigation.goBack()}
className = "bg-blue-500 px-6 py-3 rounded-full"
    >
    <Text className="text-white font-bold" > Voltar </Text>
        </TouchableOpacity>
        </SafeAreaView>
  );
};

export const ClientInfoScreen = () => <StubScreen title="Minhas Informações (Visualizar)" />;
export const ProviderProfileScreen = () => <StubScreen title="Perfil do Prestador" />;
export const ServiceConfirmationScreen = () => <StubScreen title="Confirmar Serviço" />;
export const SearchingProviderScreen = () => <StubScreen title="Buscando Prestador..." />;
export const ServiceTrackingScreen = () => <StubScreen title="Acompanhar Serviço" />;
export const ChatScreen = () => <StubScreen title="Chat" />;
export const PaymentMethodsScreen = () => <StubScreen title="Métodos de Pagamento" />;
export const NotificationsScreen = () => <StubScreen title="Notificações" />;
