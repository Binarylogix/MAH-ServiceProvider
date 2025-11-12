import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_GET = 'https://www.makeahabit.com/api/v1/requestOffer/my-requests';
const API_POST = 'https://www.makeahabit.com/api/v1/requestOffer/create';

const AddOfferScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [offerTitle, setOfferTitle] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  // ✅ Correct modal state variable
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const response = await axios.get(API_GET, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(response.data?.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch offers!');
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!offerTitle || !discount || !startDate || !endDate) {
      Alert.alert('Validation', 'Please fill all required fields!');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const payload = {
        offerTitle,
        discount,
        startDate,
        endDate,
        description,
      };
      await axios.post(API_POST, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Offer requested successfully!');
      setOfferTitle('');
      setDiscount('');
      setStartDate('');
      setEndDate('');
      setDescription('');
      setModalVisible(false);
      fetchOffers();
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to submit offer request',
      );
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#E53935';
      case 'pending':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  };

  const renderOfferCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        setSelectedOffer(item);
        setDetailModalVisible(true);
      }}
    >
      <View style={styles.card}>
        <View
          style={[
            styles.cardStripe,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <Text style={styles.cardTitle}>{item.offerTitle}</Text>
          {item.description ? (
            <Text style={styles.cardDesc}>{item.description}</Text>
          ) : null}
          <Text style={styles.cardInfo}>
            Discount: {item.discount}% |{' '}
            {new Date(item.startDate).toLocaleDateString()} -{' '}
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#e6f0c1ff', '#fbfffdff']}
      style={{ flex: 1, padding: 16 }}
    >
      <View style={styles.headerRow}>
        <HeaderLeft title={'Offers'} />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <LinearGradient
            colors={['#00D65F', '#01823A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBtnGradient}
          >
            <Text style={styles.addBtnText}>Add Offer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#00B96D"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={offers}
          keyExtractor={item => item._id || item.id}
          renderItem={renderOfferCard}
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ marginTop: 10 }}
        />
      )}

      {/* Request Offer Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add Offer</Text>

              <Text style={styles.label}>Offer Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter offer title"
                value={offerTitle}
                onChangeText={setOfferTitle}
              />

              <Text style={styles.label}>Discount (%) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter discount"
                keyboardType="numeric"
                value={discount}
                onChangeText={setDiscount}
              />

              <Text style={styles.label}>Start Date *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={{ color: startDate ? '#000' : '#888' }}>
                  {startDate || 'Select Start Date'}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate ? new Date(startDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date.toISOString().slice(0, 10));
                  }}
                />
              )}

              <Text style={styles.label}>End Date *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={{ color: endDate ? '#000' : '#888' }}>
                  {endDate || 'Select End Date'}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate ? new Date(endDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date.toISOString().slice(0, 10));
                  }}
                />
              )}

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <View style={{ flexDirection: 'row', marginTop: 16 }}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#00B96D' }]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.modalBtnText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#B0BEC5' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ✅ Offer Details Modal (Fixed) */}
      {/* Offer Details Modal */}
      <Modal visible={detailModalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.glassCard}>
            {selectedOffer && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedOffer.offerTitle}
                </Text>

                <View style={styles.modalDivider} />

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Discount:</Text>
                  <Text style={styles.modalValue}>
                    {selectedOffer.discount}%
                  </Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Start Date:</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedOffer.startDate).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>End Date:</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedOffer.endDate).toLocaleDateString()}
                  </Text>
                </View>

                <Text style={styles.modalLabel}>Description:</Text>
                <Text style={styles.modalDescription}>
                  {selectedOffer.description || 'No description provided.'}
                </Text>

                {/* Status */}
                <Text style={[styles.modalLabel, { marginTop: 12 }]}>
                  Status:
                </Text>
                <View style={styles.statusContainer}>
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(selectedOffer.status) },
                    ]}
                  >
                    {selectedOffer.status.toUpperCase()}
                  </Text>
                </View>

                {/* Admin Remark */}
                {selectedOffer.adminRemarks ? (
                  <>
                    <Text style={[styles.modalLabel, { marginTop: 12 }]}>
                      Admin Remark:
                    </Text>
                    <Text style={styles.modalRemarks}>
                      💬 {selectedOffer.adminRemarks}
                    </Text>
                  </>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setDetailModalVisible(false)}
                  style={styles.gradientButton}
                >
                  <LinearGradient
                    colors={['#00C853', '#00B96D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientInner}
                  >
                    <Text style={styles.gradientText}>Close</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  modalLabel: {
    color: '#1E1E1E',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },

  modalRemarks: {
    color: '#555',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
    fontStyle: 'italic',
  },

  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  glassCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(15px)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    // marginBottom: 6,
  },

  modalDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    // marginVertical: 10,
  },

  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },

  modalLabel: {
    color: '#252323ff',
    fontSize: 14,
    fontWeight: '600',
  },

  modalValue: {
    color: '#857f7fff',
    fontSize: 14,
    fontWeight: '500',
  },

  modalDescription: {
    color: '#857f7fff',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  statusContainer: {
    marginTop: 12,
    alignItems: 'center',
  },

  statusText: {
    fontWeight: '700',
    fontSize: 15,
  },

  modalRemarks: {
    color: '#FFD54F',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 13,
  },

  gradientButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },

  gradientInner: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  gradientText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#00B96D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  value: {
    fontSize: 14,
    color: '#444',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtnGradient: {
    height: 30,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '500', fontSize: 12 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    position: 'relative',
    elevation: 2,
  },
  cardStripe: {
    width: 6,
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  cardDesc: { fontSize: 12, color: '#5F5F5F', marginBottom: 6 },
  cardInfo: { fontSize: 10, color: '#777' },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    // marginBottom: 12,
    textAlign: 'center',
    color: '#1E1E1E',
  },
  label: { fontWeight: '600', marginBottom: 0, marginTop: 12, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FAFAFA',
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default AddOfferScreen;
