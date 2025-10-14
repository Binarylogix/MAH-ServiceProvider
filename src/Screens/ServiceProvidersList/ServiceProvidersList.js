import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import noImage from '../../assets/images/noImage.jpg';

const BASE_URL = 'https://www.makeahabit.com/api/v1/uploads';
const BOOKINGS_API = 'https://www.makeahabit.com/api/v1/booking/getAllBookings';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Sample data for preview
    setBookings([
      {
        _id: '1',
        serviceName: 'Haircut & Styling',
        customerName: 'Amit Sharma',
        bookingDate: '2025-10-15T11:30:00',
        status: 'confirmed',
        image: '',
      },
      {
        _id: '2',
        serviceName: 'Facial Treatment',
        customerName: 'Riya Mehta',
        bookingDate: '2025-10-16T14:00:00',
        status: 'pending',
        image: '',
      },
      {
        _id: '3',
        serviceName: 'Beard Trim',
        customerName: 'Karan Singh',
        bookingDate: '2025-10-17T10:00:00',
        status: 'cancelled',
        image: '',
      },
      {
        _id: '4',
        serviceName: 'Full Body Massage',
        customerName: 'Sneha Patel',
        bookingDate: '2025-10-18T16:30:00',
        status: 'confirmed',
        image: '',
      },
    ]);
    // fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('vendorToken');
      const res = await axios.get(BOOKINGS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) {
        setBookings(res.data.data);
        setFiltered(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = id => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No' },
        {
          text: 'Yes, Cancel',
          onPress: async () => {
            try {
              await axios.put(
                `https://www.makeahabit.com/api/v1/booking/cancel/${id}`,
              );
              Alert.alert('Success', 'Booking cancelled');
              fetchBookings();
            } catch (e) {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          },
        },
      ],
    );
  };

  const handleReschedule = id => {
    Alert.alert('Reschedule Booking', 'Feature coming soon!');
  };

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(bookings);
    } else {
      const lower = search.toLowerCase();
      const filter = bookings.filter(
        b =>
          b.customerName?.toLowerCase().includes(lower) ||
          b.serviceName?.toLowerCase().includes(lower),
      );
      setFiltered(filter);
    }
  }, [search, bookings]);

  const renderBookingCard = ({ item }) => (
    <View style={styles.salonCard}>
      {/* 🔹 Status Badge on Top Right */}
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              item.status === 'cancelled'
                ? '#ffcccc'
                : item.status === 'pending'
                ? '#fff3cd'
                : '#d4edda',
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color:
                item.status === 'cancelled'
                  ? 'red'
                  : item.status === 'pending'
                  ? '#856404'
                  : '#155724',
            },
          ]}
        >
          {item.status?.toUpperCase() || 'PENDING'}
        </Text>
      </View>

      {/* 🔹 Image */}
      <Image
        source={
          item.image
            ? {
                uri: item.image.startsWith('http')
                  ? item.image
                  : `${BASE_URL}/${item.image}`,
              }
            : noImage
        }
        style={styles.salonImage}
        resizeMode="cover"
      />

      {/* 🔹 Details */}
      <View style={styles.salonDetails}>
        <Text style={styles.salonName}>
          {item.serviceName || 'Service Name'}
        </Text>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
        >
          <MaterialCommunityIcons name="account" size={14} color="#18A558" />
          <Text style={[styles.salonLocation, { marginLeft: 4 }]}>
            {item.customerName || 'Customer'}
          </Text>
        </View>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
        >
          <MaterialCommunityIcons name="calendar" size={14} color="#666" />
          <Text style={[styles.salonServices, { marginLeft: 4 }]}>
            {new Date(item.bookingDate).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderLeft title="My Bookings" />

      <View style={styles.container}>
        {/* 🔍 Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer or service..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.searchIcon}>
            <Text style={{ fontSize: 18 }}>🔍</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#18A558" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item._id}
            renderItem={renderBookingCard}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text
                style={{ textAlign: 'center', color: '#999', marginTop: 20 }}
              >
                No bookings found
              </Text>
            }
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
    </View>
  );
};

export default BookingsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 44,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#222',
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 6,
  },
  salonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    position: 'relative', // ✅ For badge positioning
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  salonImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  salonDetails: {
    flex: 1,
  },
  salonName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  salonLocation: {
    fontSize: 13,
    color: '#18A558',
    fontWeight: '600',
  },
  salonServices: {
    fontSize: 12,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
