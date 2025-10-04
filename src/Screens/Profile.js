import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import ProfileCom from '../Component/Profilecom';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import ProfileScreen from '../Screens/Profilecard/Profilecard';

const { width } = Dimensions.get('window');

const Profile = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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
            headers: { Authorization: `Bearer ${API_TOKEN}` },
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
    try {
      await AsyncStorage.multiRemove(['userToken', 'userEmail', 'userId']);
      navigation.replace('Login');
    } catch (error) {
      console.log('Error clearing AsyncStorage:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#01823A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <ProfileScreen
        name={userData?.fullName || 'Guest User'}
        email={userData?.email || 'No email'}
        profileImage={userData?.profileImage || ''}
      />

      {/* General Section */}
      <Section title="General">
        <ProfileCom
          leftIcon={<Feather name="user" size={22} color="#01823A" />}
          rightIcon={<Icon name="angle-right" size={20} color="#A0A0A0" />}
          label="Account Details"
          description="Change your account information"
          onPress={() => navigation.navigate('AccountDetails')}
        />

        <ProfileCom
          leftIcon={<Feather name="heart" size={22} color="#01823A" />}
          rightIcon={<Icon name="angle-right" size={20} color="#A0A0A0" />}
          label="Favorite"
          description="Your favorite items"
        />

        <ProfileCom
          leftIcon={<MaterialCommunityIcons name="help" size={22} color="#01823A" />}
          rightIcon={<Icon name="angle-right" size={20} color="#A0A0A0" />}
          label="Help & Support"
          description="Get support 24/7"
        />

        <ProfileCom
          leftIcon={<MaterialCommunityIcons name="gift-outline" size={22} color="#01823A" />}
          rightIcon={<Icon name="angle-right" size={20} color="#A0A0A0" />}
          label="Rewards"
          description="See the offers/rewards for you"
        />
      </Section>

      {/* Notifications Section */}
      <Section title="Notifications">
        <ProfileCom
          leftIcon={<Feather name="message-circle" size={22} color="#01823A" />}
          rightIcon={<Icon name="angle-right" size={20} color="#A0A0A0" />}
          label="Notification"
          description="Check the latest messages"
        />
      </Section>

      {/* More Section */}
      <Section title="More">
        <ProfileCom
          leftIcon={<MaterialCommunityIcons name="star-outline" size={22} color="#01823A" />}
          rightIcon={<Icon name="angle-right" size={20} color="#A0A0A0" />}
          label="Rate Us"
          description="Share your feedback"
        />

        <ProfileCom
          leftIcon={<Feather name="help-circle" size={22} color="#01823A" />}
          rightIcon={<Icon name="angle-right" size={20} color="#A0A0A0" />}
          label="FAQ"
          description="Frequently Asked Questions"
        />

        <ProfileCom
          leftIcon={<Feather name="log-out" size={22} color="red" />}
          rightIcon={<Icon name="angle-right" size={20} color="#A0A0A0" />}
          label="Log Out"
          description="Sign out of your account"
          onPress={handleLogout}
        />
      </Section>
    </ScrollView>
  );
};

// Section Component
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: width * 0.05,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default Profile;
