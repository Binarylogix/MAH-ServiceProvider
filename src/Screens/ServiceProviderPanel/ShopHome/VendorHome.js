import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuickCard from '../../Quickcard/Quickcard';
import AmountCard from '../../Amountcard/AmountCard';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderCom from '../../../Component/HeaderCom';
import CurrentLocation from '../../../Component/currentlocation/CurrentLocation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDetails } from '../../../redux/Vendor/vendorDetailsSlice';

const defaultProfile = { uri: 'https://randomuser.me/api/portraits/men/1.jpg' };

export default function VendorHome() {
  const dispatch = useDispatch();
  const { vendor } = useSelector(state => state.vendorDetails);
  console.log('vendordata', vendor);

  // Fetch vendor details when component mounts
  useEffect(() => {
    dispatch(fetchVendorDetails());
  }, [dispatch]);
  const navigation = useNavigation();

  const goToAddService = () => {
    navigation.navigate('AllServices');
  };

  const goToCreateProduct = () => {
    navigation.navigate('AllProduct');
  };

  const goToAddPhotos = () => {
    navigation.navigate('AllPhoto');
  };
  const goToAddStaff = () => {
    navigation.navigate('AllStaff');
  };

  return (
    <LinearGradient
      colors={['#e6f0c1ff', '#fbfffdff']} // adjust colors to your brand or preference
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <HeaderCom />
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={
              vendor?.data?.businessCard
                ? {
                    uri: `https://www.makeahabit.com/api/v1/uploads/business/${vendor?.data?.businessCard}`,
                  }
                : defaultProfile
            }
            style={styles.profileImg}
          />
          <View style={{ flex: 1, marginLeft: 8, justifyContent: 'center' }}>
            <Text style={styles.headerTitle}>
              Hi, {vendor?.data?.fullName || 'Salon Name'}
            </Text>
            <CurrentLocation />
          </View>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ffffffff',
              padding: 8,
              borderRadius: 50,
            }}
          >
            <Ionicons name="notifications-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Amount and Stats (extracted) */}
        <AmountCard
          totalAmount={vendor?.totalAmount || 0}
          completed={vendor?.completedBookings || 0}
          upcoming={vendor?.upcomingBookings || 0}
        />

        {/* Quick Cards Row (example usage) */}
        <View style={styles.quickRow}>
          <QuickCard label="Add Service" icon="tags" onPress={goToAddService} />
          <QuickCard label="Add Staff" icon="users" onPress={goToAddStaff} />
        </View>
        <View style={styles.quickRow}>
          <QuickCard label="Add Photos" icon="photo" onPress={goToAddPhotos} />
          <QuickCard
            label="Add Offer"
            icon="shopping-basket"
            onPress={goToCreateProduct}
          />
        </View>

        <View style={{ paddingHorizontal: 6 }}>
          <Text style={styles.sectionTitle}>Recent Booking</Text>
          <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <Text>Dec 22, 2024 10:00 AM</Text>
              <View style={styles.statusBox}>
                <Text style={styles.statusText}>pending</Text>
              </View>
            </View>
            <View style={styles.bookingUserRow}>
              <Image source={defaultProfile} style={styles.bookingImg} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.bookingName}>Customer name</Text>
                <Text style={styles.bookingService}>
                  Services: Undercut Haircut, Regular Shaving,
                </Text>
                <Text style={styles.bookingService}>Price : 250</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function StatCard({ heading, value, icon }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statCardTitle}>{heading}</Text>
      <Icon name={icon} size={22} color="#14AD5F" />
      <Text style={styles.statCardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,

    paddingTop: 4,
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    // color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 14,
    // color: '#FFFFFF',
  },
  profileImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFD700', // golden border as accent
    marginLeft: 12,
  },

  profileImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 6,
    borderColor: '#14AD5F',
    borderWidth: 2,
  },
  statsRow: { flexDirection: 'row', marginTop: 13 },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 13,
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
    padding: 11,
  },
  statCardTitle: {
    color: '#2A2A2A',
    fontWeight: '600',
    marginBottom: 2,
    fontSize: 14,
  },
  statCardValue: {
    color: '#14AD5F',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  quickRow: { flexDirection: 'row', marginVertical: 8 },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 26,
    marginBottom: 6,
    color: '#222',
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    borderColor: '#f0f0f0',
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBox: {
    backgroundColor: '#ffa500',
    borderRadius: 11,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  statusText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  bookingUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  bookingImg: { width: 43, height: 43, borderRadius: 21.5 },
  bookingName: { fontWeight: 'bold', fontSize: 15 },
  bookingService: { fontSize: 13, color: '#444' },
});
