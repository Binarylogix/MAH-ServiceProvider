import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import FALLBACK_IMAGE from '../../assets/user.png';

const { width } = Dimensions.get('window');

export default function AccountDetails({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const API_TOKEN = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      try {
        const response = await axios.get(
          `https://www.mandlamart.co.in/api/users/getUserProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          },
        );
        if (response.data) {
          setUserData(response.data.user || response.data);
        }
      } catch (error) {
        console.log('API Error:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userId');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }], // change to your login screen name
            });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#01A449" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loader}>
        <Text style={styles.noDataText}>No user data found</Text>
      </View>
    );
  }

  const profileImageUri = userData.profileImage
    ? { uri: `https://www.mandlamart.co.in/uploads/${userData.profileImage}` }
    : FALLBACK_IMAGE;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#01A449', '#00D65F']}
        style={styles.headerBackground}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backRow}
        >
          <Icon name="arrow-left" size={20} color="#fff" />
          <Text style={styles.headerTitle}>My Profile</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Profile Card */}
      <View style={styles.profileContainer}>
        <Image source={profileImageUri} style={styles.profileImage} />
        <Text style={styles.name}>{userData.fullName || 'User Name'}</Text>
        <Text style={styles.email}>{userData.email || 'user@example.com'}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📱 Mobile</Text>
            <Text style={styles.infoText}>{userData.phone || '--'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>⚧ Gender</Text>
            <Text style={styles.infoText}>{userData.gender || '--'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>📍 Address</Text>
            <Text style={[styles.infoText, { flex: 1 }]} numberOfLines={2}>
              {userData.address || '--'}
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fdf9' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noDataText: { fontSize: 16, color: '#888' },

  headerBackground: {
    height: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
  },

  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#01A449',
    marginBottom: 16,
  },
  name: { fontSize: 22, fontWeight: '700', color: '#2e7d32' },
  email: { fontSize: 16, color: '#555', marginBottom: 20 },

  infoCard: {
    backgroundColor: '#fff',
    width: width - 40,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: { fontSize: 15, fontWeight: '600', color: '#333' },
  infoText: { fontSize: 15, color: '#666', flexShrink: 1, textAlign: 'right' },

  logoutBtn: {
    marginTop: 24,
    backgroundColor: '#01A449',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
