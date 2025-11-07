import React, { useState, useEffect } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'https://www.makeahabit.com/api/v1/staff';

export default function AllStaff() {
  const [modalVisible, setModalVisible] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // form fields
  const [staffName, setStaffName] = useState('');
  const [staffWork, setStaffWork] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffImage, setStaffImage] = useState(null);

  // 📦 Fetch Staff List
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('vendorToken');
      const res = await axios.get(`${BASE_URL}/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setStaffList(res.data.staff);
      }
    } catch (error) {
      console.error('Fetch Staff Error:', error);
      Alert.alert('Error', 'Failed to fetch staff list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // 📷 Pick Image
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (!res.didCancel && res.assets?.length > 0) {
        setStaffImage(res.assets[0]);
      }
    });
  };

  // 🧾 Handle Create or Update
  const handleSubmit = async () => {
    if (!staffName || !staffWork || !staffPhone) {
      Alert.alert('Missing Info', 'Please fill all required fields.');
      return;
    }

    // ✅ Validate 10-digit phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(staffPhone)) {
      Alert.alert(
        'Invalid Phone',
        'Please enter a valid 10-digit phone number.',
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const formData = new FormData();
      formData.append('name', staffName);
      formData.append('work', staffWork);
      formData.append('phone', staffPhone);
      if (staffImage) {
        formData.append('img', {
          uri: staffImage.uri,
          name: staffImage.fileName || 'photo.jpg',
          type: staffImage.type || 'image/jpeg',
        });
      }

      let res;
      if (selectedStaff) {
        // UPDATE STAFF
        res = await axios.put(
          `${BASE_URL}/update/${selectedStaff._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      } else {
        // CREATE STAFF
        res = await axios.post(`${BASE_URL}/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (res.data.success) {
        Alert.alert(
          'Success',
          selectedStaff ? 'Staff updated!' : 'Staff added!',
        );
        setModalVisible(false);
        resetForm();
        fetchStaff();
      }
    } catch (err) {
      console.error('Create/Update Error:', err);
      Alert.alert('Error', 'Failed to save staff');
    }
  };

  // 🗑️ Delete Staff
  const handleDelete = async id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this staff?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('vendorToken');
              const res = await axios.delete(`${BASE_URL}/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.data.success) {
                Alert.alert('Deleted', 'Staff deleted successfully');
                fetchStaff();
              }
            } catch (err) {
              console.error('Delete Error:', err);
              Alert.alert('Error', 'Failed to delete staff');
            }
          },
        },
      ],
    );
  };

  // 🧹 Reset Form
  const resetForm = () => {
    setStaffName('');
    setStaffWork('');
    setStaffPhone('');
    setStaffImage(null);
    setSelectedStaff(null);
  };

  // ✏️ Open Modal (Add/Edit)
  const openModal = staff => {
    if (staff) {
      setSelectedStaff(staff);
      setStaffName(staff.name);
      setStaffWork(staff.work);
      setStaffPhone(staff.phone || '');
      setStaffImage({
        uri: `https://www.makeahabit.com/api/v1/uploads/staff/${staff.img}`,
      });
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.card}>
      <Image
        source={{
          uri: `https://www.makeahabit.com/api/v1/uploads/staff/${item.img}`,
        }}
        style={styles.staffImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.staffName}>{item.name}</Text>
        <Text style={styles.staffWork}>{item.work}</Text>
        <Text style={styles.staffPhone}>{item.phone}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openModal(item)}>
          <Icon name="pencil" size={22} color="#00A859" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Icon name="delete" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderLeft title={'All Staff'} />
          <TouchableOpacity onPress={() => openModal(null)} activeOpacity={0.8}>
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

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00A859"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={staffList}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* 🟢 Add/Edit Staff Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>
                  {selectedStaff ? 'Edit Staff' : 'Add New Staff'}
                </Text>

                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={staffName}
                  onChangeText={setStaffName}
                  placeholder="Enter staff name"
                />

                <Text style={styles.label}>Work</Text>
                <TextInput
                  style={styles.input}
                  value={staffWork}
                  onChangeText={setStaffWork}
                  placeholder="Enter work details"
                />

                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={staffPhone}
                  onChangeText={text =>
                    setStaffPhone(text.replace(/[^0-9]/g, '').slice(0, 10))
                  }
                  placeholder="Enter phone number"
                  keyboardType="numeric"
                  maxLength={10}
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
                    onPress={handleSubmit}
                  >
                    <Text style={styles.modalBtnText}>
                      {selectedStaff ? 'Update' : 'Add Staff'}
                    </Text>
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
    // padding: 6,
    height: 30,
    width: 80,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Addservice: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    margin: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  staffImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#00D65F',
  },
  staffName: { fontSize: 16, fontWeight: '600', color: '#222' },
  staffWork: { fontSize: 13, color: '#666', marginTop: 2 },
  staffPhone: { fontSize: 13, color: '#888', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10 },
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
