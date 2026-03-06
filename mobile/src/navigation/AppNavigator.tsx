import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

// Sub-navigators
import { AuthNavigator } from "./AuthNavigator";
import { ClientTabNavigator } from "./ClientTabNavigator";
import { ProviderTabNavigator } from "./ProviderTabNavigator";

// Entry & Dev
import { AuthGateScreen } from "../screens/AuthGateScreen";
import { DevMenuScreen } from "../screens/DevMenuScreen";

// Service flow screens (pushed over tabs)
import {
    ProviderProfileScreen,
    ServiceConfirmationScreen,
    SearchingProviderScreen,
    ServiceTrackingScreen,
    ChatScreen,
    RateProviderScreen,
    ClientInfoScreen,
    ClientEditProfileScreen,
    PaymentMethodsScreen,
    NotificationsScreen,
    ClientAllServicesScreen,
} from "../screens/client";

// Settings screens
import {
    SettingsScreen,
    SecurityScreen,
    AboutScreen,
    SupportScreen,
    AddCardScreen,
} from "../screens/settings";

// Provider overlay screens
import {
    AvailabilityConfigScreen,
    SpecialtyRegistrationScreen,
    DocumentVerificationScreen,
    ServiceAcceptanceScreen,
} from "../screens/provider";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="AuthGate"
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: "#f6f6f8" },
            }}
        >
            {/* ── Entry point ─────────────────────────────────── */}
            <Stack.Screen
                name="AuthGate"
                component={AuthGateScreen}
                options={{ animation: "none" }}
            />

            {/* ── Sub-navigators ───────────────────────────────── */}
            <Stack.Screen
                name="Auth"
                component={AuthNavigator}
                options={{ animation: "fade" }}
            />
            <Stack.Screen
                name="ClientMain"
                component={ClientTabNavigator}
                options={{ animation: "fade", gestureEnabled: false }}
            />
            <Stack.Screen
                name="ProviderMain"
                component={ProviderTabNavigator}
                options={{ animation: "fade", gestureEnabled: false }}
            />

            {/* ── Development only ─────────────────────────────── */}
            {__DEV__ && <Stack.Screen name="DevMenu" component={DevMenuScreen} />}

            {/* ── Service flow (pushed over any tab) ──────────── */}
            <Stack.Screen name="AllServices" component={ClientAllServicesScreen} />
            <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
            <Stack.Screen name="ServiceConfirmation" component={ServiceConfirmationScreen} />
            <Stack.Screen name="SearchingProvider" component={SearchingProviderScreen} />
            <Stack.Screen name="ServiceTracking" component={ServiceTrackingScreen} />

            {/* ── Communication & Review ───────────────────────── */}
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="RateProvider" component={RateProviderScreen} />

            {/* ── Client account screens ───────────────────────── */}
            <Stack.Screen name="ClientInfo" component={ClientInfoScreen} />
            <Stack.Screen name="ClientEditProfile" component={ClientEditProfileScreen} />

            {/* ── Settings & Account ───────────────────────────── */}
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Support" component={SupportScreen} />
            <Stack.Screen name="AddCard" component={AddCardScreen} />

            {/* ── Provider overlay screens ─────────────────────── */}
            <Stack.Screen name="AvailabilityConfig" component={AvailabilityConfigScreen} />
            <Stack.Screen name="SpecialtyRegistration" component={SpecialtyRegistrationScreen} />
            <Stack.Screen name="DocumentVerification" component={DocumentVerificationScreen} />
            <Stack.Screen name="ServiceAcceptance" component={ServiceAcceptanceScreen} />
        </Stack.Navigator>
    );
};
