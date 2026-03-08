import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";

// ─── Auth flow (onboarding + login + profile completion) ─────────────────────
export type AuthStackParamList = {
    Welcome: undefined;
    HowItWorks: undefined;
    GetStarted: undefined;
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    EmailVerification: { email: string };
    NewPassword: { token?: string };
    PasswordSuccess: undefined;
    ProfileWelcome: undefined;
    RoleSelection: undefined;
    PersonalInfo: undefined;
};

// ─── Client bottom tabs ────────────────────────────────────────────────────────
export type ClientTabParamList = {
    Home: undefined;
    Services: undefined;
    History: undefined;
    Profile: undefined;
};

// ─── Provider bottom tabs ─────────────────────────────────────────────────────
export type ProviderTabParamList = {
    ProviderHome: undefined;
    Bookings: undefined;
    MyServices: undefined;
    ProviderAccount: undefined;
};

// ─── Root stack — orchestrates sub-navigators + modal/overlay screens ─────────
// NOTE: This type also includes all nested screen names so that useNavigation<NavigationProp>()
// works correctly from any screen in the tree (React Navigation global type augmentation requirement).
export type RootStackParamList = {
    // Entry
    AuthGate: undefined;
    DevMenu: undefined;

    // Sub-navigators (rendered as screens in root stack)
    Auth: undefined;
    ClientMain: undefined;
    ProviderMain: undefined;

    // Auth flow screens (inside AuthNavigator, listed here for cross-navigator navigation type safety)
    Welcome: undefined;
    HowItWorks: undefined;
    GetStarted: undefined;
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    EmailVerification: { email: string };
    NewPassword: { token?: string };
    PasswordSuccess: undefined;
    ProfileWelcome: undefined;
    RoleSelection: undefined;
    PersonalInfo: undefined;

    // Service flow (pushed over tabs)
    AllServices: undefined;
    ProviderProfile: { providerId: string };
    ServiceConfirmation: { serviceId: string; providerId: string; serviceTitle: string; price: number };
    SearchingProvider: { bookingId?: string };
    ServiceTracking: { bookingId?: string; providerId?: string };

    // Communication & Review
    ChatScreen: { bookingId?: string; providerId?: string };
    RateProvider: { bookingId: string; providerId: string };

    // Client account screens (tab aliases kept for backward compat navigation calls)
    ClientHistory: undefined;
    ClientProfileMenu: undefined;
    ClientInfo: undefined;
    ClientEditProfile: undefined;

    // Settings & account
    PaymentMethods: undefined;
    Notifications: undefined;
    Settings: undefined;
    Security: undefined;
    About: undefined;
    Support: undefined;
    AddCard: undefined;

    // Provider-specific overlay screens
    AvailabilityConfig: undefined;
    SpecialtyRegistration: undefined;
    DocumentVerification: undefined;
    ServiceAcceptance: undefined;
};

// ─── Navigation prop types ────────────────────────────────────────────────────

/** General-purpose navigation prop (root stack) — used by most screens */
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Navigation prop for screens inside the Client tab navigator */
export type ClientTabNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<ClientTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
>;

/** Navigation prop for screens inside the Provider tab navigator */
export type ProviderTabNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<ProviderTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
>;

// ─── Global type augmentation (enables type-safe useNavigation without generics) ─
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
