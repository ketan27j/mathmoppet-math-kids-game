import { Platform } from 'react-native';
import { ExpoRoot } from 'expo-router';

console.log('[App] startup', {
  platform: Platform.OS,
  devMode: global.__DEV__ ?? false,
  timestamp: new Date().toISOString(),
});

const initializeGlobalLogging = () => {
  if (global.ErrorUtils && typeof global.ErrorUtils.setGlobalHandler === 'function') {
    const defaultHandler = global.ErrorUtils.getGlobalHandler?.();

    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.error('[Global Error] uncaught', {
        message: error?.message,
        stack: error?.stack,
        isFatal,
      });

      if (defaultHandler) {
        defaultHandler(error, isFatal);
      }
    });
  } else {
    console.warn('[App] global ErrorUtils not available');
  }

  if (typeof window !== 'undefined') {
    window.onunhandledrejection = (event: PromiseRejectionEvent) => {
      console.error('[Unhandled Promise Rejection]', {
        reason: event.reason,
        timestamp: new Date().toISOString(),
      });
    };
  }
};

initializeGlobalLogging();

export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

export default App;
