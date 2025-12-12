import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    TextInputProps,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
    isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    isPassword = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className="w-full">
            {label && (
                <Text className="text-sm font-medium text-slate-700 mb-1">{label}</Text>
            )}
            <View
                className={`flex-row items-center bg-white border rounded-full shadow-sm ${isFocused
                        ? "border-primary ring-2 ring-primary/20"
                        : error
                            ? "border-error"
                            : "border-slate-300"
                    }`}
            >
                {leftIcon && (
                    <View className="pl-4">
                        <MaterialCommunityIcons
                            name={leftIcon}
                            size={24}
                            color="#8A8A8E"
                        />
                    </View>
                )}
                <TextInput
                    className={`flex-1 h-14 px-4 text-base text-slate-900 ${leftIcon ? "pl-2" : ""
                        }`}
                    placeholderTextColor="#8A8A8E"
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="pr-4"
                    >
                        <MaterialCommunityIcons
                            name={showPassword ? "eye" : "eye-off"}
                            size={24}
                            color="#8A8A8E"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text className="text-sm text-error mt-1">{error}</Text>
            )}
        </View>
    );
};
