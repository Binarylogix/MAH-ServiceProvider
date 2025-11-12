import React, { useEffect, useState } from 'react';
import { Text, Alert, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function CurrentLocation() {
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async position => {
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

          if (!res.ok) {
            const text = await res.text();
            console.log('Unexpected response:', text);
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          if (data?.address) {
            const { neighbourhood, suburb, road, city, town, village, state } =
              data.address;

            // 🧭 Construct human-readable location
            const area = neighbourhood || suburb || road || '';
            const cityName = city || town || village || '';
            const stateName = state || '';

            // Combine area + city
            const displayLocation = `${
              area ? area + ', ' : ''
            }${cityName}, ${stateName}`;
            setLocationName(displayLocation.trim());
          } else {
            setLocationName('Location data not found');
          }
        } catch (err) {
          console.log('Location fetch error:', err);
          setLocationName('Unable to determine location');
        }
      },
      error => {
        console.log('Geolocation error:', error);
        Alert.alert('Error', 'Unable to fetch current location.');
        setLocationName('Location unavailable');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  if (!locationName) return <Text>Fetching location...</Text>;

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <MaterialIcons name="location-on" size={14} color="#18A558" />
      <Text
        style={{ color: '#696968', fontSize: 11, justifyContent: 'flex-start' }}
      >
        {locationName}
      </Text>
    </View>
  );
}
