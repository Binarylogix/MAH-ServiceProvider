import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDetails } from '../../../redux/Vendor/vendorDetailsSlice';
import HeaderCom from '../../../Component/HeaderCom';
import CurrentLocation from '../../../Component/currentlocation/CurrentLocation';
import QuickCard from '../../Quickcard/Quickcard';
import AmountCard from '../../Amountcard/AmountCard';
import BookingCard from '../../BookingCard/BookingCard';

const defaultProfile = { uri: 'https://randomuser.me/api/portraits/men/1.jpg' };

export default function VendorHome() {
  const dispatch = useDispatch();
  const { vendor } = useSelector(state => state.vendorDetails);
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchVendorDetails()).finally(() => setRefreshing(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchVendorDetails());
  }, [dispatch]);

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
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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

        {/* Amount and Stats */}
        <AmountCard
          totalAmount={vendor?.totalAmount || 0}
          completed={vendor?.completedBookings || 0}
          upcoming={vendor?.upcomingBookings || 0}
        />

        {/* Quick Cards Row */}
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

        <BookingCard />
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
