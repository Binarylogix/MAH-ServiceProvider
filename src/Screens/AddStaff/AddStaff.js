import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const AddStaff = () => {
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
    console.log({
      staffName,
      staffEmail,
      staffPhone,
      staffRole,
      staffImage,
    });

    alert('Staff added successfully!');
    setModalVisible(false);
    // Reset form
    setStaffName('');
    setStaffEmail('');
    setStaffPhone('');
    setStaffRole('');
    setStaffImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Staff</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Open Add Staff Form</Text>
      </TouchableOpacity>

      {/* Add Staff Modal */}
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

              {/* Modal Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#14ad5f' }]}
                  onPress={handleAddStaff}
                >
                  <Text style={styles.modalBtnText}>Add Staff</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#ff4444' }]}
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

export default AddStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  addButton: {
    backgroundColor: '#14ad5f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
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
    backgroundColor: '#00D65F',
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
    borderColor: '#ccc',
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
