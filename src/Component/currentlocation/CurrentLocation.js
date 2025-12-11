import React, { useEffect, useState } from 'react';
import { Text, Alert, View, TouchableOpacity, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Feather from 'react-native-vector-icons/Feather';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

export default function CurrentLocation() {
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Platform-specific permissions
  const LOCATION_PERMISSION = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  });

  const checkLocationPermission = async () => {
    try {
      const status = await check(LOCATION_PERMISSION);

      if (status === RESULTS.GRANTED) {
        return true;
      }

      if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
        return false;
      }

      // Request permission
      const result = await request(LOCATION_PERMISSION);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const openLocationSettings = () => {
    Alert.alert(
      'Location Access Required',
      'Enable location services to find nearby businesses',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openSettings() },
      ],
    );
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);

    // Check permission first (both platforms)
    const hasPermission = await checkLocationPermission();

    if (!hasPermission) {
      setLocationName('Location permission needed');
      setIsLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        console.log('✅ Location:', position.coords);
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'makeahabit/1.0 (makeahabit@support.com)',
                Referer: 'https://www.makeahabit.com',
              },
            },
          );

          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const data = await res.json();
          if (data?.address) {
            const { neighbourhood, suburb, road, city, town, village, state } =
              data.address;
            const area = neighbourhood || suburb || road || '';
            const cityName = city || town || village || '';
            const stateName = state || '';

            const displayLocation = `${
              area ? area + ', ' : ''
            }${cityName}, ${stateName}`.trim();
            setLocationName(displayLocation);
          } else {
            setLocationName('Location data not found');
          }
        } catch (err) {
          console.log('Reverse geocoding error:', err);
          setLocationName('Unable to determine location');
        }
        setIsLoading(false);
      },
      error => {
        console.log('Geolocation error:', error.code, error.message);
        setIsLoading(false);

        if (error.code === 1) {
          setLocationName('Location permission needed');
        } else {
          setLocationName('Location unavailable');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Loading
  if (isLoading) {
    return (
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <Feather name="map-pin" size={14} color="#18A558" />
        <Text style={{ color: '#696968', fontSize: 11, marginLeft: 4 }}>
          Fetching location...
        </Text>
      </View>
    );
  }

  // Permission needed - tappable red icon
  if (locationName === 'Location permission needed') {
    return (
      <TouchableOpacity onPress={openLocationSettings} activeOpacity={0.7}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Feather name="map-pin" size={14} color="#ff7d7d" />
        </View>
      </TouchableOpacity>
    );
  }

  // Success/Error - show location
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
      <Feather name="map-pin" size={12} color="#090909" />
      <Text style={{ color: '#696968', fontSize: 11, marginLeft: 2 }}>
        {locationName}
      </Text>
    </View>
  );
}
