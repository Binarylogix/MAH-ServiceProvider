import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookings } from '../../redux/Vendor/BookingSlice';
import { useNavigation } from '@react-navigation/native';

const defaultProfile = { uri: 'https://randomuser.me/api/portraits/men/1.jpg' };

const statusColors = {
  pending: '#ffa500',
  approved: '#4CAF50',
  paid: '#b1fab4ff',
  completed: '#4CAF50',
  canceled: '#9E9E9E',
};

const getTodayISO = () => new Date().toISOString().slice(0, 10);

const BookingCardItem = ({ booking }) => {
  const navigation = useNavigation();
  const {
    date = booking?.booking?.date,
    status = booking?.booking?.status,
    customerName = booking?.user?.fullName,
    services = booking?.booking?.services || [],
    price = booking?.booking?.totalPrice,
    profileImage = booking?.user?.profileImg,
  } = booking || {};

  // Map to get service names safely
  const servicesText = services.map(s => s.service?.serviceName).join(', ');

  return (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={
        () => navigation.navigate('BookingDetails', { booking: booking }) // ✅ Navigate to details screen
      }
    >
      <View style={styles.bookingHeader}>
        <Text>{new Date(date).toLocaleString()}</Text>
        <View
          style={[
            styles.statusBox,
            { backgroundColor: statusColors[status.toLowerCase()] || '#ccc' },
          ]}
        >
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      <View style={styles.bookingUserRow}>
        <Image
          source={{
            uri: profileImage
              ? `https://www.makeahabit.com/api/v1/uploads/customer/${profileImage}`
              : 'https://cdn-icons-png.flaticon.com/512/1973/1973701.png',
          }}
          style={styles.bookingImg}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.bookingName}>{customerName}</Text>
          <Text style={styles.bookingService}>Services: {servicesText}</Text>
          <Text style={styles.bookingService}>Price: ₹{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BookingCard = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.booking);
  const [todayBookings, setTodayBookings] = useState([]);
  const todayISO = getTodayISO();

  console.log('bokings', todayBookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    // Filter bookings to today's only, excluding completed/canceled
    const filtered = bookings.filter(
      b => b.booking.date.slice(0, 10) === todayISO,
    );
    setTodayBookings(filtered);
  }, [bookings]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#18A558" />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 6 }}>
      <Text style={styles.sectionTitle}>Today's Bookings</Text>
      {todayBookings.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No bookings for today
        </Text>
      ) : (
        <FlatList
          data={todayBookings}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <BookingCardItem booking={item} />}
        />
      )}
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 26,
    marginBottom: 6,
    color: '#222',
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    borderColor: '#f0f0f0',
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
  },
  statusBox: {
    borderRadius: 11,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  statusText: {
    color: '#223e2cff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  bookingUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  bookingImg: {
    width: 43,
    height: 43,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  bookingName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  bookingService: {
    fontSize: 12,
    color: '#444',
  },
});
