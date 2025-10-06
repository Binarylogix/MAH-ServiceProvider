import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import VendorStack from './src/navigation/VendorStack';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import store from './src/redux/Store';
function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={['top', 'left', 'right', 'bottom']}
      >
        <Provider store={store}>
          <FlashMessage position="top" />
          <NavigationContainer>
            <VendorStack />
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
