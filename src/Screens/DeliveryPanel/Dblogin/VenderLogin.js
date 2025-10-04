import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import GradientButton from '../../../Component/GradientButton';

const { width } = Dimensions.get('window');

export default function VenderLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert('Validation', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://www.mandlamart.co.in/api/auth/send-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail }),
        },
      );

      const data = await response.json();
      console.log('Send OTP Response:', data);

      if (response.ok && data.success) {
        Alert.alert('Success', data.message || 'OTP sent successfully');
        navigation.navigate('OwnerOtp', { email: trimmedEmail });
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Network Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration Image */}
        <Image
          source={require('../../../assets/Login.png')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Hi, Delivery Partner</Text>

        {/* Subtitle */}
        <Text style={styles.subTitle}>
          Enter your email to receive a secure OTP.
        </Text>

        {/* Input */}
        <View style={{ marginBottom: 40 }}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {/* Button */}
        <GradientButton title="Continue" onPress={sendOtp} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 10,
    color: '#000',
  },
  subTitle: {
    fontSize: 14,
    color: 'black',
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 60,
    color: '#000',
  },
});
