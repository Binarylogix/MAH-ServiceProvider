import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

// Example categories for sidebar
const categories = [
  { name: 'Atta', icon: require('../../assets/aashirvaad.png') },
  { name: 'Rice', icon: require('../../assets/chips.jpg') },
  { name: 'Dal', icon: require('../../assets/chips.jpg') },
  { name: 'Atta', icon: require('../../assets/aashirvaad.png') },
  { name: 'Rice', icon: require('../../assets/chips.jpg') },
  { name: 'Dal', icon: require('../../assets/chips.jpg') },
  { name: 'Atta', icon: require('../../assets/aashirvaad.png') },
  { name: 'Rice', icon: require('../../assets/chips.jpg') },
  { name: 'Dal', icon: require('../../assets/chips.jpg') },
];

// Example products
const products = [
  {
    id: '1',
    name: 'Tata Sampann Fine Besan/ Kadale Hittu - 100% Chana Dal, 1 kg',
    image: require('../../assets/chips.jpg'),
    price: 120,
    discount: '52% OFF',
    originalPrice: 240,
  },
  {
    id: '2',
    name: 'Aashirvaad Multigrain - 5 kg',
    image: require('../../assets/chips.jpg'),
    price: 120,
    discount: '52% OFF',
    originalPrice: 240,
  },
  // Repeat or add more as per requirement
];

const ProductListScreen = () => {
  const [cart, setCart] = useState({});

  const handleAddToCart = id => {
    setCart(prevCart => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = id => {
    setCart(prevCart => ({
      ...prevCart,
      [id]: Math.max((prevCart[id] || 0) - 1, 0),
    }));
  };

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity style={styles.categoryButton} key={index}>
      <Image source={item.icon} style={styles.categoryIcon} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => {
    const quantity = cart[item.id] || 0;
    return (
      <View style={styles.productCard}>
        <Image source={item.image} style={styles.productImage} />
        <Text style={styles.discount}>{item.discount}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹ {item.price}</Text>
          <Text style={styles.originalPrice}>₹ {item.originalPrice}</Text>
        </View>
        <View style={styles.cartRow}>
          {quantity === 0 ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item.id)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)}>
                <Text style={styles.qtyButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={() => handleAddToCart(item.id)}>
                <Text style={styles.qtyButton}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Atta, Rice & Dal</Text>
      </View>

      <View style={styles.bodyRow}>
        {/* Categories Sidebar */}
        <ScrollView style={styles.sidebar}>
          {categories.map((item, index) => renderCategory({ item, index }))}
        </ScrollView>

        {/* Products Grid */}
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      </View>

      {/* Basket View */}
      <TouchableOpacity style={styles.viewBasket}>
        <Text style={styles.basketText}>
          View Basket ({Object.values(cart).reduce((a, b) => a + b, 0)})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 8,
    left: 22,

    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  //   bodyRow: { display: 'flex', flexDirection: 'row' },
  sidebar: {
    width: 60,
    backgroundColor: '#fafafa',
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  categoryButton: { alignItems: 'center', marginVertical: 5 },
  categoryIcon: { width: 30, height: 30 },
  categoryText: { fontSize: 10 },
  productList: { padding: 10 },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 4,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    minWidth: 70,
  },
  productImage: { width: 50, height: 60, alignSelf: 'center' },
  discount: { color: '#3cb045', fontWeight: 'bold', fontSize: 12 },
  productName: { fontSize: 13, marginVertical: 6, minHeight: 40 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  price: { fontWeight: 'bold', fontSize: 15 },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginLeft: 8,
    fontSize: 13,
  },
  cartRow: { alignItems: 'center', marginTop: 10 },
  addButton: {
    backgroundColor: '#37bb4e',
    borderRadius: 20,
    padding: 8,
    minWidth: 36,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#37bb4e',
    borderRadius: 20,
  },
  qtyButton: {
    color: '#fff',
    fontSize: 22,
    paddingHorizontal: 8,
    fontWeight: 'bold',
  },
  qtyText: { color: '#fff', fontSize: 16, paddingHorizontal: 6 },
  viewBasket: {
    position: 'absolute',
    bottom: 16,
    left: 90,
    right: 16,
    backgroundColor: '#8a15d2',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  basketText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
});

export default ProductListScreen;
