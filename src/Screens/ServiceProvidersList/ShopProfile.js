import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

// ActionButton component for buttons like Location, Share
const ActionButton = ({ label, icon }) => (
  <TouchableOpacity style={styles.actionButton}>
    <Text style={styles.actionButtonIcon}>{icon}</Text>
    <Text style={styles.actionButtonLabel}>{label}</Text>
  </TouchableOpacity>
);

const ShopProfile = ({ route }) => {
  const { salonId } = route.params;

  const [salonDetails, setSalonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Services');
  const [selectedServices, setSelectedServices] = useState([]);

  // Fetch salon details using API
  useEffect(() => {
    if (!salonId) return;
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`https://www.makeahabit.com/api/v1/vendor/details/${salonId}`);

        if (response.data.success) {
          setSalonDetails(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching salon details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [salonId]);

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#18A558" />
      </View>
    );
  }

  const services = salonDetails?.services || [];
  const totalPrice = services
    .filter((s) => selectedServices.includes(s._id))
    .reduce((acc, cur) => acc + cur.price, 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cover Photo */}
        <Image
          source={{ uri: salonDetails.coverPhotoUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9' }}
          style={styles.coverPhoto}
        />

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <ActionButton label="Location" icon="📍" />
          <ActionButton label="Share" icon="🔗" />
        </View>

        {/* Specialists */}
        <View style={styles.specialistSection}>
          <Text style={styles.sectionTitle}>Salon Specialist</Text>
          <FlatList
            data={salonDetails.specialists || []}
            horizontal
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.specialistCard}>
                <Image source={{ uri: item.image }} style={styles.specialistAvatar} />
                <Text style={styles.specialistName}>{item.name}</Text>
                <Text style={styles.specialistRole}>{item.role}</Text>
              </View>
            )}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {['Services', 'Products', 'About', 'Gallery'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabLabel, selectedTab === tab && styles.activeTabLabel]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services Tab Content */}
        {selectedTab === 'Services' && (
          <View style={styles.servicesSection}>
            {services.map((service) => (
              <View key={service._id} style={styles.serviceCard}>
                <Image
                  source={{ uri: service.icon?.img || 'https://cdn-icons-png.flaticon.com/512/1973/1973701.png' }}
                  style={styles.serviceImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>₹{service.price}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleService(service._id)}>
                  <Text style={selectedServices.includes(service._id) ? styles.checkedIcon : styles.plusIcon}>
                    {selectedServices.includes(service._id) ? '✔️' : '+'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Other tabs (Products, About, Gallery) can be added similarly */}
      </ScrollView>

      {/* Total Price & Booking Button */}
      <View style={styles.summaryBar}>
        <Text style={styles.totalPriceLabel}>Total Price</Text>
        <Text style={styles.totalPriceValue}>₹{totalPrice}</Text>
      </View>
      <TouchableOpacity style={styles.bookingBtn}>
        <Text style={styles.bookingBtnText}>Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  coverPhoto: {
    height: 260,
    margin: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 18,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#161A2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  actionButtonIcon: { fontSize: 18, marginRight: 4, color: '#fff' },
  actionButtonLabel: { fontSize: 14, color: '#fff', fontWeight: '600' },

  specialistSection: { paddingHorizontal: 25, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 7 },
  specialistCard: {
    backgroundColor: '#F6FAF5',
    marginRight: 12,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 9,
    width: 90,
  },
  specialistAvatar: { width: 40, height: 40, borderRadius: 20, marginBottom: 6 },
  specialistName: { fontWeight: '700', fontSize: 13 },
  specialistRole: { fontSize: 11, color: '#18A558', fontWeight: '600' },

  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 18,
    paddingHorizontal: 10,
  },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#E3ECE6',
    marginHorizontal: 5,
  },
  activeTab: { backgroundColor: '#18A558' },
  tabLabel: { fontWeight: '600', fontSize: 14, color: '#111' },
  activeTabLabel: { color: '#fff' },

  servicesSection: { paddingHorizontal: 16, marginTop: 4 },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    marginBottom: 11,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  serviceImage: { width: 48, height: 48, borderRadius: 12, marginRight: 12 },
  serviceName: { fontWeight: '700', fontSize: 15, marginBottom: 3 },
  servicePrice: { color: '#18A558', fontWeight: '700', fontSize: 14 },
  checkedIcon: { fontSize: 20, color: '#18A558', fontWeight: 'bold' },
  plusIcon: { fontSize: 22, color: '#888', fontWeight: '700' },

  summaryBar: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    borderTopWidth: 1,
    borderColor: '#eee',
    shadowColor: '#111',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  totalPriceLabel: { fontSize: 15, fontWeight: '600' },
  totalPriceValue: { color: '#18A558', fontSize: 19, fontWeight: '700' },

  bookingBtn: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 6,
    height: 48,
    backgroundColor: '#18A558',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#18A558',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 },
  },
  bookingBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default ShopProfile;
