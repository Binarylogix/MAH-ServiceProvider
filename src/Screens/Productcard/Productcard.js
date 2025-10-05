import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSalonList } from '../../redux/slices/SalonListSlice';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.34;
const IMAGE_HEIGHT = width * 0.2;

const FALLBACK_IMAGE = require('../../assets/images/noimage.jpg');

const Productcard = ({ listName }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    values: products,
    loading,
    error,
  } = useSelector(state => state.salonList);

  useEffect(() => {
    dispatch(fetchSalonList());
  }, [dispatch]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ShopProfile', { salon: item })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={item.image || FALLBACK_IMAGE}
          style={styles.productImage}
        />
      </View>

      <Text style={styles.productName} numberOfLines={1}>
        {item.name}
      </Text>

      <Text style={styles.productUNit} numberOfLines={1}>
        📍 {item.city}, {item.state}
      </Text>

      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
      >
        <Icon name="star" size={12} color="#01A449" />
        <Text style={{ fontSize: 11, marginLeft: 4, color: '#444' }}>
          {item.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#01A449" />;
  // }

  if (error) {
    return (
      <View style={{ padding: 15 }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{listName}</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      <FlatList
        horizontal
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item, index) => item._id + index}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      />
    </View>
  );
};

export default Productcard;

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: CARD_WIDTH,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    marginRight: 12,
    padding: 8,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
    marginBottom: 2,
  },
  productUNit: {
    fontSize: 10,
    color: 'black',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 12,
    color: 'green',
  },
});