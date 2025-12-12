import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    // Onboarding
    Welcome: undefined;
    HowItWorks: undefined;
    GetStarted: undefined;

    // Auth
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    EmailVerification: { email: string };
    NewPassword: { token?: string };
    PasswordSuccess: undefined;

    // Main App (future)
    Home: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
