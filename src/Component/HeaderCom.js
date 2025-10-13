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
          style={{ width: 92, height: 50, resizeMode: 'cover' }}
        />
        <Image
          source={images.logo2}
          style={{ width: 150, height: 25, resizeMode: 'cover' }}
        />
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
