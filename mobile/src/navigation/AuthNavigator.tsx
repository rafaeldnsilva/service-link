import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";

import {
    WelcomeScreen,
    HowItWorksScreen,
    GetStartedScreen,
} from "../screens/onboarding";

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

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: "#f6f6f8" },
            }}
        >
            {/* Onboarding */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />

            {/* Auth */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
            <Stack.Screen
                name="PasswordSuccess"
                component={PasswordSuccessScreen}
                options={{ gestureEnabled: false }}
            />

            {/* Profile Completion */}
            <Stack.Screen name="ProfileWelcome" component={ProfileWelcomeScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        </Stack.Navigator>
    );
};
