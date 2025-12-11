import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { ActivityIndicator, Platform } from 'react-native';

import StackNavigator from './src/navigation/StackNavigator';
import ToastManager from './src/Component/toast/ToastManager';
import NoInternetScreen from './src/Screens/nointernet/NoInternetScreen';

import store from './src/redux/Store';
import {
  navigationRef,
  navigate,
} from './src/Screens/notificationservice/NavigationService';

function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [checkingConnection, setCheckingConnection] = useState(true);

  // ------------------------------
  // 📌 Handle Notification Tap (Foreground)
  // ------------------------------
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        navigate('Notification');
      }
    });
  }, []);

  // ------------------------------
  // 📌 Handle Notification Tap (Background)
  // ------------------------------
  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        navigate('Notification');
      }
    });
  }, []);

  // ------------------------------
  // 📌 Handle Quit-State Tap from FCM or Notifee
  // ------------------------------
  useEffect(() => {
    async function checkInitialNotification() {
      // 1️⃣ Quit State — Firebase (FCM)
      const remoteMessage = await messaging().getInitialNotification();
      if (remoteMessage?.data?.screen === 'Notification') {
        navigate('Notification');
        return;
      }

      // 2️⃣ Quit State — Notifee
      const initialNotifee = await notifee.getInitialNotification();
      if (initialNotifee?.pressAction?.id === 'default') {
        navigate('Notification');
        return;
      }
    }

    checkInitialNotification();
  }, []);

  // ------------------------------
  // 📌 Internet Connection Check
  // ------------------------------
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setCheckingConnection(false);
    });

    return () => unsubscribe();
  }, []);

  // ------------------------------
  // 📌 FCM Foreground + Background Notification
  // ------------------------------
  useEffect(() => {
    // Create notification channel
    async function setupChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
      });
    }
    setupChannel();

    // 1️⃣ Foreground FCM Notification Handler
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground FCM:', remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
          sound: 'default',
          pressAction: { id: 'default' },
        },
        data: remoteMessage.data,
      });
    });

    // 2️⃣ Background handler (only executes, does not navigate)
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background FCM:', remoteMessage);
    });

    // Request permission for iOS
    if (Platform.OS === 'ios') {
      messaging().requestPermission();
    }

    // Print Token (optional)
    messaging()
      .getToken()
      .then(token => {
        console.log('FCM TOKEN:', token);
      });

    return () => unsubscribeOnMessage();
  }, []);

  // ------------------------------
  // 📌 Loading Screen
  // ------------------------------
  if (checkingConnection) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!isConnected) return <NoInternetScreen />;

  // ------------------------------
  // 📌 Main App
  // ------------------------------
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Provider store={store}>
            <FlashMessage position="top" />
            <NavigationContainer ref={navigationRef}>
              <ToastManager />
              <StackNavigator />
            </NavigationContainer>
          </Provider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
