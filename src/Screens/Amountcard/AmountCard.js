import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AmountCard({
  totalAmount = 0,
  completed = 0,
  upcoming = 0,
}) {
  return (
    <LinearGradient
      colors={['#00D65F', '#01823A']} // adjust colors to your brand or preference
      style={{ flex: 1, borderRadius: 20 }}
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
            <Text style={styles.statCardTitle}>Complete</Text>
          </View>
          <View style={[styles.statCard, { marginRight: 0 }]}>
            <Icon name="clock-outline" size={20} color="#14AD5F" />
            <Text style={styles.statCardValue}>{upcoming}</Text>
            <Text style={styles.statCardTitle}>Upcoming</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  amountCard: {
    // backgroundColor: '#06d764f4',
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
    // marginRight: 19,
    padding: 4,
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
    // marginTop: 4,
  },
});
