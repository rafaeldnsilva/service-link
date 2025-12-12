import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const TestScreen: React.FC = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>TEST SCREEN WORKING</Text>
        </View>
    );
};
