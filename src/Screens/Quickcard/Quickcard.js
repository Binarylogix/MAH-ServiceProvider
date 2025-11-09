import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Quickcard({ label, icon, onPress }) {
  return (
    <Pressable style={styles.quickCard} onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={styles.quickLabel}>{label}</Text>
      </View>
      <View style={styles.quickIcon}>
        <FontAwesome name={icon} size={20} color="#0d0d0dff" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quickCard: {
    backgroundColor: '#fff',
    borderRadius: 13,
    flex: 1,
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  quickLabel: { color: '#2A2A2A', fontWeight: '500', fontSize: 13 },
  quickPlus: { color: '#bbb', fontSize: 19, fontWeight: 'bold', marginLeft: 9 },
  quickIcon: {
    // backgroundColor: '#00D65F',
    borderRadius: 50,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10,
  },
});
