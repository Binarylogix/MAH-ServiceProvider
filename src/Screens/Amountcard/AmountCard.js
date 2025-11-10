import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookings } from '../../redux/Vendor/BookingSlice';

export default function AmountCard() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.booking);

  const [totalAmount, setTotalAmount] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [upcoming, setUpcoming] = useState(0);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && bookings.length) {
      const total = bookings
        .filter(b => b.status.toLowerCase() !== 'canceled')
        .reduce((sum, b) => sum + (b.booking?.totalPrice || 0), 0);

      const completedCount = bookings.filter(
        b => b.status.toLowerCase() === 'completed',
      ).length;
      const upcomingCount = bookings.filter(
        b =>
          b.status.toLowerCase() === 'paid' ||
          b.status.toLowerCase() === 'approved',
      ).length;

      console.log('amouint', total);

      setTotalAmount(total);
      setCompleted(completedCount);
      setUpcoming(upcomingCount);
    }
  }, [loading, bookings]);

  if (loading) {
    return (
      <View
        style={[
          styles.amountCard,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#00D65F', '#01823A']}
      style={{ flex: 1, borderRadius: 20, marginBottom: 12 }}
    >
      <View style={styles.amountCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountSubLabel}>Total</Text>
          </View>
          <Text style={styles.amountValue}>Rs {totalAmount}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="check-all" size={20} color="#14AD5F" />
            <Text style={styles.statCardValue}>{completed}</Text>
            <Text style={styles.statCardTitle}>Bookings Completed</Text>
          </View>
          <View style={[styles.statCard, { marginRight: 0 }]}>
            <Icon name="clock-outline" size={20} color="#14AD5F" />
            <Text style={styles.statCardValue}>{upcoming}</Text>
            <Text style={styles.statCardTitle}>Upcoming Bookings</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  amountCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
  },
  amountLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 4,
  },
  amountSubLabel: { color: '#fff', fontSize: 13, paddingHorizontal: 4 },
  amountValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', marginTop: 10, gap: 20 },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 13,
    alignItems: 'center',
    flex: 1,
    padding: 4,
  },
  statCardTitle: {
    color: '#2A2A2A',
    fontWeight: '500',
    marginBottom: 2,
    fontSize: 12,
  },
  statCardValue: {
    color: '#14AD5F',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
