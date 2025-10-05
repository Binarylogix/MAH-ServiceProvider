import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const scale = size => (width / 375) * size;

const FALLBACK_IMAGE = require('../../assets/images/noimage.jpg'); // fallback image

export default function CategoriesHomeIndex() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchCategories = async () => {
    const API_TOKEN = await AsyncStorage.getItem('userToken');
    setLoading(true);
    try {
      const url = 'https://www.makeahabit.com/api/v1/category/get-all';
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data.categories || [];
      if (!data.length) {
        Alert.alert('No categories available');
      }

      const mappedCategories = data.map(cat => ({
        id: cat._id,
        name: cat.name,
        image: cat.img
          ? { uri: `https://www.makeahabit.com/api/v1/uploads/category/${cat.img}` }
          : FALLBACK_IMAGE,
      }));

      setCategories(mappedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error.response || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Data loading problem'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategoryButton = ({ item }) => (
    console.log("item",item.id),
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.categoryCard}
      onPress={() =>
        navigation.navigate('ServiceDividedByCategory', { categoryId: item.id, ShopCategory: item.name })
      }
    >
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.categoryIcon} />
      </View>
      <Text numberOfLines={2} style={styles.categoryText}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#2a9d8f" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryButton}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(8),
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingVertical: scale(6),
  },
  categoryCard: {
    backgroundColor: '#fdfdfd',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(10),
    width: width * 0.22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  imageWrapper: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: scale(6),
    borderWidth: 1,
    borderColor: '#2a9d8f30',
  },
  categoryIcon: {
    width: scale(50),
    height: scale(50),
    resizeMode: 'cover',
    borderRadius: scale(26),
  },
  categoryText: {
    fontSize: scale(11),
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
    marginBottom: scale(4),
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
