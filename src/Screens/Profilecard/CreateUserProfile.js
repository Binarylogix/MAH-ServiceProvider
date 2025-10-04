import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome6';

export default function CreateUserProfile({ navigation }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      setEmail(storedEmail);
    };
    fetchEmail();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your photos to upload profile image',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const selectProfileImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to select image');
        return;
      }
      const uri = response.assets[0].uri;
      setProfileImage(uri);
    });
  };

  const createProfile = async () => {
    if (!name.trim()) return Alert.alert('Validation', 'Full Name is required');
    if (!gender) return Alert.alert('Validation', 'Select Gender');
    if (!/^\d{10}$/.test(mobile))
      return Alert.alert('Validation', 'Enter valid 10-digit mobile number');

    setLoading(true);
    try {
      const body = {
        fullName: name,
        email: email,
        phone: mobile,
        gender: gender,
        role: 'user',
        address: address,
        userprofileImage: profileImage || null,
      };

      const res = await axios.post(
        'https://www.mandlamart.co.in/api/users/completeUserProfile',
        body,
        { headers: { 'Content-Type': 'application/json' } },
      );

      // === Handle Success === //
      Alert.alert('Success', res.data?.msg || 'Profile created!');

      if (res.data?.user?._id) {
        await AsyncStorage.setItem('userId', res.data.user._id);
      }
      console.log(res.data.user._id);

      if (res.data?.token) {
        await AsyncStorage.setItem('userToken', res.data.token);
      }
      console.log(res.data.token);

      navigation.navigate('TabScreen');
    } catch (e) {
      const msg = e.response?.data?.msg || e.message || 'Profile update error';
      console.log('Profile update error:', msg);
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Scrollable Content */}
      <ScrollView
        // contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Header (fixed) */}
        <LinearGradient colors={['#40196C', '#6b3db8']} style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#fff" />
            <Text style={styles.headerText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.card}>
          {/* Profile Image */}
          <TouchableOpacity
            style={styles.imageWrapper}
            onPress={selectProfileImage}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: '#888' }}>Select Image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Full Name */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          {/* Gender Dropdown */}
          <Dropdown
            style={styles.input}
            data={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Gender"
            value={gender}
            onChange={item => setGender(item.value)}
          />

          {/* Address */}
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />

          {/* Email (read-only) */}
          <TextInput style={styles.input} value={email} editable={false} />

          {/* Mobile */}
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobile}
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={setMobile}
          />

          {/* Update Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={createProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
    height: 180,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
  },

  card: {
    marginTop: -60, // overlap on header
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    marginLeft: 20,
  },
  imageWrapper: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', borderRadius: 55 },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 55,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#40196C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
