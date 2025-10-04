import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions } from 'react-native';

const SIZES = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const COLORS = {
  primary: '#18A558',
  black: '#181818',
  white: '#fff',
};

const HeaderLeft = ({
  touchStyle,
  onPress,
  title,
  mainStyle,
  type,
  icon, // icon can be a string emoji or left blank for arrow
}) => {
  return (
    <View style={[
      styles.row,
      mainStyle,
      type === "withoutHeader" && styles.withoutHeader
    ]}>
      <TouchableOpacity
        style={[styles.btn, touchStyle, styles.elevatedBtn]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.iconStyle}>{icon ? icon : '←'}</Text>
      </TouchableOpacity>
      {title ? (
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      ) : null}
    </View>
  );
};

HeaderLeft.defaultProps = {
  icon: '←',
  onPress: () => {}, // default: do nothing, override as needed
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: '#eaf4ebff',
    borderRadius: 24,
    paddingRight: 18,
    paddingLeft: 4,
    paddingVertical: 5,
    shadowColor: '#18A558',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 2,
  },
  withoutHeader: {
    position: 'absolute',
    top: SIZES.height * 0.02,
    left: 0,
  },
  btn: {
    width: SIZES.width * 0.085,
    height: SIZES.width * 0.085,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: COLORS.white,
    marginRight: 2,
  },
  elevatedBtn: {
    elevation: 5,
    shadowColor: '#61ba79',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 2 },
  },
  iconStyle: {
    fontSize: SIZES.width * 0.07,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  title: {
    fontSize: SIZES.width * 0.05,
    color: COLORS.primary,
    marginBottom: -4,
    paddingHorizontal: 14,
    fontWeight: 'bold',
    letterSpacing: 0.1,
    flexShrink: 1,
  },
});

export default HeaderLeft;
