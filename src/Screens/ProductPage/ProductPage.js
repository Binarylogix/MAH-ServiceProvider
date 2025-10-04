import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function ProductPage({ navigation, route }) {
  const subId = route.params.subCategoryId;
  console.log(route.params);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState({});

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        `https://www.mandlamart.co.in/api/subcategory/getSubCategory/${subId}`,
      );
      console.log(response.data.data);
      setSubCategories(response.data.data); // assume API returns an array
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchProducts = async subCategoryId => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.mandlamart.co.in/api/products/getProductById/${subCategoryId}`,
      );
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const addToBasket = id => {
    setBasket(prev => ({
      ...prev,
      [id]: prev[id] ? prev[id] + 1 : 1,
    }));
  };

  const removeFromBasket = id => {
    setBasket(prev => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 0,
    }));
  };

  const renderSubCategory = sub => (
    <View style={styles.categoryItem} key={sub._id}>
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => fetchProducts(sub._id)}
      >
        <Image
          source={
            sub.image
              ? { uri: 'https://www.mandlamart.co.in' + sub.image }
              : require('../../assets/chips.jpg')
          }
          style={styles.icon}
        />
      </TouchableOpacity>
      <Text style={styles.categoryText}>{sub.subCategoryName}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00a651" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Atta, Rice & Dal</Text>
      </View>

      <View style={styles.mainContent}>
        {/* Categories - Left 20% */}
        <ScrollView style={styles.categoryList}>
          {subCategories.map(sub => renderSubCategory(sub))}
        </ScrollView>

        {/* Products - Right 80% */}
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
          style={styles.productList}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>
              <Image
                source={
                  item.image
                    ? { uri: 'https://www.mandlamart.co.in' + item.image }
                    : require('../../assets/chips.jpg')
                }
                style={styles.productImage}
              />
              <TouchableOpacity style={styles.heartIcon}>
                <Icon name="heart-outline" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.productPrice}>₹ {item.price}</Text>
              <Text style={styles.oldPrice}>₹ {item.oldPrice}</Text>
              <Text style={styles.productName}>{item.name}</Text>

              {basket[item.id] > 0 ? (
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => removeFromBasket(item.id)}
                  >
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityCount}>{basket[item.id]}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => addToBasket(item.id)}
                  >
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToBasket(item.id)}
                >
                  <Text style={styles.addText}>+</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>

      {Object.keys(basket).length > 0 && (
        <View style={styles.basketBar}>
          <Text style={styles.basketText}>
            View Basket ({Object.values(basket).reduce((a, b) => a + b, 0)})
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
  title: { fontSize: 18, fontWeight: 'bold' },

  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },

  // Categories - Left
  categoryList: {
    width: '20%',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
  },
  categoryItem: { alignItems: 'center', marginVertical: 10 },
  categoryCard: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  icon: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryText: { fontSize: 12, textAlign: 'center' },

  // Products - Right
  productList: { width: '80%', paddingHorizontal: 5 },
  productCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e0f7e9',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 1,
  },
  discountText: { color: '#00a651', fontSize: 10, fontWeight: 'bold' },
  productImage: { width: '100%', height: 100, resizeMode: 'contain' },
  heartIcon: { position: 'absolute', top: 10, right: 10 },
  productPrice: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  oldPrice: { fontSize: 12, textDecorationLine: 'line-through', color: '#888' },
  productName: { fontSize: 12, marginTop: 5 },
  addButton: {
    backgroundColor: '#00a651',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  addText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: '#00a651',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  quantityCount: { marginHorizontal: 10, fontWeight: 'bold', fontSize: 16 },
  basketBar: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: '#4f2cc8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  basketText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
