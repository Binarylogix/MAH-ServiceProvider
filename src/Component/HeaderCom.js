import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
// import { useTranslation } from 'react-i18next';
import { images } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HeaderCom = ({ currentLatLong }) => {
  const navigation = useNavigation();
  // const { t } = useTranslation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log('profile data', userData);

  useEffect(() => {
    const fetchUserData = async () => {
      const API_TOKEN = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      // console.log('Fetched token:', userId);
      try {
        const response = await axios.get(
          `https://www.makeahabit.com/api/v1/customer/getCustomerById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          },
        );
        if (response.data) {
          setUserData(response.data.data); // assumes username is at response.data.data.name or similar
        }
      } catch (error) {
        console.log('API Error:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Determine display name
  const displayName = userData?.name || 'Rohit';

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Image
          source={images.logo}
          style={{ width: 92, height: 60, resizeMode: 'contain' }}
        />
        <Image
          source={images.logo2}
          style={{ width: 150, height: 25, resizeMode: 'contain' }}
        />
      </View>

      {/* Search Bar (commented out) */}
    </View>
  );
};

export default HeaderCom;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 45,
    marginTop: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
  },
  locationIcon:{
    width: 16,
    height: 16,
    resizeMode: 'contain',
  }
});
