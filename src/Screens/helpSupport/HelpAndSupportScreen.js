import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const HelpAndSupportScreen = () => {
  const handleEmail = () => {
    Linking.openURL('mailto:support@makeahabit.com');
  };

  const handleCall = () => {
    Linking.openURL('tel:+917701076001');
  };

  const handleFAQ = () => {
    // navigate to FAQ screen
    // navigation.navigate('FAQScreen');
  };

  return (
    <LinearGradient
      colors={['#e6f0c1ff', '#fbfffdff']}
      style={{ flex: 1, paddingTop: 20 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <HeaderLeft title={'Help & Support'} />
        {/* <Text style={styles.header}>Help & Support</Text> */}
        <Text style={styles.subHeader}>
          We are here to help! Choose one of the options below.
        </Text>

        {/* Contact via Email */}
        <TouchableOpacity style={styles.card} onPress={handleEmail}>
          <Icon name="mail" size={28} color="#01823A" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Email Support</Text>
            <Text style={styles.cardSubtitle}>support@makeahabit.com</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#A0A0A0"
          />
        </TouchableOpacity>

        {/* Contact via Call */}
        <TouchableOpacity style={styles.card} onPress={handleCall}>
          <Icon name="phone" size={28} color="#01823A" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Call Us</Text>
            <Text style={styles.cardSubtitle}>+91 7701076001</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#A0A0A0"
          />
        </TouchableOpacity>

        {/* Chat Support */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => alert('Chat support coming soon!')}
        >
          <Icon name="message-circle" size={28} color="#01823A" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Chat Support</Text>
            <Text style={styles.cardSubtitle}>Talk to our support team</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#A0A0A0"
          />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default HelpAndSupportScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#01823A',
    marginBottom: 6,
  },
  subHeader: {
    paddingHorizontal: width * 0.05,
    fontSize: width * 0.04,
    color: '#555',
    marginVertical: 10,
  },
  card: {
    marginHorizontal: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardText: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#000',
  },
  cardSubtitle: {
    fontSize: width * 0.03,
    color: '#777',
    marginTop: 2,
  },
});
