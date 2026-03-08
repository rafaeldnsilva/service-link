import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { ClientTabParamList } from "../types/navigation";
import { useAuth } from "../context/AuthContext";
import { messageService } from "../services/messageService";

import { ClientHomeScreen } from "../screens/client/ClientHomeScreen";
import { ClientAllServicesScreen } from "../screens/client/ClientAllServicesScreen";
import { ClientHistoryScreen } from "../screens/client/ClientHistoryScreen";
import { ClientProfileScreen } from "../screens/client/ClientProfileScreen";

const Tab = createBottomTabNavigator<ClientTabParamList>();

const PRIMARY = "#2C097F";
const INACTIVE = "#94A3B8";
const TAB_BG = "#FFFFFF";

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

const TAB_CONFIG: Record<
    keyof ClientTabParamList,
    { label: string; icon: MaterialIconName; iconFocused: MaterialIconName }
> = {
    Home: {
        label: "Início",
        icon: "home",
        iconFocused: "home",
    },
    Services: {
        label: "Serviços",
        icon: "search",
        iconFocused: "search",
    },
    History: {
        label: "Histórico",
        icon: "history",
        iconFocused: "history",
    },
    Profile: {
        label: "Perfil",
        icon: "person-outline",
        iconFocused: "person",
    },
};

export const ClientTabNavigator: React.FC = () => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        const fetch = () => {
            messageService.getUnreadCount(user.id).then(setUnreadCount).catch(() => {});
        };
        fetch();
        const interval = setInterval(fetch, 30_000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <Tab.Navigator
            initialRouteName="Home"
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
            <Tab.Screen name="Home" component={ClientHomeScreen} />
            <Tab.Screen name="Services" component={ClientAllServicesScreen} />
            <Tab.Screen
                name="History"
                component={ClientHistoryScreen}
                options={{ tabBarBadge: unreadCount > 0 ? unreadCount : undefined }}
            />
            <Tab.Screen name="Profile" component={ClientProfileScreen} />
        </Tab.Navigator>
    );
};
