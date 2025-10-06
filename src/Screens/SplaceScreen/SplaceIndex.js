import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';

export default function SplaceIndex({ navigation }) {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.replace('RootScreen');
  //     // navigation.replace('VendorTab');
  //     // navigation.replace('VendorRegistration');
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [navigation]);

  return (
    <View style={styles.mainContainar}>
      <Image
        source={require('../../assets/Logo/logo.png')}
        style={styles.ImageStyle}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageStyle: {
    height: 150,
    width: 150,
    borderRadius: 20,
  },
});
