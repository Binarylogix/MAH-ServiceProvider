import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDetails } from '../../redux/Vendor/vendorDetailsSlice';

const defaultProfileImg = {
  uri: 'https://randomuser.me/api/portraits/men/1.jpg',
};

export default function EditProfile() {
  const [profileImage, setProfileImage] = useState(defaultProfileImg);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { vendor } = useSelector(state => state.vendorDetails);

  // Fetch vendor details when component mounts
  useEffect(() => {
    dispatch(fetchVendorDetails());
  }, [dispatch]);

  // Populate form when Redux vendor data is ready
  useEffect(() => {
    if (vendor?.data) {
      const v = vendor?.data;
      setFullName(v?.fullName || '');
      setEmail(v?.email || '');
      setMobile(v?.mobileNumber || '');
      setGender(v?.gender || '');

      if (v?.businessCard) {
        setProfileImage({
          uri: `https://www.makeahabit.com/api/v1/uploads/business/${v?.businessCard}`,
        });
      }
    }
  }, [vendor]);

  // Image Picker
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  // Handle Save (Update API)
  const handleSave = async () => {
    try {
      setLoading(true);
      const vendorId = await AsyncStorage.getItem('vendorId');
      const token = await AsyncStorage.getItem('vendorToken');
      console.log(token);
      if (!vendorId || !token) {
        Alert.alert('Error', 'Missing vendor credentials.');
        return;
      }

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('mobileNumber', mobile);
      formData.append('gender', gender);

      if (profileImage.uri && !profileImage.uri.includes('randomuser')) {
        formData.append('profileImage', {
          uri: profileImage.uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
      }
      console.log(formData);
      const res = await axios.put(
        `https://www.makeahabit.com/api/v1/auth/update-business-profile-byId/${vendorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('updated', res.data);
      if (res.data?.success) {
        Alert.alert('Success', 'Profile updated successfully!');
        dispatch(fetchVendorDetails()); // 🔁 Refresh Redux data
      } else {
        Alert.alert('Error', res.data?.message || 'Update failed');
      }
    } catch (err) {
      console.log('Update error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 36 }}
    >
      <HeaderLeft title={'Edit Profile'} />

      {/* Profile Image Card */}
      <View style={styles.avatarCard}>
        <Image source={profileImage} style={styles.avatar} />

        {/* Camera button BELOW avatar */}
        <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
          <MaterialCommunityIcons name="camera" size={22} color="#fff" />
          <Text style={styles.cameraText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.inputCard}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f3f3f3', color: '#777' }]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        {/* Gender Field */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {['Male', 'Female', 'Other'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderOption,
                gender === option && styles.genderSelected,
              ]}
              onPress={() => setGender(option)}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === option && styles.genderTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSave}
        disabled={loading}
        style={{ marginTop: 30 }}
      >
        <LinearGradient
          colors={['#00D65F', '#01823A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveBtn}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f0c1ff', padding: 16 },

  avatarCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },

  avatar: { width: 110, height: 110, borderRadius: 55, marginBottom: 12 },

  cameraBtn: {
    marginTop: 10,
    backgroundColor: '#00D65F',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },

  label: { fontSize: 14, color: '#777', marginBottom: 6, marginTop: 12 },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e7e8ec',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fdfdfd',
  },

  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  genderOption: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#00D65F',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: '#00D65F',
  },
  genderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00D65F',
  },
  genderTextSelected: {
    color: '#fff',
  },

  saveBtn: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
