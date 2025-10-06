import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const dummyProfile = { uri: 'https://randomuser.me/api/portraits/men/1.jpg' };

export default function VendorHome() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="menu" size={24} color="#fff" />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={styles.headerTitle}>Salon Name</Text>
          <Text style={styles.headerSub}>Bhopal, MP</Text>
        </View>
        <Image source={dummyProfile} style={styles.profileImg} />
      </View>
      {/* Amount and Stats */}
      <View style={styles.amountCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountSubLabel}>Total</Text>
          </View>
          <Text style={styles.amountValue}>Rs 2000</Text>
        </View>
        <View style={styles.statsRow}>
          <StatCard heading="Complete" value="10" icon="check-all" />
          <StatCard heading="Upcoming" value="02" icon="clock-outline" />
        </View>
      </View>
      {/* Quick Cards */}
      <View style={styles.quickRow}>
        <QuickCard label="Staff" icon="account-group" />
        <QuickCard label="Services" icon="briefcase-outline" />
      </View>
      <View style={styles.quickRow}>
        <QuickCard label="Photos" icon="image-multiple-outline" />
        <QuickCard label="Products" icon="cube-outline" />
      </View>
      {/* Booking */}
      <Text style={styles.sectionTitle}>Recent Booking</Text>
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text>Dec 22, 2024 10:00 AM</Text>
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>pending</Text>
          </View>
        </View>
        <View style={styles.bookingUserRow}>
          <Image source={dummyProfile} style={styles.bookingImg} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.bookingName}>Customer name</Text>
            <Text style={styles.bookingService}>
              Services: Undercut Haircut, Regular Shaving,
            </Text>
            <Text style={styles.bookingService}>Price : 250</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.rejectBtn}>
            <Text style={{ color: '#14AD5F', fontWeight: 'bold' }}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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

function QuickCard({ label, icon }) {
  return (
    <View style={styles.quickCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.quickLabel}>{label}</Text>
        <Text style={styles.quickPlus}> + </Text>
      </View>
      <View style={styles.quickIcon}>
        <Icon name={icon} size={26} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 14 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 13,
    padding: 12,
    marginBottom: 18,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#aaa', fontSize: 13, marginTop: 2 },
  profileImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 6,
    borderColor: '#14AD5F',
    borderWidth: 2,
  },
  amountCard: {
    backgroundColor: '#14AD5F',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },
  amountLabel: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  amountSubLabel: { color: '#fff', fontSize: 13 },
  amountValue: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
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
  quickCard: {
    backgroundColor: '#fff',
    borderRadius: 13,
    flex: 1,
    marginRight: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  quickLabel: { color: '#333', fontWeight: '600', fontSize: 14 },
  quickPlus: { color: '#bbb', fontSize: 19, fontWeight: 'bold', marginLeft: 9 },
  quickIcon: {
    backgroundColor: '#14AD5F',
    borderRadius: 50,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rejectBtn: {
    borderColor: '#14AD5F',
    borderWidth: 1.5,
    borderRadius: 11,
    paddingVertical: 7,
    paddingHorizontal: 30,
    marginRight: 8,
  },
  confirmBtn: {
    backgroundColor: '#14AD5F',
    borderRadius: 11,
    paddingVertical: 7,
    paddingHorizontal: 30,
  },
});
