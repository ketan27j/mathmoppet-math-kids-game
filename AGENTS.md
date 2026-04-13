# AGENTS.md - MathMoppet Math Kids Game

## Run Commands
- `npx expo start` - Start dev server
- `npx expo start --android` - Run on Android emulator
- `npx expo start --ios` - Run on iOS simulator
- `npx expo start --web` - Run web version

## Build Commands
- `eas build --platform android` - Build Android APK/AAB
- `eas build --platform ios` - Build iOS IPA
- Requires EAS CLI: `npm install -g eas-cli`

## Architecture
- **Routing**: Expo Router (file-based) in `app/` directory
- **State**: Zustand store at `src/store/useStore.ts` with AsyncStorage persistence
- **Storage key**: `@mathmoppet_stats_v3` (persisted in finishGame and resetProgress)

## Key Conventions
- Screen components in `app/` directory (e.g., `app/game.tsx` → `/game`)
- Reusable components in `src/components/`
- Parental PIN: `1234` (hardcoded in ParentScreen)
- Topics defined in `src/constants/theme.ts`

## Missing from package.json (no scripts)
- No lint, typecheck, or test scripts
- No pre-commit hooks
- Build only via EAS (no local gradle/xcodebuild)

## Dependencies to know
- `expo-router` - navigation
- `expo-av` - audio playback
- `react-native-reanimated` - animations (requires babel plugin)
- `zustand` - state management
- `lottie-react-native` - mascot/win animations