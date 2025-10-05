// src/components/AppPermissionHandler.js
import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

export default function AppPermissionHandler() {
  useEffect(() => {
    requestAppPermissionsOnce();
  }, []);

  // ✅ Ask permissions only first time
  const requestAppPermissionsOnce = async () => {
    try {
      const permissionAsked = await AsyncStorage.getItem('permissionAsked');
      if (permissionAsked) return; // already asked before

      if (Platform.OS === 'android') {
        await requestAndroidPermissions();
      } else if (Platform.OS === 'ios') {
        await requestIOSPermissions();
      }

      // Mark as done
      await AsyncStorage.setItem('permissionAsked', 'true');
    } catch (error) {
      console.warn('Permission check failed:', error);
    }
  };

  // 📱 Android Permissions
  const requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (!allGranted) {
        Alert.alert(
          'Permissions Required',
          'Some permissions were denied. Please allow access from app settings for full functionality.',
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

  // 🍎 iOS Permissions
  const requestIOSPermissions = async () => {
    try {
      const results = await Promise.all([
        request(PERMISSIONS.IOS.PHOTO_LIBRARY),
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE),
      ]);

      const denied = results.some(
        result => result !== RESULTS.GRANTED && result !== RESULTS.LIMITED,
      );

      if (denied) {
        Alert.alert(
          'Permissions Required',
          'Please enable photo and location permissions from Settings.',
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
