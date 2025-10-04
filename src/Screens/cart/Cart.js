import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BasketCom from '../../Component/BasketCom';
import { useFocusEffect } from '@react-navigation/native';

export default function Cart({ navigation }) {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);

  // This function fetches cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');

      if (!userId || !token) return;

      const res = await axios.get(
        `https://www.mandlamart.co.in/api/cart/getAllCart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      setCartData(res.data);
    } catch (err) {
      console.log('❌ Axios error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect runs every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, []),
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#a70042" />
      </View>
    );
  }

  const deliveryFee = cartData?.deliveryFee ?? 39;
  const discount = cartData?.discount ?? 0;
  const subtotal = cartData?.totalAmount ?? 0;
  const totalPrice = subtotal + deliveryFee - discount;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.header}>Your Basket</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.addItemsBtn}>
              <Text style={styles.addItemsText}>Price acc. to quantity</Text>
            </View>
          </View>

          {cartData?.items?.length > 0 ? (
            cartData.items.map(item => (
              <View key={item._id} style={styles.itemContainer}>
                <Image
                  source={{ uri: `https://www.mandlamart.co.in${item.image}` }}
                  style={styles.image}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
                <View style={styles.quantityContainer}>
                  <Text style={styles.qty}>x {item.quantity}</Text>
                  <Text style={styles.itemPrice}>₹{item.totalPrice}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Your cart is empty</Text>
          )}

          <TouchableOpacity>
            <BasketCom
              leftIconName="location-pin"
              leftIconType="Entypo"
              rightIconName="keyboard-arrow-right"
              label="Deliver to -> Home"
              description="Bhopal Indrapuri"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <BasketCom
              label="Offers"
              description="FREE SHIPPING"
              extraDescription="20%"
              leftIconName="shopping-cart"
              leftIconType="FontAwesome"
              descriptionBgColor="#21e24eff"
              extraBgColor="#ffdd00"
            />
          </TouchableOpacity>

          {cartData?.items?.length > 0 && (
            <View style={styles.pricing}>
              <View style={styles.row}>
                <Text>Subtotal</Text>
                <Text style={styles.totalText}>₹{subtotal}</Text>
              </View>

              <View style={styles.row}>
                <Text>Delivery Fee</Text>
                <Text style={styles.totalText}>₹{deliveryFee}</Text>
              </View>

              {discount > 0 && (
                <View style={[styles.row, styles.totalRow]}>
                  <Text>Discount</Text>
                  <Text style={styles.totalText}>- ₹{discount}</Text>
                </View>
              )}

              <View style={[styles.row, styles.totalRow]}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalText}>₹{totalPrice}</Text>
              </View>
            </View>
          )}

          {cartData?.items?.length > 0 && (
            <TouchableOpacity style={styles.orderButton}>
              <Text style={styles.orderText}>₹{totalPrice} | Checkout</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addItemsBtn: {
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
    width: 100,
    alignItems: 'center',
    paddingVertical: 4,
  },
  addItemsText: { fontSize: 10, color: 'red' },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    borderColor: '#ccc',
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, color: 'black', fontWeight: '600' },
  itemPrice: { fontSize: 14, color: '#0f0f0f', fontWeight: '600' },
  quantityContainer: { alignItems: 'flex-end' },
  qty: { fontSize: 14, color: '#333' },
  emptyText: { marginTop: 20, textAlign: 'center', color: 'gray' },
  pricing: {
    marginTop: 25,
    borderTopWidth: 0.5,
    paddingTop: 10,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  totalRow: {
    borderTopWidth: 0.5,
    paddingTop: 8,
    marginTop: 10,
    borderColor: '#ccc',
  },
  totalText: { fontWeight: 'bold', fontSize: 16, color: 'black' },
  orderButton: {
    backgroundColor: '#a70042',
    padding: 15,
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 10,
  },
  orderText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
