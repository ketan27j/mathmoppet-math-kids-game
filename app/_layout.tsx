// app/_layout.tsx  — Root layout for expo-router
import { Component, ReactNode } from 'react';
import { Button, DevSettings, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type RootErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  info: string | null;
};

class RootErrorBoundary extends Component<{ children: ReactNode }, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = {
    hasError: false,
    error: null,
    info: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, info: null };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('[RootErrorBoundary] caught render error', {
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo.componentStack,
    });
    this.setState({ info: errorInfo.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
<SafeAreaProvider>
  <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>An unexpected error occurred</Text>
      <Text style={styles.message}>{this.state.error?.message ?? 'Unknown error'}</Text>
      <Text style={styles.stack}>{this.state.info ?? 'No stack available'}</Text>
      <Button title="Reload app" onPress={() => DevSettings.reload()} />
    </View>
  </GestureHandlerRootView>
</SafeAreaProvider>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <RootErrorBoundary>
<SafeAreaProvider>
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
</SafeAreaProvider>
    </RootErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: '700',
  },
  message: {
    marginBottom: 12,
    color: '#333',
  },
  stack: {
    marginBottom: 24,
    color: '#666',
  },
});
