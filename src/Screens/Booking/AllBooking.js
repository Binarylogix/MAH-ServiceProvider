import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const bookingsData = [
  {
    id: '1',
    date: 'Dec 22, 2024',
    salonName: 'Salon Name',
    address: '123 Main Street, Anytown, USA',
    services: 'Undercut Haircut, Regular Shaving',
    price: 250,
    status: 'Pending',
  },
  {
    id: '2',
    date: 'Dec 22, 2024',
    salonName: 'Salon Name',
    address: '123 Main Street, Anytown, USA',
    services: 'Undercut Haircut, Regular Shaving',
    price: 250,
    status: 'Confirm',
  },
  // Add more bookings as needed
];

const statusColors = {
  Pending: '#FF7F50', // Coral (orange)
  Confirm: '#4CAF50', // Green
  Completed: '#2196F3', // Blue
  Canceled: '#9E9E9E', // Gray
};

const BookingCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.dateText}>{item.date}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || '#ccc' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.contentRow}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1973/1973701.png' }}
          style={styles.salonImage}
        />
        <View style={styles.details}>
          <Text style={styles.salonName}>{item.salonName}</Text>
          <Text style={styles.address}>{item.address}</Text>
          <Text style={styles.services}>
            <Text style={{ fontWeight: '600' }}>Services: </Text>
            {item.services}
          </Text>
          <Text style={styles.price}>
            <Text style={{ fontWeight: '600' }}>Price: </Text>
            {item.price}
          </Text>
        </View>
      </View>
      {item.status === 'Confirm' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.button, styles.viewBtn]}>
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.payBtn]}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>Pay</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const AllBooking = () => {
  const [activeTab, setActiveTab] = useState('Booking');

  const filteredBookings = bookingsData.filter((booking) => {
    if (activeTab === 'Booking') return booking.status === 'Pending' || booking.status === 'Confirm';
    if (activeTab === 'completed') return booking.status === 'Completed';
    if (activeTab === 'Canceled') return booking.status === 'Canceled';
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Booking</Text>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('Booking')}>
          <Text style={[styles.tabText, activeTab === 'Booking' && styles.activeTab]}>Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('completed')}>
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTab]}>completed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Canceled')}>
          <Text style={[styles.tabText, activeTab === 'Canceled' && styles.activeTab]}>Canceled</Text>
        </TouchableOpacity>
      </View>
      {/* List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#fff', paddingTop: 50 },
  screenTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  tabs: { flexDirection: 'row', marginBottom: 16, gap: 12, },
  tabText: { marginRight: 20, fontSize: 14, fontWeight: '600', color: '#888' },
  activeTab: { color: '#18A558', borderBottomWidth: 2, borderBottomColor: '#18A558' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  dateText: { fontSize: 12, color: '#888' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  contentRow: { flexDirection: 'row' },
  salonImage: { width: 60, height: 60, borderRadius: 6, marginRight: 12 },
  details: { flex: 1 },
  salonName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  address: { fontSize: 12, color: '#666', marginBottom: 2 },
  services: { fontSize: 12, color: '#666', marginBottom: 2 },
  price: { fontSize: 12, color: '#18A558', fontWeight: '700' },
  actionRow: { flexDirection: 'row', marginTop: 12, justifyContent: 'flex-end' },
  button: { borderRadius: 20, paddingVertical: 6, paddingHorizontal: 20, marginLeft: 10, borderWidth: 1 },
  viewBtn: { borderColor: '#18A558' },
  payBtn: { backgroundColor: '#18A558', borderColor: '#18A558' },
  buttonText: { fontSize: 14, fontWeight: '600' },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {},
  navText: { color: '#aaa', fontSize: 14 },
  navTextActive: { color: '#18A558', fontSize: 14, fontWeight: '700' },
});

export default AllBooking;
