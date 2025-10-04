import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import ViewBasket from './src/Component/ViewBasket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FlashMessage from 'react-native-flash-message';

function App() {
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  const [unit, setUnit] = useState('');
  

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1,paddingTop:36, }} edges={[ 'left', 'right', 'bottom']}>
       <FlashMessage position="top" />
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


export default App;