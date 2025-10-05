import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import BorderCom from './BorderCom';
import { useTranslation } from 'react-i18next';
import { images } from '../constants';

const { width, height } = Dimensions.get('window');

const HeaderCom = ({ userName = 'Rohit', currentLatLong }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

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

      {/* Greeting + Location + Notification */}
      <View style={styles.topRow}>
        <View style={styles.greetingContainer}>
          <Text style={styles.name}>Hi, {userName}</Text>
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => {
              if (currentLatLong?.lat && currentLatLong?.lng) {
                const url = `https://www.google.com/maps?q=${currentLatLong.lat},${currentLatLong.lng}`;
                Linking.openURL(url).catch(err =>
                  console.error('An error occurred', err),
                );
              }
            }}
          >
            <Ionicons name="location-sharp" size={18} color="#4CAF50" />
            <Text style={styles.locationText}>Bhopal, MP</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => navigation.navigate('Notification')}
        >
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

  
      {/* Search Bar */}
      {/* <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search Anything..."
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View> */}
    </View>
  );
};

export default HeaderCom;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    paddingTop: 10,
    paddingBottom: 5,
  },
  topRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  motorbike: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginHorizontal: 8,
  },
  deliveryContainer: {
    flexDirection: 'column',
  },
  deliveryText: {
    fontSize: 13,
    color: '#888',
  },
  deliveryTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
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
});
