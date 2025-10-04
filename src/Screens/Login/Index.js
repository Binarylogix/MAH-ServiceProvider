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
import GradientButton from '../../Component/GradientButton';
import FlashMessage from 'react-native-flash-message';
import { showMessage } from "react-native-flash-message";

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
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
        // Alert.alert('Success', data.message || 'OTP sent successfully');
  showMessage({
  message: "Success!",
  description: "OTP sent successfully",
  type: "success",
  icon: "success",
  floating: true,
  duration: 3500,
  animated: true,
  style: {
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
    backgroundColor: "#28a745", // green
  },
  titleStyle: { fontWeight: "bold", fontSize: 16, color: "#fff" },
  textStyle: { fontSize: 14, color: "#fff" },
});

        navigation.navigate('OtpScreen', { email: trimmedEmail });
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
    // <KeyboardAvoidingView
    //   style={styles.container}
    //   behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    // >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration Image */}
        <Image
          source={require('../../assets/Logo/logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Image
                  source={require('../../assets/Logo/customer.png')}
                  style={styles.Cusimage}
                  resizeMode="contain"
                />

        {/* Title */}
        <Text style={styles.title}>Hi, User</Text>

        {/* Subtitle */}
        <Text style={styles.subTitle}>
          Use your email to receive a secure OTP.
        </Text>

        {/* Input */}
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#828080ff"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {/* Button */}
        <GradientButton title="Continue" onPress={sendOtp} loading={loading} />
      </ScrollView>
    // </KeyboardAvoidingView>
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
    width: 280,
    height: 150,
    alignSelf: 'center',
  },
  Cusimage: {
    width: 150,
    height:150,
    alignSelf: 'center',},
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
    borderColor: '#b8b7b7ff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 14,
    marginBottom: 60,
    color: '#000',
  },

});
