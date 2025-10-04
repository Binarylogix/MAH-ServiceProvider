import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
export default function BorderCom({ title }) {
  return (
    <LinearGradient
      colors={['#EC4E31', '#40196C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBorder}
    >
      <TouchableOpacity style={styles.innerContainer}>
        <Icon name="location-dot" size={18} color="#40196C" />

        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 12,
    padding: 2,
    margin: 14,
    alignSelf: 'flex-start',
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 132,
    height: 34,
  },
  buttonText: {
    color: '#40196C',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  buttonImage: {
    width: 16,
    height: 16,
    // resizeMode: '',
  },
});
