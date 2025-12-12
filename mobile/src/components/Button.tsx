import React from "react";
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "outline" | "text";
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = "primary",
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const getBaseStyles = (): string => {
        const base = "min-w-[84px] items-center justify-center rounded-full h-14 px-5";

        switch (variant) {
            case "primary":
                return `${base} bg-primary shadow-lg`;
            case "outline":
                return `${base} bg-transparent border border-primary/30`;
            case "text":
                return `${base} bg-transparent`;
            default:
                return base;
        }
    };

    const getTextStyles = (): string => {
        const base = "text-base font-bold tracking-wide";

        switch (variant) {
            case "primary":
                return `${base} text-white`;
            case "outline":
            case "text":
                return `${base} text-primary`;
            default:
                return base;
        }
    };

    return (
        <TouchableOpacity
            className={`${getBaseStyles()} ${disabled ? "opacity-50" : ""}`}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={style}
        >
            {loading ? (
                <ActivityIndicator color={variant === "primary" ? "#fff" : "#2C097F"} />
            ) : (
                <Text className={getTextStyles()} style={textStyle}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};
