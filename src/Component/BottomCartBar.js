import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import ViewBasket from '../Component/ViewBasket';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomCartBar = ({ productId, value, unit, price, originalPrice }) => {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  const [cartData, setCartData] = useState([]);

  // ✅ Fetch existing cart quantity when component mounts
  useEffect(() => {
    const fetchCartQuantity = async () => {
      const API_TOKEN = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      try {
        const response = await axios.get(
          `https://www.mandlamart.co.in/api/cart/${userId}/${productId}`,
          {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
          },
        );

        console.log('FetchCart API Response:', response.data);

        if (response?.data?.quantity === 0) {
          const requestBody = { userId, productId };
          const res = await axios.delete(
            'https://www.mandlamart.co.in/api/cart/removeCart',
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              data: requestBody, // 👈 correct way to send body in DELETE
            },
          );
        } else {
          setQuantity(response?.data?.quantity);
        }
      } catch (error) {
        console.log('Error fetching cart quantity:', error.message);
      }
    };

    fetchCartQuantity();
  }, [productId, quantity]);

  // ✅ Add to Cart API
  const updateCartAPI = async newQuantity => {
    const userId = await AsyncStorage.getItem('userId');
    const API_TOKEN = await AsyncStorage.getItem('userToken');
    const requestBody = { userId, productId };

    try {
      setLoading(true);
      const response = await axios.post(
        'https://www.mandlamart.co.in/api/cart/addToCart',
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('API Response:', response.data);

      if (response.data?.cart) {
        setCartData(response.data.cart);

        const productInCart = response.data.cart.items.find(
          item => item.productId === productId,
        );

        if (productInCart) {
          setQuantity(productInCart.quantity);
          setShowCartOverlay(true);
        } else {
          setQuantity(0);
          setShowCartOverlay(false);
        }

        Alert.alert('Success', response.data.message);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update cart');
      }
    } catch (error) {
      console.log('API error:', error.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong while updating cart');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove from Cart API
  // ✅ Remove from Cart API (send quantity -1)
  const handleRemove = async () => {
    if (quantity === 0) return;

    const userId = await AsyncStorage.getItem('userId');
    const API_TOKEN = await AsyncStorage.getItem('userToken');
    const newQuantity = quantity - 1; // 👈 ek kam quantity
    const requestBody = { userId, productId, quantity: newQuantity };

    try {
      setLoading(true);
      const response = await axios.put(
        'https://www.mandlamart.co.in/api/cart/updateCartItem',
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Remove API Response:', response.data);

      if (response.data?.cart) {
        setCartData(response.data.cart);

        const productInCart = response.data.cart.items.find(
          item => item.productId === productId,
        );

        if (productInCart) {
          setQuantity(productInCart.quantity);
          setShowCartOverlay(true);
        } else {
          setQuantity(0);
          setShowCartOverlay(false);
        }
      } else {
        Alert.alert('Error', response.data.message || 'Failed to remove item');
      }
    } catch (error) {
      console.log('Remove API error:', error.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong while removing item');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add quantity
  const handleAdd = async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    await updateCartAPI(newQuantity);
    if (!showCartOverlay) setShowCartOverlay(true);
  };

  return (
    <>
      <View style={styles.BottomButtonCont}>
        {/* Product Info */}
        <View style={{ paddingLeft: 5 }}>
          <Text style={styles.BottomValue}>
            {value} {unit}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.BottomPrice}>₹{price * (quantity || 1)}</Text>
            <Text style={styles.OriginalPrice}>
              ₹{originalPrice * (quantity || 1)}
            </Text>
          </View>
        </View>

        {/* Add to Cart / Quantity Selector */}
        {quantity === 0 ? (
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={handleAdd}
            disabled={loading}
          >
            <LinearGradient
              colors={['#EC4E31', '#40196C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBtn}
            >
              <Text style={styles.editProfileText}>
                {loading ? 'Adding...' : 'Add to Cart'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <LinearGradient
            colors={['#EC4E31', '#40196C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <View style={styles.quantityContainer}>
              {/* 👇 Minus Button calls handleRemove */}
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={handleRemove}
                disabled={loading}
              >
                <Icon name="remove" size={20} color="#fff" />
              </TouchableOpacity>

              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyNumber}>{quantity}</Text>
              </View>

              {/* 👇 Plus Button calls handleAdd */}
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={handleAdd}
                disabled={loading}
              >
                <Icon name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
      </View>

      {/* Mini Cart Overlay */}
    </>
  );
};

const styles = StyleSheet.create({
  BottomButtonCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: '#d1e1f8ff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  BottomValue: { fontSize: 12, fontWeight: '500', color: '#000' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  BottomPrice: { fontSize: 16, fontWeight: '700', color: '#000' },
  OriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  editProfileBtn: { borderRadius: 10, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 40 },
  editProfileText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'center',
  },
  qtyBtn: { justifyContent: 'center', alignItems: 'center' },
  qtyDisplay: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNumber: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cartOverlay: {
    position: 'absolute',
    bottom: 60,
    left: '20%',
    width: '60%',
    padding: 15,
    borderRadius: 10,
  },
  cartText: { fontSize: 14, fontWeight: 'bold' },
});

export default BottomCartBar;
