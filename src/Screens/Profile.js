import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuCard from '../Component/MenuCard';
import { fetchVendorDetails, clearVendorDetails } from '../redux/Vendor/vendorDetailsSlice';

const defaultProfileImg = {
  uri: 'https://randomuser.me/api/portraits/men/1.jpg',
};

export default function Profile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { vendor, loading, error } = useSelector(state => state.vendorDetails);

  useEffect(() => {
    dispatch(fetchVendorDetails());
    return () => dispatch(clearVendorDetails());
  }, [dispatch]);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'VendorLogin' }],
            });
          } catch (error) {
            Alert.alert('Error', 'Failed to log out. Please try again.');
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#14ad5f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Top Header Decorative Curve */}
        <LinearGradient
          colors={['#00D65F', '#009F4A']}
          style={styles.headerBg}
        />

        {/* Profile Card */}
        <View style={styles.profileWrapper}>
          <View style={styles.profileCard}>
            <Image
              source={
                vendor?.data?.profileImage
                  ? { uri: vendor.data.profileImage }
                  : defaultProfileImg
              }
              style={styles.avatar}
            />

            <Text style={styles.profileName}>
              {vendor?.data?.fullName || 'Vendor Name'}
            </Text>

            <Text style={styles.profileEmail}>
              {vendor?.data?.email || 'vendor@example.com'}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.8}
              style={styles.editButtonWrapper}
            >
              <LinearGradient
                colors={['#00D65F', '#01823A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menucard}>
          <MenuCard icon="translate" label="Language" onPress={() => {}} />
          <MenuCard icon="car-wash" label="Service" onPress={() => navigation.navigate('AllServices')} />
          <MenuCard icon="account-outline" label="Staff" onPress={() => navigation.navigate('AllStaff')} />
          <MenuCard icon="cube-outline" label="Offers" onPress={() => navigation.navigate('AllProduct')} />
          <MenuCard icon="image-multiple-outline" label="Gallery" onPress={() => navigation.navigate('AllPhoto')} />
          <MenuCard icon="help-circle" label="FAQ" onPress={() => navigation.navigate('FAQScreen')} />
          <MenuCard icon="information-outline" label="Help and Support" onPress={() => navigation.navigate('HelpAndSupportScreen')} />
          <MenuCard icon="clipboard-text-outline" label="Terms & Conditions" onPress={() => {}} />
          <MenuCard icon="shield-account-outline" label="Privacy and Policy" onPress={() => navigation.navigate('PrivacyPolicyScreen')} />
          <MenuCard icon="star" label="Rate Us" onPress={() => navigation.navigate('RateUsScreen')} />
          <MenuCard icon="logout" label="Log out" highlight={true} onPress={handleLogout} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f7f5' },

  center: { justifyContent: 'center', alignItems: 'center' },

  /* ✅ Top Decorative Background */
  headerBg: {
    height: 150,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  /* ✅ Profile Card placed overlapping header */
  profileWrapper: {
    marginTop: -80,
    paddingHorizontal: 20,
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#00c45a',
  },

  profileName: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0e0e0e',
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 15,
    color: '#5b5b5b',
    marginBottom: 16,
  },

  editButtonWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
  },

  editButton: {
    height: 45,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },

  editButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  menucard: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },
});
