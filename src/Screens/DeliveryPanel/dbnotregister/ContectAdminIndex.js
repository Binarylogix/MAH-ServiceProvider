import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function ContectAdminIndex() {
  const handleContactPress = async () => {
    const url = 'https://www.mandlamart.co.in/#contact';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', "Can't open this URL: " + url);
      }
    } catch (err) {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon name="account-alert" size={60} color="#FF6B4A" />
        </View>

        <Text style={styles.title}>Contact Admin</Text>

        <Text style={styles.subText}>
          We couldn't find an account with this email address. Please contact
          our support team and we'll help you resolve it quickly.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonWrapper}
          onPress={handleContactPress}
        >
          <LinearGradient
            colors={['#4d1b54ff', '#d3483fff']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Contact Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.helpText}>📧 support@mandlamart.co.in</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: width * 0.05,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  iconContainer: {
    backgroundColor: '#FFEDE7',
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    color: '#555',
    fontSize: width * 0.042,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 20,
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
  helpText: {
    fontSize: width * 0.038,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
});
