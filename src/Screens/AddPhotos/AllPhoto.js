import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from 'react-native-image-zoom-viewer';

const { width } = Dimensions.get('window');

export default function AllPhoto() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchGallery = async () => {
    try {
      const id = await AsyncStorage.getItem('vendorId');
      setLoading(true);
      const response = await axios.get(
        `https://www.makeahabit.com/api/v1/galary/get-by-vendor/${id}`,
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
                `https://www.makeahabit.com/api/v1/galary/delete/${imgId}`,
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

  // const updatePhoto = async imgId => {
  //   const result = await launchImageLibrary({
  //     mediaType: 'photo',
  //     quality: 0.8,
  //   });
  //   if (result.didCancel) return;
  //   if (result.errorCode) {
  //     Alert.alert('Error', 'Something went wrong while selecting image.');
  //     return;
  //   }
  //   const newImage = result.assets[0];
  //   const token = await AsyncStorage.getItem('vendorToken');
  //   const formData = new FormData();
  //   formData.append('img', {
  //     uri: newImage.uri,
  //     type: newImage.type,
  //     name: newImage.fileName || 'updated-photo.jpg',
  //   });
  //   try {
  //     console.log(imgId);
  //     setUploading(true);
  //     const response = await axios.put(
  //       `https://www.makeahabit.com/api/v1/galary/update/${imgId}`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     if (response.data.success) {
  //       Alert.alert('Updated', 'Photo updated successfully!');
  //       fetchGallery();
  //     } else {
  //       Alert.alert('Update Failed', response.data.message || 'Try again.');
  //     }
  //   } catch (error) {
  //     console.error('Update error:', error);
  //     Alert.alert('Error', 'Something went wrong while updating photo.');
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const openZoom = idx => {
    setZoomIndex(idx);
    setZoomVisible(true);
  };

  const renderItem = ({ item, index }) => {
    const imageUrl = `https://www.makeahabit.com/api/v1/uploads/galary/${item.img}`;
    return (
      <Pressable onPress={() => openZoom(index)} style={styles.cardWrapper}>
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Delete Button at Top-Right */}
          <TouchableOpacity
            onPress={() => deletePhoto(item._id)}
            style={styles.deleteBtnTopRight}
          >
            <Icon name="delete" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Overlay removed as image name is not needed */}
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={['#e6f0c1', '#fbfffd']} style={{ flex: 1 }}>
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
          <>
            <FlatList
              data={gallery}
              keyExtractor={item => item._id}
              renderItem={renderItem}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />

            <Modal
              visible={zoomVisible}
              transparent={true}
              onRequestClose={() => setZoomVisible(false)}
            >
              <ImageViewer
                imageUrls={gallery.map(item => ({
                  url: `https://www.makeahabit.com/api/v1/uploads/galary/${item.img}`,
                }))}
                index={zoomIndex}
                enableSwipeDown
                onSwipeDown={() => setZoomVisible(false)}
                backgroundColor="#000"
                onCancel={() => setZoomVisible(false)}
                enablePreload
                renderIndicator={(currentIndex, allSize) => (
                  <View style={styles.indicator}>
                    <Text style={styles.indicatorText}>
                      {currentIndex} / {allSize}
                    </Text>
                  </View>
                )}
              />
            </Modal>
          </>
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
  cardWrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    width: width / 2 - 24,
    height: 210,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1 }],
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#00D65F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 0.98 }],
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.62)',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  imageName: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
    paddingHorizontal: 6,
  },
  editBtn: {
    backgroundColor: '#00D65F',
    borderRadius: 8,
    padding: 7,
    marginRight: 7,
    elevation: 3,
    shadowColor: '#00D65F',
    shadowRadius: 2,
  },
  deleteBtnTopRight: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 7,
    elevation: 3,
    shadowColor: '#ff4444',
    shadowRadius: 2,
  },

  // deleteBtn: {
  //   backgroundColor: '#ff4444',
  //   borderRadius: 8,
  //   padding: 7,
  //   elevation: 3,
  //   shadowColor: '#ff4444',
  //   shadowRadius: 2,
  // },
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
  indicator: {
    position: 'absolute',
    top: 40,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  indicatorText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
