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

export const ProviderMainScreen = () => <StubScreen title="Painel do Prestador" />;
export const ProviderHistoryScreen = () => <StubScreen title="Histórico do Prestador" />;
export const ProviderServicesScreen = () => <StubScreen title="Meus Serviços" />;
export const AvailabilityConfigScreen = () => <StubScreen title="Configurar Disponibilidade" />;
export const SpecialtyRegistrationScreen = () => <StubScreen title="Cadastro de Especialidade" />;
export const DocumentVerificationScreen = () => <StubScreen title="Verificação de Documentos" />;
export const ServiceAcceptanceScreen = () => <StubScreen title="Aceitar Serviço" />;
