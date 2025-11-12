import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import LinearGradient from 'react-native-linear-gradient';

const BookingDetailsScreen = ({ route }) => {
  const { booking } = route.params;
  const profileUri = booking?.user?.profileImg
    ? `https://www.makeahabit.com/api/v1/uploads/customer/${booking?.user?.profileImg}`
    : 'https://cdn-icons-png.flaticon.com/512/1973/1973701.png';

  return (
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <HeaderLeft title={'Booking Details'} />

        <View style={styles.card}>
          <View style={styles.profileRow}>
            <Image source={{ uri: profileUri }} style={styles.profileImage} />
            <View>
              <Text style={styles.name}>{booking?.user?.fullName}</Text>
              <Text style={styles.subText}>{booking?.user?.email || ''}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.detailSectionTitle}>Booking Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Date(booking?.booking?.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{booking?.booking?.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Services</Text>
            <Text style={styles.value}>
              {booking?.booking?.services
                ?.map(s => s.service?.serviceName)
                .join(', ') || '-'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Price</Text>
            <Text style={styles.price}>₹{booking?.booking?.totalPrice}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[
                styles.status,
                {
                  color: booking.status === 'Completed' ? '#18A558' : '#E4572E',
                },
              ]}
            >
              {booking?.status}
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
    marginRight: 18,
    borderWidth: 3,
    borderColor: '#E8EAF6',
    shadowColor: '#111',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 2, height: 6 },
  },
  name: { fontSize: 15, fontWeight: '500', color: '#212121', marginBottom: 3 },
  subText: { fontSize: 12, color: '#878FA6' },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2176FF',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2FA',
  },
  label: { fontSize: 12, color: '#5C5F6E', fontWeight: '500' },
  value: { fontSize: 13, color: '#1A1A1A', fontWeight: '400' },
  price: { fontSize: 13, color: '#18A558', fontWeight: '700' },
  status: { fontSize: 13, fontWeight: '600' },
});

export default BookingDetailsScreen;
