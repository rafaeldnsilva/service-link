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
    // Profile Completion
    ProfileWelcome: undefined;
    RoleSelection: undefined;
    PersonalInfo: undefined;

    // Client Screens (Stack)
    ClientHome: undefined;
    ClientHistory: undefined;
    ClientProfileMenu: undefined;
    ClientInfo: undefined;
    ClientEditProfile: undefined;

    // Service Flow
    AllServices: undefined;
    ProviderProfile: undefined;
    ServiceConfirmation: undefined;
    SearchingProvider: undefined;
    ServiceTracking: undefined;

    // Communication & Review
    ChatScreen: undefined;
    RateProvider: undefined;

    // Settings & Account
    PaymentMethods: undefined;
    Notifications: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
