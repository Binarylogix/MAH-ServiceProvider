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
    (async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) setEmail(storedEmail);
    })();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your gallery to upload your photo',
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
    const permission = await requestPermission();
    if (!permission) return;

    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Unable to open gallery');
        return;
      }
      const uri = response.assets?.[0]?.uri;
      if (uri) setProfileImage(uri);
    });
  };

  const createProfile = async () => {
    if (!name.trim()) return Alert.alert('Validation', 'Full Name is required');
    if (!gender) return Alert.alert('Validation', 'Please select Gender');
    if (!/^\d{10}$/.test(mobile))
      return Alert.alert('Validation', 'Enter a valid 10-digit mobile number');

    setLoading(true);
    try {
      const body = {
        fullName: name,
        email,
        phone: mobile,
        gender,
        role: 'user',
        address,
        userprofileImage: profileImage || null,
      };

      const res = await axios.post(
        'https://www.mandlamart.co.in/api/users/completeUserProfile',
        body,
        { headers: { 'Content-Type': 'application/json' } },
      );

      Alert.alert('Success', res.data?.msg || 'Profile created successfully!');

      if (res.data?.user?._id)
        await AsyncStorage.setItem('userId', res.data.user._id);
      if (res.data?.token)
        await AsyncStorage.setItem('userToken', res.data.token);

      navigation.navigate('TabScreen');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Profile creation failed';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <LinearGradient colors={['#01823A', '#00D65F']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Profile</Text>
        </LinearGradient>

        {/* Form Card */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.imageWrapper} onPress={selectProfileImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Icon name="user" size={36} color="#aaa" />
                <Text style={{ color: '#888', marginTop: 6 }}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

             <TextInput
            style={[styles.input, { backgroundColor: '#f5f5f5' }]}
            value={email}
            editable={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />


          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="number-pad"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
          />

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

           <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />

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
  container: {
    // flexGrow: 1,
    // paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    height: 150,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    // marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginTop: -40,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  imageWrapper: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  image: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#01823A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
