import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HeaderLeft from '../../Component/Header/HeaderLeft';

const { width } = Dimensions.get('window');

const RateUsScreen = () => {
  const [rating, setRating] = useState(0); // Selected rating
  const [comment, setComment] = useState(''); // Optional comment

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert(
        'Rating required',
        'Please select a rating before submitting.',
      );
      return;
    }
    // You can send `rating` and `comment` to your backend here
    Alert.alert(
      'Thank You!',
      `You rated ${rating} stars.\nComment: ${comment}`,
    );
    setRating(0);
    setComment('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderLeft />
      <View style={styles.Viewcontainer}>
        <Text style={styles.header}>Rate Us</Text>
        <Text style={styles.subHeader}>How would you rate our app?</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
            >
              <FontAwesome
                name={star <= rating ? 'star' : 'star-o'}
                size={40}
                color="#175d12ff"
                style={{ marginHorizontal: 6 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.commentInput}
          placeholder="Leave a comment (optional)"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RateUsScreen;

const styles = StyleSheet.create({
  Viewcontainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  header: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: '#01823A',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: width * 0.04,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  commentInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#01823A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
