// app/_layout.tsx  — Root layout for expo-router
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="topics" />
        <Stack.Screen name="levels" />
        <Stack.Screen name="game" />
        <Stack.Screen name="result" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="parent" />
      </Stack>
    </GestureHandlerRootView>
  );
}
