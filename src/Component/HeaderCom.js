import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

import { images } from '../constants';

const HeaderCom = () => {
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
  locationIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});
