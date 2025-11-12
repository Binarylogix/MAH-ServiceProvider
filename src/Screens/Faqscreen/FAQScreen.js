import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import LinearGradient from 'react-native-linear-gradient';

// Demo FAQ data
const demoFAQs = [
  {
    id: '1',
    question: 'What is Make a Habit?',
    answer:
      'Make a Habit is a digital platform (available as a website and mobile app) that connects users with trusted and verified local service professionals for a wide range of personal and home services.',
  },
  {
    id: '2',
    question: 'How do I book an appointment?',
    answer:
      'You can book an appointment by selecting a service and choosing a suitable date and time from the app.',
  },
  {
    id: '3',
    question: 'Is Make a Habit available in my city?',
    answer:
      'We are expanding rapidly across India. You can check availability by entering your pin code or location on our app or website.',
  },
  {
    id: '4',
    question: 'Can I choose the service provider?',
    answer:
      'We assign verified professionals based on your location, availability, and service category. All providers are trained and background-verified for your safety.',
  },
  {
    id: '5',
    question: 'I’m a service professional. How can I join Make a Habit?',
    answer:
      'If you are a skilled professional or run a service business, you can apply to partner with us at www.makeahabit.com/join or contact our onboarding team.',
  },
  {
    id: '6',
    question: 'Are there any discounts available?',
    answer:
      "Head to the 'Offers' section in the app to view current deals and discounts.",
  },
  {
    id: '7',
    question: 'Can I cancel or reschedule my booking?',
    answer:
      'Yes, bookings can be cancelled or rescheduled up to 2 hours before the scheduled time through the app or website.',
  },
  {
    id: '8',
    question: 'How do I contact customer support?',
    answer:
      'Use the Contact Us form in the app or email us anytime at support@makeahabit.com.',
  },
  {
    id: '9',
    question: 'How do refunds work?',
    answer:
      'Refunds (if applicable) are processed within 3–5 working days to your original payment method.',
  },
  {
    id: '10',
    question: 'Is my payment secure?',
    answer:
      'Absolutely! All transactions are securely processed via trusted payment gateways.',
  },
];

const FAQItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const initialValue = expanded ? 1 : 0;
    const finalValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    Animated.timing(animation, {
      toValue: finalValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, null], // auto height
  });

  return (
    <View style={styles.faqCard}>
      <TouchableOpacity style={styles.questionRow} onPress={toggleExpand}>
        <Text style={styles.questionText}>{item.question}</Text>
        <Icon
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color="#4CAF50"
        />
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={{ overflow: 'hidden', paddingTop: 8 }}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const FAQScreen = () => {
  return (
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <HeaderLeft />
        <Text style={styles.header}>Frequently Asked Questions</Text>

        {demoFAQs.map(item => (
          <FAQItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 13,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  answerText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});
