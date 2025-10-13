import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function AllPhoto() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  console.log(gallery);

  // ✅ Fetch Gallery
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://www.makeahabit.com/api/v1/galary/get-all',
      );
      if (response.data && response.data.galleryItems) {
        setGallery(response.data.galleryItems);
      } else {
        setGallery([]);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // ✅ Pick Image
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', 'Something went wrong while selecting the image.');
      return;
    }

    setSelectedImage(result.assets[0]);
  };

  // ✅ Upload Image (Create)
  const uploadImage = async () => {
    if (!selectedImage)
      return Alert.alert('No Image', 'Please select an image.');

    try {
      setUploading(true);
      const token = await AsyncStorage.getItem('vendorToken');

      const formData = new FormData();
      formData.append('img', {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName || 'photo.jpg',
      });

      const response = await axios.post(
        'https://www.makeahabit.com/api/v1/galary/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        Alert.alert('Success', 'Photo uploaded successfully!');
        setModalVisible(false);
        setSelectedImage(null);
        fetchGallery();
      } else {
        Alert.alert('Upload Failed', response.data.message || 'Try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete Photo
  const deletePhoto = async imgId => {
    try {
      const token = await AsyncStorage.getItem('vendorToken');
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this photo?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const response = await axios.delete(
                `http://www.makeahabit.com/api/v1/galary/delete/${imgId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (response.data.success) {
                Alert.alert('Deleted', 'Photo deleted successfully');
                fetchGallery();
              } else {
                Alert.alert('Error', 'Failed to delete photo');
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Could not delete photo.');
    }
  };

  // ✅ Update Photo
  const updatePhoto = async imgId => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', 'Something went wrong while selecting image.');
      return;
    }

    const newImage = result.assets[0];
    const token = await AsyncStorage.getItem('vendorToken');

    const formData = new FormData();
    formData.append('img', {
      uri: newImage.uri,
      type: newImage.type,
      name: newImage.fileName || 'updated-photo.jpg',
    });

    try {
      setUploading(true);
      const response = await axios.put(
        `http://www.makeahabit.com/api/v1/galary/update/${imgId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        Alert.alert('Updated', 'Photo updated successfully!');
        fetchGallery();
      } else {
        Alert.alert('Update Failed', response.data.message || 'Try again.');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Something went wrong while updating photo.');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Render Each Card
  const renderItem = ({ item }) => {
    const imageUrl = `http://www.makeahabit.com/api/v1/uploads/galary/${item.img}`;
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text numberOfLines={1} style={styles.imageName}>
            {item?.img?.split('-')[1] || 'Photo'}
          </Text>

          {/* Edit / Delete Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => updatePhoto(item._id)}>
              <Icon name="pencil" size={22} color="#00D65F" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deletePhoto(item._id)}>
              <Icon name="delete" size={22} color="#ff4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <HeaderLeft title={'All Photos'} />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#00D65F', '#01823A']}
              style={styles.addBtn}
            >
              <Text style={styles.addService}>Add Photos</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Gallery */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#01A449" />
            <Text
              style={{ color: '#01A449', marginTop: 10, fontWeight: '600' }}
            >
              Loading Photos...
            </Text>
          </View>
        ) : gallery.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No photos available</Text>
          </View>
        ) : (
          <FlatList
            data={gallery}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* Upload Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Upload New Photo</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={28} color="#000" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.uploadBox}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.previewImage}
                  />
                ) : (
                  <View style={styles.placeholder}>
                    <Icon name="image-plus" size={60} color="#01A449" />
                    <Text style={styles.placeholderText}>
                      Tap to Select Photo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 30 }}
                onPress={uploadImage}
                disabled={uploading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#00D65F', '#01823A']}
                  style={[styles.uploadBtn, uploading && { opacity: 0.7 }]}
                >
                  {uploading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.uploadText}>Upload Photo</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

// ========================= STYLES =========================

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#fff',
  },
  addService: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#777', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    width: width / 2 - 24,
    height: 200,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  imageName: { color: '#fff', fontWeight: '600', fontSize: 14 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  uploadBox: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#01A449',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 15, color: '#777', marginTop: 8 },
  previewImage: { width: '100%', height: '100%' },
  uploadBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  uploadText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
