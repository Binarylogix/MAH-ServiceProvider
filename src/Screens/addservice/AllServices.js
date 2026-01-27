import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import { fetchVendorDetails } from '../../redux/Vendor/vendorDetailsSlice';
import LinearGradient from 'react-native-linear-gradient';

const AllServices = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const vendor = useSelector(state => state.vendorDetails.vendor);
  useEffect(() => {
    if (vendor?.data?.category) {
      fetchCategories();
    }
  }, [vendor]);

  useEffect(() => {
    dispatch(fetchVendorDetails());
  }, [dispatch]);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch service categories belonging to vendor's main category
  const fetchCategories = async () => {
    try {
      const vendorId = await AsyncStorage.getItem('vendorId');
      const token = await AsyncStorage.getItem('vendorToken');
      if (!vendorId || !token) return;

      setLoading(true);
      const parentCategoryId = vendor?.data?.category;
      console.log(parentCategoryId);
      const res = await axios.get(
        `https://www.makeahabit.com/api/v1/newservicecategories/listByCategory/${parentCategoryId?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.log(
        'Error fetching categories:',
        err.response?.data || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchVendorDetails());
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, []),
  );

  // Navigate to AllServices1 passing required route params
  const handleCategoryPress = category => {
    navigation.navigate('AllServices1', {
      categoryId: category._id,
      categoryName: category.serviceCategoryName,
      categoryImage: category.icon?.img,
      category: category.category, // main parent category id
    });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCategoryPress(item)}
    >
      {item.icon?.img ? (
        <Image
          source={{
            uri: `https://www.makeahabit.com/api/v1/uploads/icon/${item.icon.img}`,
          }}
          style={styles.cardImage}
        />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          <MaterialCommunityIcons name="image-off" size={30} color="#999" />
        </View>
      )}
      <Text style={styles.cardText}>{item.serviceCategoryName}</Text>
      <MaterialCommunityIcons name="chevron-right" size={26} color="#14ad5f" />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#e6f0c1ff', '#fbfffdff']}
      style={{ flex: 1, padding: 16 }}
    >
      <HeaderLeft title="Service Categories" />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#14ad5f"
          style={{ marginTop: 40 }}
        />
      ) : categories.length === 0 ? (
        <Text style={{ marginTop: 20, textAlign: 'center', color: '#777' }}>
          No categories found
        </Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item._id}
          renderItem={renderCategory}
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ width: '100%', marginTop: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
};

export default AllServices;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardImage: { width: 50, height: 50, borderRadius: 8, marginRight: 16 },
  imagePlaceholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: { fontSize: 16, flex: 1, color: '#333' },
});
