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

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
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
        </Stack.Navigator>
    );
};
