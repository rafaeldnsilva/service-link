import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { ProviderTabParamList } from "../types/navigation";

import { ProviderMainScreen } from "../screens/provider/ProviderMainScreen";
import { ProviderHistoryScreen } from "../screens/provider/ProviderHistoryScreen";
import { ProviderServicesScreen } from "../screens/provider/ProviderServicesScreen";
import { SettingsScreen } from "../screens/settings/SettingsScreen";

const Tab = createBottomTabNavigator<ProviderTabParamList>();

const PRIMARY = "#2C097F";
const INACTIVE = "#94A3B8";
const TAB_BG = "#FFFFFF";

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

const TAB_CONFIG: Record<
    keyof ProviderTabParamList,
    { label: string; icon: MaterialIconName; iconFocused: MaterialIconName }
> = {
    ProviderHome: {
        label: "Início",
        icon: "map",
        iconFocused: "map",
    },
    Bookings: {
        label: "Pedidos",
        icon: "event-note",
        iconFocused: "event-note",
    },
    MyServices: {
        label: "Serviços",
        icon: "build-circle",
        iconFocused: "build-circle",
    },
    ProviderAccount: {
        label: "Conta",
        icon: "person-outline",
        iconFocused: "person",
    },
};

export const ProviderTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="ProviderHome"
            screenOptions={({ route }) => {
                const config = TAB_CONFIG[route.name];
                return {
                    headerShown: false,
                    tabBarIcon: ({ focused, size }) => (
                        <MaterialIcons
                            name={focused ? config.iconFocused : config.icon}
                            size={size}
                            color={focused ? PRIMARY : INACTIVE}
                        />
                    ),
                    tabBarLabel: config.label,
                    tabBarActiveTintColor: PRIMARY,
                    tabBarInactiveTintColor: INACTIVE,
                    tabBarStyle: {
                        backgroundColor: TAB_BG,
                        borderTopWidth: 1,
                        borderTopColor: "#F1F5F9",
                        height: 60,
                        paddingBottom: 8,
                        paddingTop: 6,
                        elevation: 8,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                    },
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: "600",
                    },
                };
            }}
        >
            <Tab.Screen name="ProviderHome" component={ProviderMainScreen} />
            <Tab.Screen name="Bookings" component={ProviderHistoryScreen} />
            <Tab.Screen name="MyServices" component={ProviderServicesScreen} />
            <Tab.Screen name="ProviderAccount" component={SettingsScreen} />
        </Tab.Navigator>
    );
};
