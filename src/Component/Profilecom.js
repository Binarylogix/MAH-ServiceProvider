import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

const ProfileCom = ({ leftIcon, rightIcon, label, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      {/* Left Icon */}
      {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

      {/* Label and Description */}
      <View style={styles.textContainer}>
        <Text style={styles.itemLabel}>{label}</Text>
        {description ? (
          <Text style={styles.sectionDescription}>{description}</Text>
        ) : null}
      </View>

      {/* Right Icon */}
      {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f8f8f8',
    padding: width * 0.04,
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  iconRight: {
    marginLeft: 12,
  },
  itemLabel: {
    fontSize: width * 0.032,
    color: 'black',
  },
  sectionDescription: {
    fontSize: width * 0.03,
    color: 'gray',
    marginTop: 4,
  },
});

export default ProfileCom;
