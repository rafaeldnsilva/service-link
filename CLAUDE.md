# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ServiceLink is a React Native mobile marketplace application connecting clients to service professionals (electricians, technicians, delivery workers, etc.). Built with Expo and TypeScript, using NativeWind (Tailwind CSS) for styling and React Navigation for routing.

## Development Commands

**Working Directory**: All commands must be run from the `mobile/` directory.

### Running the App
```bash
cd mobile
npm install          # Install dependencies
npx expo start       # Start development server
npm run android      # Launch on Android emulator
npm run ios          # Launch on iOS simulator (macOS only)
npm run web          # Launch web version
```

### Development Workflow
- Use `npx expo start` and press `a` (Android), `i` (iOS), or `w` (Web) to launch
- Scan QR code with Expo Go app for testing on physical devices
- The app uses Expo's new architecture (`newArchEnabled: true`)

## Architecture

### Navigation Structure

The app uses a **single native stack navigator** (`AppNavigator`) with three main flows:

1. **Onboarding Flow**: Welcome → HowItWorks → GetStarted
2. **Auth Flow**: Login/SignUp → Password Recovery (ForgotPassword → EmailVerification → NewPassword → PasswordSuccess)
3. **Profile Completion Flow**: ProfileWelcome → RoleSelection → PersonalInfo
4. **Main App Flows**: Client screens (ClientHome, ClientHistory, ClientProfileMenu, ClientEditProfile)

**Important Navigation Details**:
- Initial route is currently set to `ClientHome` (see `AppNavigator.tsx:38`)
- All navigation types are defined in `src/types/navigation.ts` via `RootStackParamList`
- Use the `NavigationProp` type for typed navigation: `useNavigation<NavigationProp>()`
- Routes pass parameters via type-safe param lists (e.g., `EmailVerification: { email: string }`)

### Directory Structure

```
mobile/src/
├── screens/           # Screen components organized by flow
│   ├── onboarding/    # Welcome, HowItWorks, GetStarted
│   ├── auth/          # Login, SignUp, password recovery screens
│   ├── profile/       # Profile completion flow (ProfileWelcome, RoleSelection, PersonalInfo)
│   └── client/        # Client app screens (Home, History, Profile, EditProfile)
├── components/        # Reusable UI components (Button, Input)
├── navigation/        # AppNavigator - single native stack for all flows
├── theme/             # Design system (colors.ts with primary, background, status colors)
└── types/             # TypeScript type definitions (navigation.ts)
```

### Styling System

The project uses **NativeWind** (Tailwind CSS for React Native) with custom theme extensions:

- **Primary Color**: `#2C097F` (deep purple) - use `bg-primary` or `text-primary`
- **Backgrounds**: `#f6f6f8` (light) / `#151022` (dark)
- **Status Colors**: `#34C759` (success) / `#FF3B30` (error)
- **Custom Tailwind config**: `mobile/tailwind.config.js` extends colors, fonts, and border radius
- **Theme exports**: `src/theme/colors.ts` also exports spacing and borderRadius constants for imperative use

**Styling Guidelines**:
- Prefer NativeWind utility classes (e.g., `className="bg-primary px-4 py-3 rounded-2xl"`)
- Use theme colors via Tailwind (`bg-primary`, `text-success`, `bg-background-light`)
- Import `colors`, `spacing`, or `borderRadius` from `src/theme/colors` only when needed for imperative styling
- NativeWind config is in `mobile/tailwind.config.js` and loaded via `global.css`

### Reusable Components

**Button** (`src/components/Button.tsx`):
- Variants: `primary` (default purple), `secondary` (gray), `ghost` (transparent)
- Props: `variant`, `onPress`, `disabled`, `children`
- Example: `<Button variant="primary" onPress={handleLogin}>Login</Button>`

**Input** (`src/components/Input.tsx`):
- Supports label, placeholder, secureTextEntry, error states, icons
- Props: `label`, `placeholder`, `value`, `onChangeText`, `secureTextEntry`, `error`, `leftIcon`, `rightIcon`
- Example: `<Input label="Email" placeholder="john@example.com" value={email} onChangeText={setEmail} />`

## Key Technical Details

### React Navigation Setup
- `NavigationContainer` wraps the entire app in `App.tsx`
- Uses `SafeAreaProvider` from `react-native-safe-area-context`
- All screens use `headerShown: false` for custom headers
- Default animation is `slide_from_right`

### Platform-Specific Code
- React Native Maps configured for Android (requires Google Maps API key in `app.json`)
- Web-specific screen variants available (e.g., `ClientHomeScreen.web.tsx`)
- Use `.web.tsx` extension for web-specific implementations

### TypeScript
- Strict typing for navigation props via `RootStackParamList`
- Global type augmentation in `src/types/navigation.ts` enables type-safe `useNavigation()` without generics

### Configuration Files
- **app.json**: Expo configuration, splash screen, icons, platform-specific settings
- **babel.config.js**: Configured for NativeWind with `babel-preset-expo`
- **metro.config.js**: Metro bundler configuration
- **tsconfig.json**: TypeScript compiler options

## Current Implementation Status

**Completed**:
- ✅ Onboarding flow (3 screens)
- ✅ Auth flow (Login, SignUp, password recovery - 6 screens total)
- ✅ Profile completion flow (ProfileWelcome, RoleSelection, PersonalInfo)
- ✅ Client main screens (Home, History, Profile menu, Edit Profile)
- ✅ Reusable components (Button, Input)
- ✅ Design system and theming

**Future Screens** (declared in navigation types but not implemented):
- `ClientPayments`
- `ClientNotifications`
- Professional/provider screens (not yet in navigation)

## Design Assets

The repository includes design mockups in separate directories:
- `design-login-apresentacao/`: Login and presentation screen designs
- `design-telas-clientes/`: Client screen designs
- `design-telas-completar-perfil/`: Profile completion screen designs

Reference these when implementing UI screens to match the intended design.

## Important Notes

- **All work happens in `mobile/` directory** - this is where package.json, source code, and configuration live
- **NativeWind**: Use Tailwind utility classes, not inline styles or StyleSheet
- **Navigation**: Single stack navigator manages all flows; avoid creating nested navigators unless explicitly required
- **Testing on Device**: Use Expo Go app or build development clients for full native feature testing
- **API Keys**: Google Maps API key placeholder in `app.json` needs replacement for production use
