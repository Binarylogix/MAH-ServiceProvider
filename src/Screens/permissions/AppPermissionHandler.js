import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  openSettings,
  checkNotifications,
  requestNotifications,
  PERMISSIONS,
  RESULTS,
  request,
} from 'react-native-permissions';

export default function AppPermissionHandler() {
  useEffect(() => {
    requestAppPermissionsOnce();
  }, []);

  // ✅ Ask permissions only the first time
  const requestAppPermissionsOnce = async () => {
    try {
      const permissionAsked = await AsyncStorage.getItem('permissionAsked');
      if (permissionAsked) return; // already asked before

      if (Platform.OS === 'android') {
        await requestAndroidPermissions();
      } else if (Platform.OS === 'ios') {
        await requestIOSPermissions();
      }

      await AsyncStorage.setItem('permissionAsked', 'true');
    } catch (error) {
      console.warn('Permission check failed:', error);
    }
  };

  // 📱 Android — request only Location + Notification permissions
  const requestAndroidPermissions = async () => {
    try {
      const permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
      const granted = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED,
      );

      // ✅ Request notification permission
      if (Platform.Version >= 33) {
        const { status: notifStatus } = await requestNotifications([
          'alert',
          'badge',
          'sound',
        ]);
        if (notifStatus !== 'granted') {
          Alert.alert(
            'Notification Permission',
            'Please enable notifications to stay updated.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ],
          );
        }
      } else {
        const { status } = await checkNotifications();
        if (status !== 'granted') {
          Alert.alert(
            'Notifications Disabled',
            'Please enable notifications from settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ],
          );
        }
      }

      if (!allGranted) {
        Alert.alert(
          'Location Required',
          'Please allow location access for better experience.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ],
        );
      }
    } catch (err) {
      console.warn('Android permission request failed:', err);
    }
  };

  // 🍎 iOS — request only Location + Notification permissions
  const requestIOSPermissions = async () => {
    try {
      const locationResult = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );

      const { status: notifStatus } = await requestNotifications([
        'alert',
        'badge',
        'sound',
      ]);

      if (
        (locationResult !== RESULTS.GRANTED &&
          locationResult !== RESULTS.LIMITED) ||
        notifStatus !== 'granted'
      ) {
        Alert.alert(
          'Permissions Needed',
          'Please enable Location and Notifications from Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ],
        );
      }
    } catch (err) {
      console.warn('iOS permission request failed:', err);
    }
  };

  return null;
}
