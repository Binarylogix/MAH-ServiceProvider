import React, { useEffect, useState } from 'react';
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
import Icon1 from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.34; // card width is responsive
const IMAGE_HEIGHT = width * 0.20; // proportional image height

const FALLBACK_IMAGE = require('../../assets/images/noimage.jpg'); // Local fallback image

const Productcard = ({ listName }) => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  

const fetchProducts = async () => {
  const API_TOKEN = await AsyncStorage.getItem('userToken');
  setLoading(true);
  try {
    const response = await axios.get(
      'https://www.makeahabit.com/api/v1/vendor/all-sallon-list',
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data.data || [];

    const mappedProducts = data.map(salon => {
      return {
        _id: salon._id,
        name: salon.businessName,
        description: salon.description || '',
        city: salon.city,
        state: salon.state,
        rating: salon.avgRating,
         image: salon.businessCard
    ? { uri: `https://www.makeahabit.com/api/v1/uploads/business/${salon.businessCard}` } // direct URI
    : FALLBACK_IMAGE, // local fallback
  services: salon.services || [],
      };
    });

    setProducts(mappedProducts);
  } catch (error) {
    console.error('Error fetching salons:', error.response || error.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  const renderProduct = ({ item }) => (
  <TouchableOpacity
    style={styles.productCard}
  //  onPress={() => navigation.navigate('ShopProfile', { salonId: item })}
  onPress={() => navigation.navigate('ShopProfile', { salon: item })}


  >
    {/* Image */}
    <View style={styles.imageContainer}>
      <Image source={item?.image} style={styles.productImage} />
    </View>

    {/* Salon Info */}
    <Text style={styles.productName} numberOfLines={1}>
      {item.name}
    </Text>
    {/* <Text style={styles.productText} numberOfLines={1}>
      {item.description}
    </Text> */}
    <Text style={styles.productUNit} numberOfLines={1}>
      📍 {item.city}, {item.state}
    </Text>

    {/* Rating */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
      <Icon name="star" size={12} color="#01A449" />
      <Text style={{ fontSize: 11, marginLeft: 4, color: '#444' }}>
        {item.rating}
      </Text>
    </View>

    {/* First service & price preview */}
    {/* {item.services?.length > 0 && (
      <Text style={{ fontSize: 11, color: 'green', marginTop: 4 }}>
        {item.services[0].name} - ₹{item.services[0].price}
      </Text>
    )} */}
  </TouchableOpacity>
);


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
          keyExtractor={(item, index) => item.id + index}
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
  leftTopButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 5,
    backgroundColor: '#E9F5FA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  discountText: {
    color: 'green',
    fontWeight: '500',
    fontSize: 10,
  },
  // rightTopButton: {
  //   position: 'absolute',
  //   top: 6,
  //   right: 6,
  //   borderRadius: 15,
  //   width: 24,
  //   height: 24,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: 'rgba(0,0,0,0.3)',
  //   zIndex: 2,
  // },
  rightTopButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderRadius: 15,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  gradientHeart: {
    flex: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
    marginBottom: 2,
  },
  productText: {
    fontSize: 10,
    color: '#817f7fff',
  },

  productUNit: {
    fontSize: 10,
    color: 'black',
    fontWeight: 600,
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
