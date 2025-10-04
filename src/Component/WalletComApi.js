import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import img from '../assets/chips.jpg';

const { width, height } = Dimensions.get('window');

const initialBasketItems = [
  {
    id: '1',
    name: 'Chips',
    price: 49,
    quantity: 1,
    image: img,
  },
  {
    id: '2',
    name: 'Chips',
    price: 49,
    quantity: 1,
    image: img,
  },
  {
    id: '3',
    name: 'Chips',
    price: 25,
    quantity: 2,
    image: img,
  },
];

export default function WalletcomApi({ onSubtotalChange }) {
  const [items, setItems] = useState(initialBasketItems);

  const updateQuantity = (id, type) => {
    const updated = items.map(item => {
      if (item.id === id) {
        let newQty =
          type === 'increase' ? item.quantity + 1 : item.quantity - 1;
        newQty = newQty < 1 ? 1 : newQty;
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setItems(updated);
    updateSubtotal(updated);
  };

  const deleteItem = id => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    updateSubtotal(updated);
  };

  const updateSubtotal = data => {
    const subtotal = data.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (onSubtotalChange) onSubtotalChange(subtotal);
  };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
      {items.map(item => (
        <View key={item.id} style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => deleteItem(item.id)}
            style={styles.deleteIcon}
          >
            <Text style={styles.crossText}>✕</Text>
          </TouchableOpacity>

          <Image source={item.image} style={styles.image} />

          {/* 📄 Item Details */}
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>₹{item.price}</Text>
          </View>

          {/* ➕➖ Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, 'decrease')}
            >
              <Text style={styles.qtyBtn}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, 'increase')}
            >
              <Text style={styles.qtyBtn}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
    paddingBottom: height * 0.012,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    height: height * 0.13,
    position: 'relative',
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    // padding: 4,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    shadowOffset: { width: 0, height: 0 },
  },
  crossText: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    // color: 'red',
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: width * 0.045,
    color: 'black',
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: width * 0.04,
    color: '#0f0f0f',
    fontWeight: '600',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    fontSize: width * 0.06,
    paddingHorizontal: width * 0.025,
    color: '#000',
  },
  qty: {
    fontSize: width * 0.045,
    marginHorizontal: width * 0.015,
  },
});
