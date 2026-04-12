# 🌈 MathMoppet-Math Kids game — Kids Math Adventure App

A colorful, engaging math learning game for kids aged 4–6,
built with **React Native + Expo**.

---

## 📁 Project Structure

```
mathmoppet-math-kids-game/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx             # Root layout, font loading, navigation stack
│   ├── index.tsx               # Home screen  → /
│   ├── topics.tsx              # Topic select → /topics
│   ├── game.tsx                # Game screen  → /game?topic=addition
│   ├── result.tsx              # Result screen → /result
│   └── parent.tsx              # Parent dashboard → /parent
│
├── src/
│   ├── screens/                # React Native screen components
│   │   ├── HomeScreen.tsx
│   │   ├── TopicsScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   └── ParentScreen.tsx
│   │
│   ├── components/             # Reusable UI components
│   │   ├── ClockFace.tsx       # SVG analog clock
│   │   ├── ConfettiView.tsx    # Confetti animation
│   │   ├── MascotLion.tsx      # Animated mascot
│   │   ├── OptionButton.tsx    # Answer button with animations
│   │   └── ProgressBar.tsx     # Animated progress bar
│   │
│   ├── hooks/
│   │   ├── useSound.ts         # Sound + haptics hook
│   │   └── useAnimation.ts     # Reusable Animated helpers
│   │
│   ├── store/
│   │   └── useStore.ts         # Zustand global store + AsyncStorage persistence
│   │
│   ├── utils/
│   │   └── questionGenerator.ts # All question generation logic
│   │
│   └── constants/
│       └── theme.ts            # Colors, fonts, topic metadata
│
├── assets/
│   ├── fonts/
│   │   ├── FredokaOne-Regular.ttf
│   │   ├── Nunito-Regular.ttf
│   │   └── Nunito-Bold.ttf
│   ├── sounds/
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   ├── win.mp3
│   │   └── click.mp3
│   ├── icon.png                # App icon (1024×1024)
│   ├── splash.png              # Splash screen
│   └── adaptive-icon.png       # Android adaptive icon
│
├── app.json                    # Expo config
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for builds): `npm install -g eas-cli`

### 1. Install dependencies
```bash
cd mathmoppet-math-kids-game
npm install
```

### 2. Add fonts
Download from Google Fonts and place in `assets/fonts/`:
- [Fredoka One](https://fonts.google.com/specimen/Fredoka+One)
- [Nunito](https://fonts.google.com/specimen/Nunito)

### 3. Add sounds (optional for dev)
Place `.mp3` files in `assets/sounds/`:
- `correct.mp3` — happy upbeat chime
- `wrong.mp3`   — soft low tone
- `win.mp3`     — victory fanfare
- `click.mp3`   — soft tap

Free sounds: [freesound.org](https://freesound.org) or [mixkit.co](https://mixkit.co/free-sound-effects/)

### 4. Run the app
```bash
npx expo start          # Opens Expo Dev Tools
npx expo start --ios    # iOS simulator
npx expo start --android # Android emulator
```

Scan QR code with **Expo Go** app to test on real device instantly.

---

## 🎮 Game Topics

| Topic          | Ages  | Range               |
|---------------|-------|---------------------|
| Counting       | 4–5   | 1–10 objects        |
| Addition       | 4–6   | 1+1 to 9+9          |
| Subtraction    | 5–6   | 3–12 range          |
| Multiplication | 6+    | 1×1 to 5×5          |
| Division       | 6+    | Even division only  |
| Shapes         | 4–5   | 6 basic shapes      |
| Patterns       | 4–6   | AB, AAB, ABB types  |
| Time           | 5–6   | O'clock + half past |

---

## 🏗️ Building for Stores

### Setup EAS
```bash
eas login
eas build:configure
```

### Build for Android (APK/AAB)
```bash
eas build --platform android --profile production
```

### Build for iOS (IPA)
```bash
eas build --platform ios --profile production
```

### Submit to stores
```bash
eas submit --platform android
eas submit --platform ios
```

---

## 📦 Key Dependencies

| Package                    | Purpose                          |
|---------------------------|----------------------------------|
| `expo`                    | Core framework                   |
| `expo-router`             | File-based navigation            |
| `expo-av`                 | Audio playback                   |
| `expo-haptics`            | Tactile feedback                 |
| `expo-linear-gradient`    | Background gradients             |
| `expo-font`               | Custom font loading              |
| `react-native-svg`        | SVG clock face                   |
| `react-native-reanimated` | Smooth animations                |
| `zustand`                 | Global state management          |
| `@react-native-async-storage/async-storage` | Persist progress |
| `lottie-react-native`     | Lottie animations (mascot/win)   |

---

## 🎨 Design System

**Primary Font:** Fredoka One (headings, buttons)
**Body Font:** Nunito (descriptions, hints)

**Brand Colors:**
- Sky: `#87CEEB` · Grass: `#6BCB77` · Sun: `#FFD93D`
- Primary: `#FF6B35` · Pink: `#EC4899` · Purple: `#A855F7`

---

## 👨‍👩‍👧 Parental Dashboard (PIN: 1234)

- Session overview (stars, accuracy, games)
- Per-topic performance bars
- 9 unlockable achievements
- Settings: sound, music, confetti, timed mode, question count
- Progress reset

---

## 🔜 Suggested Next Features

- [ ] Leaderboard with family names
- [ ] Daily challenge mode
- [ ] Lottie animations for mascot reactions
- [ ] Firebase Auth for multi-child profiles
- [ ] RevenueCat for premium subscription
- [ ] Adaptive difficulty (ML-based)
- [ ] Offline-first with full sync
- [ ] AR number recognition (camera)
