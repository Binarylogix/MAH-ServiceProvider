import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderLeft from '../../Component/Header/HeaderLeft';

const AddPhotos = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Pick image from gallery
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

  // ✅ Upload image to API
  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image to upload.');
      return;
    }

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
        Alert.alert('Success', 'Photo uploaded successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Upload Failed', response.data.message || 'Try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#e6f0c1ff', '#fbfffdff']}
      style={styles.container}
    >
      {/* ✅ Properly aligned header */}
      <View style={styles.headerRow}>
        <HeaderLeft title={'Add Photos'} />
      </View>

      <Text style={styles.header}>Upload New Photo</Text>

      {/* Image Preview Card */}
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Icon name="image-plus" size={60} color="#01A449" />
            <Text style={styles.placeholderText}>Tap to Select Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Upload Button */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={uploadImage}
        activeOpacity={0.8}
        disabled={uploading}
      >
        <LinearGradient
          colors={['#00D65F', '#01823A']}
          style={[styles.button, uploading && { opacity: 0.7 }]}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Upload Photo</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default AddPhotos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },

  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },

  uploadBox: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#01A449',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 3,
  },

  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
