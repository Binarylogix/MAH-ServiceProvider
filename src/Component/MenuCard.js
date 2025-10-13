import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MenuCard({ icon, label, onPress, highlight }) {
  return (
    <TouchableOpacity
      style={[styles.card, highlight && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftGroup}>
        <MaterialCommunityIcons
          name={icon}
          size={25}
          color={highlight ? '#e04444' : 'green'}
        />
        <Text style={[styles.label, highlight && { color: '#e04444' }]}>
          {label}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={25}
        color="#161616"
        style={{ opacity: highlight ? 0 : 1 }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 0.7,
    borderBottomColor: '#e7e8ec',
    justifyContent: 'space-between',
    paddingVertical: 17,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginLeft: 16,
    color: '#181818',
  },
});
