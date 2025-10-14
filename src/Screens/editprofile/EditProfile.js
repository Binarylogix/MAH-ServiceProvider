import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderLeft from '../../Component/Header/HeaderLeft';

const defaultProfileImg = {
  uri: 'https://randomuser.me/api/portraits/men/1.jpg',
};

export default function EditProfile() {
  const [profileImage, setProfileImage] = useState(defaultProfileImg);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState(''); // new address field

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    // Replace with your API logic
    Alert.alert('Success', 'Profile updated successfully!');
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
        <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
          <MaterialCommunityIcons name="camera" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>Update your account information</Text>
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
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSave}
        style={{ marginTop: 30 }}
      >
        <LinearGradient
          colors={['#00D65F', '#01823A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveBtn}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fa', padding: 16 },

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
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00D65F',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  title: { fontSize: 22, fontWeight: '700', color: '#111', marginTop: 10 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },

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

  saveBtn: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
