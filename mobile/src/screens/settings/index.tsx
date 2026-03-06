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

export const SettingsScreen = () => <StubScreen title="Configurações" />;
export const SecurityScreen = () => <StubScreen title="Segurança" />;
export const AboutScreen = () => <StubScreen title="Sobre" />;
export const SupportScreen = () => <StubScreen title="Suporte" />;
export const AddCardScreen = () => <StubScreen title="Adicionar Cartão" />;
