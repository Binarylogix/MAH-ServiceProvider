import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
const PRODUCT_IMAGE = require('../assets/salt.png');

export default function ViewBasket({
  quantity,
  unit,
  productImages = [],
  cartData,
  onPress, // navigation callback passed from parent
}) {
  // Use up to 5 images, fill with fallback if less
  const images = productImages.length
    ? productImages.slice(0, 5)
    : Array(5).fill(PRODUCT_IMAGE);

  return (
    <TouchableOpacity onPress={onPress} style={{ margin: 1 }}>
      <LinearGradient
        colors={['#ea5c30', '#7243b7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cartBox}
      >
        {/* Optional images */}
        {/* <View style={styles.imagesArea}>
          {images.map((imgSrc, idx) => (
            <View
              key={idx}
              style={[styles.imageCircle, { left: idx * 12, zIndex: images.length - idx }]}
            >
              <Image source={imgSrc} style={styles.img} resizeMode="contain" />
            </View>
          ))}
        </View> */}
        <View style={styles.vertDivider} />
        <View style={styles.rightContent}>
          <Text style={styles.title}>View Basket</Text>
          <View style={styles.cartIconWrap}>
            <Icon name="shopping-cart" size={26} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{quantity}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 40,
    height: 45,
    width: 180,

    elevation: 1,
    shadowColor: '#000',
    paddingHorizontal: 2,
  },
  imagesArea: {
    flexDirection: 'row',
    position: 'relative',
    height: 60,
    alignItems: 'center',
  },
  imageCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#eee',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: { width: 28, height: 28 },
  vertDivider: {
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 12,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    marginRight: 18,
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cartIconWrap: {
    position: 'relative',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -5,
    backgroundColor: '#42c550',
    borderRadius: 9,
    minWidth: 17,
    minHeight: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    zIndex: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
});
