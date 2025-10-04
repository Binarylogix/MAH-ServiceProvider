import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const { width } = Dimensions.get('window');

const getIconComponent = type => {
  switch (type) {
    case 'FontAwesome':
      return FontAwesome;
    case 'MaterialIcons':
      return MaterialIcons;
    case 'AntDesign':
      return AntDesign;
    case 'Ionicons':
      return Ionicons;
    case 'Entypo':
      return Entypo;
    default:
      return FontAwesome;
  }
};

const BasketCom = ({
  label,
  description,
  extraDescription,
  leftIconName,
  leftIconType = 'FontAwesome',
  descriptionBgColor,
  extraBgColor,
}) => {
  const LeftIcon = getIconComponent(leftIconType);

  const descriptionTextColor = descriptionBgColor ? 'white' : 'black';
  const extraTextColor = extraBgColor ? 'white' : 'black';

  return (
    <View style={styles.item}>
      {leftIconName && (
        <LeftIcon
          name={leftIconName}
          size={width * 0.06}
          color="black"
          style={{ marginRight: 10 }}
        />
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.itemLabel}>{label}</Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
        >
          {description ? (
            <View
              style={[
                styles.descriptionWrapper,
                { backgroundColor: descriptionBgColor || 'transparent' },
              ]}
            >
              <Text
                style={[
                  styles.sectionDescription,
                  { color: descriptionTextColor },
                ]}
              >
                {description}
              </Text>
            </View>
          ) : null}

          {extraDescription ? (
            <View
              style={[
                styles.descriptionWrapper,
                { backgroundColor: extraBgColor || '#e0e0e0', marginLeft: 6 },
              ]}
            >
              <Text
                style={[styles.sectionDescription, { color: extraTextColor }]}
              >
                {extraDescription}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Right Icon */}
      <AntDesign name="right" size={25} color="#000" />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f8f8f8',
    padding: width * 0.04,
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: width * 0.038,
    color: 'black',
  },
  descriptionWrapper: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  sectionDescription: {
    fontSize: width * 0.033,
    fontWeight: '600',
    borderRadius: 6,
  },
});

export default BasketCom;
