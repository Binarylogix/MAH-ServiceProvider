import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_GET = 'https://www.makeahabit.com/api/v1/requestOffer/my-requests';
const API_POST = 'https://www.makeahabit.com/api/v1/requestOffer/create';

const AddOfferScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [offerTitle, setOfferTitle] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

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
      console.log('fetchoffer responder', response.data);
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
      const response = await axios.post(API_POST, payload, {
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

  const renderOfferCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardStripe} />
      <View style={{ flex: 1, paddingLeft: 12 }}>
        <Text style={styles.cardTitle}>{item.offerTitle}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
        <Text style={styles.cardInfo}>
          Discount: {item.discount}% | {item.startDate} - {item.endDate}
        </Text>
      </View>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}%</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#e6f0c1ff', '#fbfffdff']}
      style={{ flex: 1, padding: 16 }}
    >
      <View style={styles.headerRow}>
        <HeaderLeft title={'Offer'} />
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
            <Text style={styles.addBtnText}>Request Offer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Offer Query Cards */}
      {loading ? (
        <ActivityIndicator size="large" color="#00D65F" />
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
              <Text style={styles.modalTitle}>Request Offer</Text>

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

              <Text style={styles.label}>Start Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-10-14"
                value={startDate}
                onChangeText={setStartDate}
              />

              <Text style={styles.label}>End Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-10-31"
                value={endDate}
                onChangeText={setEndDate}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#14ad5f' }]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.modalBtnText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardStripe: {
    width: 6,
    borderRadius: 4,
    backgroundColor: '#00D65F',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },

  discountBadge: {
    backgroundColor: '#00D65F',
    paddingVertical: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9f6' },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { fontSize: 20, fontWeight: '700', color: '#222' },

  addBtn: { alignSelf: 'flex-start' },
  addBtnGradient: {
    height: 30,
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  cardDesc: { fontSize: 14, color: '#555', marginBottom: 6 },
  cardInfo: { fontSize: 12, color: '#888' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: { fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  imagePickerBtn: {
    backgroundColor: '#00D65F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
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
