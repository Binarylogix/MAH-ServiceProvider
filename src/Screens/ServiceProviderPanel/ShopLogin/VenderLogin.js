import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import GradientButton from '../../../Component/GradientButton';
// import AwesomeAlert from 'react-native-awesome-alerts';

const { width } = Dimensions.get('window');

export default function VenderLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const sendOtp = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAlertMessage('Please enter your email');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://www.makeahabit.com/api/v1/newauth/send-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail }),
        },
      );

      const data = await response.json();
      console.log('Send OTP Response:', data);

      if (response.ok && data.success) {
        setAlertMessage(data.message || 'OTP sent successfully');
        setShowAlert(true);
        // Navigate after a short delay so user sees alert
        setTimeout(() => {
          setShowAlert(false);
          navigation.navigate('OwnerOtpIndex', { email: trimmedEmail });
        }, 1500);
      } else {
        setAlertMessage(data.message || 'Failed to send OTP');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage('Network Error: ' + error.message);
      setShowAlert(true);
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
        <Image
          source={require('../../../assets/Logo/logo2.png')}
          style={styles.logoimage}
          resizeMode="contain"
        />
        <Image
          source={require('../../../assets/Logo/shop.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Hi, Service Partner</Text>
        <Text style={styles.subTitle}>
          Enter your business email to receive a secure OTP.
        </Text>

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

        <GradientButton title="Continue" onPress={sendOtp} loading={loading} />
      </ScrollView>

      {/* Sweet Alert */}
      {/* <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Notification"
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#40196C"
        onConfirmPressed={() => setShowAlert(false)}
      /> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logoimage: { width: 250, height: 40, alignSelf: 'center' },
  image: { width: 250, height: 250, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10, color: '#000' },
  subTitle: { fontSize: 14, color: 'black', marginBottom: 25 },
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
