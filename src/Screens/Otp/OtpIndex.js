import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

const { width } = Dimensions.get('window');

export default function OtpIndex({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // ✅ Timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const otpValue = otp.join('');

  // ✅ Verify OTP
  const verifyOtp = async () => {
    if (!otpValue.trim() || otpValue.length < 6) {
      Alert.alert('Validation', 'Please enter 6 digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://www.mandlamart.co.in/api/auth/verify-otp/user',
        {
          email,
          otp: otpValue,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      console.log('Verify OTP Response:', response.data);

      if (response.status === 200) {
        const token = response.data?.token;
        const userId = response.data?.data?._id; // ✅ Correct userId retrieval

        // Save email
        await AsyncStorage.setItem('userEmail', email);

        if (response.data?.role === 'user') {
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userId', userId);
        }

        console.log('otpindex token : ', token);
        console.log('otpindex userId : ', userId);

        showMessage({
          message: 'Success!',
          description: response.data.message || 'OTP Verified Successfully',
          type: 'success',
          icon: 'success',
          floating: true,
          duration: 3500,
          animated: true,
          style: {
            borderRadius: 15,
            paddingVertical: 18,
            paddingHorizontal: 20,
            shadowColor: '#28a745',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 8,
            backgroundColor: '#28a745', // green success color
          },
          titleStyle: { fontWeight: 'bold', fontSize: 16, color: '#fff' },
          textStyle: { fontSize: 14, color: '#fff' },
        });

        // ✅ Role-based navigation
        if (response.data?.role === 'guest') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'CreateUserProfile' }],
          });
        } else if (response.data?.role === 'user') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabScreen' }],
          });
        }
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.log('Axios Error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Network Error: ' + error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP
  const resendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(
        'https://www.mandlamart.co.in/api/auth/send-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();
      console.log('Resend OTP Response:', data);

      if (response.ok && (data.success === true || data.success === 'true')) {
        Alert.alert('OTP Sent', data.message || 'New OTP sent to your email');
        setTimer(60);
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Network Error: ' + error.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleChange = (text, index) => {
    if (text.length === 6) {
      const otpArray = text.split('').slice(0, 6);
      setOtp(otpArray);
      inputRefs.current[5]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/customer.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subText}>
        We have sent 6 digit verification code {email}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <View style={styles.timerContainer}>
        {timer > 0 ? (
          <Text style={styles.timerText}>Didn’t receive code? ⏱ {timer}s</Text>
        ) : (
          <TouchableOpacity
            style={styles.resendButton}
            onPress={resendOtp}
            disabled={resendLoading}
          >
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
        style={{ width: '100%', marginTop: 30 }}
      >
        <LinearGradient
          colors={['#00D65F', '#00D65F']}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 10,
  },
   image: { width: 250, height: 120, alignSelf: 'center', marginBottom: 20 },
  subText: {
    color: '#888',
    fontSize: width * 0.04,
    marginBottom: 20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    flex: 1,
    height: width * 0.14,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  timerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  timerText: {
    color: '#555',
    fontSize: width * 0.04,
  },
  resendButton: {
    marginTop: 10,
  },
  resendText: {
    color: '#f63d3dff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  gradientButton: {
    paddingVertical: width * 0.045,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});
