import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


const SIZES = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const COLORS = {
  primary: 'black',
  black: '#181818',
  white: '#fff',
};

const HeaderLeft = ({
  touchStyle,
  onPress,
  title,
  mainStyle,
  type,
}) => {
  const navigation = useNavigation();

  // ✅ Default to navigation.goBack() if no custom press is provided
  const handlePress = onPress ? onPress : () => navigation.goBack();

  return (
    <View
      style={[
        styles.row,
        mainStyle,
        type === 'withoutHeader' && styles.withoutHeader,
      ]}
    >
      <TouchableOpacity
        style={[styles.btn, touchStyle, styles.elevatedBtn]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
<FontAwesome6 name="arrow-left-long" style={styles.iconStyle} size={20} color="#000" />
          {/* <Text style={styles.iconStyle}>{icon || ''}</Text> */}
        </View>
      </TouchableOpacity>

      {title ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : null}
    </View>
  );
};

HeaderLeft.defaultProps = {
  icon: '←',
  onPress: null,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    paddingRight: 18,
    paddingLeft: 4,
    paddingVertical: 5,
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
    borderRadius: 50,
    backgroundColor: COLORS.white,
    marginRight: 4,
  },

  elevatedBtn: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 5,
      },
    }),
  },

  iconContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconStyle: {
    // fontSize: SIZES.width * 0.06,
    color: COLORS.primary,
    fontWeight: '600',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },

  title: {
    fontSize: SIZES.width * 0.045,
    color: COLORS.primary,
    paddingHorizontal: 14,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
});

export default HeaderLeft;
