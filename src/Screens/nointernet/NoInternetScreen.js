import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/nointernet.jpg')}
        style={styles.image}
      />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Please check your Wi-Fi or mobile data and try again.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 10,
    color: '#777',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default NoInternetScreen;
