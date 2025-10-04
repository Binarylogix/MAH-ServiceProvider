import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import user from '../../assets/Icons/customer.png';
import delivery from '../../assets/Icons/store.png';

export default function RootIndex({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');

        if (token && userId) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabScreen' }],
          });
        } else {
          setLoading(false); // only show Root UI if no token/userId
        }
      } catch (error) {
        console.log('Error checking token:', error);
        setLoading(false);
      }
    };

    checkToken();
  }, [navigation]);

  // Show nothing or loader while checking token
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome To Make a Habit</Text>
      <Text style={styles.title}>Create Account</Text>

      {/* Customer Card */}
      <LinearGradient colors={['#191D2B', '#090D14']} style={styles.card}>
        <TouchableOpacity
          style={styles.innerCard}
          onPress={() => navigation.navigate('Login')}
        >
          <Image source={user} style={styles.icon} />
          <Text style={styles.cardTitle}>Customer</Text>
          <Text style={styles.cardSubtitle}>Register as a Customer</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Service Provider Card */}
      <LinearGradient
        colors={['#00D65F', '#01823A']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <TouchableOpacity
          style={styles.innerCard}
          onPress={() => navigation.navigate('VenderLogin')}
        >
          <Image source={delivery} style={styles.icon} />
          <Text style={styles.cardTitle}>Service Provider</Text>
          <Text style={styles.cardSubtitle}>
            Register as a Service Provider
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 18,
    color: '#444',
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 30,
  },
  card: {
    width: '90%',
    borderRadius: 15,
    marginVertical: 10,
  },
  innerCard: {
    alignItems: 'center',
    paddingVertical: 25,
    borderRadius: 15,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#f0f0f0',
    marginTop: 5,
  },
});
