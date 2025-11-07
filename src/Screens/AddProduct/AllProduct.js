import React, { useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import HeaderLeft from '../../Component/Header/HeaderLeft';

const demoQueries = [
  {
    id: '1',
    title: 'Spring Discount Offer',
    description: '20% off on all hair services.',
    discount: 20,
    startDate: '2025-04-01',
    endDate: '2025-04-30',
  },
  {
    id: '2',
    title: 'Wellness Weekend',
    description: '15% off on all spa services.',
    discount: 15,
    startDate: '2025-05-10',
    endDate: '2025-05-12',
  },
];

const AddOfferScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [offerImage, setOfferImage] = useState(null);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (!res.didCancel && res.assets && res.assets.length > 0) {
        setOfferImage(res.assets[0]);
      }
    });
  };

  const handleSubmit = () => {
    if (!title || !discount || !startDate || !endDate) {
      Alert.alert('Validation', 'Please fill all required fields!');
      return;
    }

    console.log({
      title,
      description,
      discount,
      startDate,
      endDate,
      offerImage,
    });
    Alert.alert('Success', 'Offer submitted successfully!');
    setTitle('');
    setDescription('');
    setDiscount('');
    setStartDate('');
    setEndDate('');
    setOfferImage(null);
    setModalVisible(false);
  };

  const renderQueryCard = ({ item }) => (
    <View style={styles.card}>
      {/* Decorative stripe on left */}
      <View style={styles.cardStripe} />
      <View style={{ flex: 1, paddingLeft: 12 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
        <Text style={styles.cardInfo}>
          Discount: {item.discount}% | {item.startDate} - {item.endDate}
        </Text>
      </View>

      {/* Discount badge */}
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}%</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header row: Offer Queries + Add Offer button */}

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
            <Text style={styles.addBtnText}>Add Offer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Static Query Cards */}
      <FlatList
        data={demoQueries}
        keyExtractor={item => item.id}
        renderItem={renderQueryCard}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ marginTop: 10 }}
      />

      {/* Add Offer Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add Offer</Text>

              <Text style={styles.label}>Offer Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter offer title"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
                multiline
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

              <Text style={styles.label}>Offer Image</Text>
              <TouchableOpacity
                style={styles.imagePickerBtn}
                onPress={pickImage}
              >
                <Text style={styles.imagePickerBtnText}>
                  {offerImage ? 'Change Image' : 'Pick Image'}
                </Text>
              </TouchableOpacity>

              {offerImage && (
                <Image
                  source={{ uri: offerImage.uri }}
                  style={styles.imagePreview}
                />
              )}

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
    </View>
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
    height: 25,
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

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
