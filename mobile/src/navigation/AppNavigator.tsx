import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

// Onboarding Screens
import {
    WelcomeScreen,
    HowItWorksScreen,
    GetStartedScreen,
} from "../screens/onboarding";

// Auth Screens
import {
    LoginScreen,
    SignUpScreen,
    ForgotPasswordScreen,
    EmailVerificationScreen,
    NewPasswordScreen,
    PasswordSuccessScreen,
} from "../screens/auth";

import {
    ProfileWelcomeScreen,
    RoleSelectionScreen,
    PersonalInfoScreen,
} from "../screens/profile";

import { ClientHomeScreen } from "../screens/client/ClientHomeScreen";
import { ClientHistoryScreen } from "../screens/client/ClientHistoryScreen";
import { ClientProfileScreen } from "../screens/client/ClientProfileScreen";
import { ClientInfoScreen } from "../screens/client/ClientInfoScreen";
import { ClientEditProfileScreen } from "../screens/client/ClientEditProfileScreen";
import { AllServicesScreen } from "../screens/client/AllServicesScreen";
import { ProviderProfileScreen } from "../screens/client/ProviderProfileScreen";
import { ServiceConfirmationScreen } from "../screens/client/ServiceConfirmationScreen";
import { SearchingProviderScreen } from "../screens/client/SearchingProviderScreen";
import { ServiceTrackingScreen } from "../screens/client/ServiceTrackingScreen";
import { ChatScreen } from "../screens/client/ChatScreen";
import { RateProviderScreen } from "../screens/client/RateProviderScreen";
import { PaymentMethodsScreen } from "../screens/client/PaymentMethodsScreen";
import { NotificationsScreen } from "../screens/client/NotificationsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="ClientHome"
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: "#f6f6f8" },
            }}
        >
            {/* Onboarding Flow */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />

            {/* Auth Flow */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen
                name="EmailVerification"
                component={EmailVerificationScreen}
            />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
            <Stack.Screen
                name="PasswordSuccess"
                component={PasswordSuccessScreen}
                options={{ gestureEnabled: false }}
            />

            {/* Profile Completion Flow */}
            <Stack.Screen name="ProfileWelcome" component={ProfileWelcomeScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />

            {/* Main App Flows - Client */}
            <Stack.Screen name="ClientHome" component={ClientHomeScreen} />
            <Stack.Screen name="ClientHistory" component={ClientHistoryScreen} />
            <Stack.Screen name="ClientProfileMenu" component={ClientProfileScreen} />
            <Stack.Screen name="ClientInfo" component={ClientInfoScreen} />
            <Stack.Screen name="ClientEditProfile" component={ClientEditProfileScreen} />

            {/* Service Flow */}
            <Stack.Screen name="AllServices" component={AllServicesScreen} />
            <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
            <Stack.Screen name="ServiceConfirmation" component={ServiceConfirmationScreen} />
            <Stack.Screen name="SearchingProvider" component={SearchingProviderScreen} />
            <Stack.Screen name="ServiceTracking" component={ServiceTrackingScreen} />

            {/* Communication & Review */}
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="RateProvider" component={RateProviderScreen} />

            {/* Settings & Account */}
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
    );
};
