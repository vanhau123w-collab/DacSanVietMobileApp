import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/styles/theme';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
        <PaperProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
