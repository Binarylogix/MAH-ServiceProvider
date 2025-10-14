import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import { launchImageLibrary } from 'react-native-image-picker';

const demoServices = [
  {
    id: '1',
    name: 'Hair Spa',
    category: 'Salon',
    price: 799,
    icon: 'content-cut',
  },
  {
    id: '2',
    name: 'Full Body Massage',
    category: 'Wellness',
    price: 1299,
    icon: 'spa',
  },
  {
    id: '3',
    name: 'Home Cleaning',
    category: 'Household',
    price: 499,
    icon: 'broom',
  },
  {
    id: '4',
    name: 'Car Wash',
    category: 'Automobile',
    price: 699,
    icon: 'car-wash',
  },
];

export default function AllStaff() {
  const [modalVisible, setModalVisible] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffImage, setStaffImage] = useState(null);

  // Pick staff image
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (!res.didCancel && res.assets && res.assets.length > 0) {
        setStaffImage(res.assets[0]);
      }
    });
  };

  const handleAddStaff = () => {
    if (!staffName || !staffEmail || !staffPhone || !staffRole) {
      alert('Please fill all required fields');
      return;
    }

    // TODO: call API to add staff
    console.log({ staffName, staffEmail, staffPhone, staffRole, staffImage });

    alert('Staff added successfully!');
    setModalVisible(false);

    // Reset form
    setStaffName('');
    setStaffEmail('');
    setStaffPhone('');
    setStaffRole('');
    setStaffImage(null);
  };

  const handleOpenModal = () => setModalVisible(true);

  const renderItem = ({ item }) => (
    <Pressable style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={32} color="#01A449" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{item.price}</Text>
        <Icon name="chevron-right" size={22} color="#999" />
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderLeft title={'All Staff'} />
          <TouchableOpacity onPress={handleOpenModal} activeOpacity={0.8}>
            <LinearGradient
              colors={['#00D65F', '#01823A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.AddBtn}
            >
              <Text style={styles.Addservice}>Add Staff</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Staff List */}
        <FlatList
          data={demoServices}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {/* ✅ Add Staff Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>Add New Staff</Text>

                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={staffName}
                  onChangeText={setStaffName}
                  placeholder="Enter staff name"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={staffEmail}
                  onChangeText={setStaffEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                />

                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={staffPhone}
                  onChangeText={setStaffPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />

                <Text style={styles.label}>Role</Text>
                <TextInput
                  style={styles.input}
                  value={staffRole}
                  onChangeText={setStaffRole}
                  placeholder="Enter role (e.g., Manager)"
                />

                <Text style={styles.label}>Staff Image</Text>
                <TouchableOpacity
                  style={styles.imagePickerBtn}
                  onPress={pickImage}
                >
                  <Text style={styles.imagePickerBtnText}>
                    {staffImage ? 'Change Image' : 'Pick Image'}
                  </Text>
                </TouchableOpacity>

                {staffImage && (
                  <View style={styles.imagePreviewWrapper}>
                    <Image
                      source={{ uri: staffImage.uri }}
                      style={styles.imagePreview}
                    />
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: '#14ad5f' }]}
                    onPress={handleAddStaff}
                  >
                    <Text style={styles.modalBtnText}>Add Staff</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: '#fa7272ff' }]}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  AddBtn: {
    padding: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Addservice: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 4,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#E6F7EE',
    borderRadius: 50,
    padding: 10,
    marginRight: 14,
  },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#222' },
  categoryText: { fontSize: 13, color: '#666', marginTop: 2 },
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '700', color: 'black', marginRight: 4 },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  imagePickerBtn: {
    backgroundColor: '#14ad5f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  imagePreviewWrapper: { alignItems: 'center', marginBottom: 15 },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00D65F',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '600' },
});
