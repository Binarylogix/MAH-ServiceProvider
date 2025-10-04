// screens/OwnerOtpIndex.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
   Image,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function OwnerOtpIndex({ navigation, route }) {
  const { email = '' } = route.params || {};
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  const otpValue = otp.join('');

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // OTP input change
  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit.slice(-1);
    setOtp(newOtp);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Backspace handler
  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // Verify OTP function
  const verifyOtp = async () => {
    if (otpValue.length < 6) {
      Alert.alert('Validation', 'Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://www.mandlamart.co.in/api/auth/verify-otp/deliveryPerson',
        { email, otp: otpValue },
        { headers: { 'Content-Type': 'application/json' } }
      );

       console.log("API Response:", response.data);        
  
   
      if (response.data?.token) {
  // ✅ User ke paas token mila → OrderScreen
  await AsyncStorage.multiSet([
    ['userToken', response.data.token],
    ['userEmail', email],
  ]);

  navigation.reset({ index: 0, routes: [{ name: 'OderScreen' }] });
} 
else if (response.data?.data === null) {
  // ✅ Jab data null ho → AdminControl screen pe le jao
  navigation.reset({
    index: 0,
    routes: [{ name: 'AdminControl', params: { email } }],
  });
} 
else {
  // ❌ Invalid OTP or error message
  Alert.alert('Error', response.data?.message || 'Invalid OTP');
}

    } catch (error) {
      console.log('Verify OTP Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Network error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP function
  const resendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post(
        'https://www.mandlamart.co.in/api/auth/send-otp',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setTimer(60);
        setOtp(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.log('Resend OTP Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Image
                source={require('../../../assets/Logo/logo2.png')}
                style={styles.logoimage}
                resizeMode="contain"
              /> */}
              <Image
                source={require('../../../assets/Logo/shop.png')}
                style={styles.image}
                resizeMode="contain"
              />
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subText}>Enter the 6-digit code sent to your email</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <View style={styles.timerContainer}>
        {timer > 0 ? (
          <Text style={styles.timerText}>Resend code in ⏱ {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={resendOtp} disabled={resendLoading}>
            {resendLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.resendText}>Resend Code</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={verifyOtp}
        disabled={loading}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={['#00D65F', '#01823A']}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirm</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: width * 0.05, backgroundColor: '#fff' },
  title: { fontSize: width * 0.06, fontWeight: 'bold', marginBottom: 10 },
  subText: { color: '#888', fontSize: width * 0.04, marginBottom: 20, textAlign: 'center' },
//  logoimage: { width: 200, height: 40, alignSelf: 'center' },
  image: { width: 250, height: 120, alignSelf: 'center', marginBottom: 20 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  otpInput: { flex: 1, height: width * 0.14, marginHorizontal: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, textAlign: 'center', fontSize: width * 0.05, fontWeight: 'bold' },
  timerContainer: { marginBottom: 20, alignItems: 'center' },
  timerText: { color: '#555', fontSize: width * 0.04 },
  resendText: { color: '#fd5858ff', fontSize: width * 0.045, fontWeight: 'bold' },
  buttonWrapper: { width: '100%'},
  gradientButton: { paddingVertical: width * 0.045, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: width * 0.045, fontWeight: 'bold' },
});
