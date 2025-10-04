import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import BottomCartBar from '../Component/BottomCartBar';

import { useNavigation } from '@react-navigation/native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Productcard from './Productcard/Productcard';
export default function Card({ route }) {
  const data = route.params;
  console.log('product data : ', data);
  const navigation = useNavigation();
  const [selectedQty, setSelectedQty] = useState('1Kg');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const API_TOKEN = AsyncStorage.getItem('userToken');
  const quantities = ['1Kg', '2Kg', '5Kg', '10Kg'];

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10 }}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          {data?.product?.images?.[0] && (
            <Image
              source={data.product.images[0]}
              style={styles.productImage}
              resizeMode="cover"
            />
          )}

          {/* Side small images */}
        </View>
        <View style={styles.sideImages}>
          {data?.product?.images?.map(
            (img, index) =>
              index > 0 &&
              index <= 2 && ( // show only next two images as side images
                <Image key={index} source={img} style={styles.smallImg} />
              ),
          )}
        </View>

        {/* Price & Discount */}
        <View style={styles.ContentContainer}>
          <View style={styles.PriceContainer}>
            <Text style={styles.price}>
              ₹{data?.product?.price}/{data?.product?.value}{' '}
              {data?.product?.unit}
            </Text>
            <Text style={styles.discount}>50% Off</Text>
          </View>
          {/* Product Name */}
          <Text style={styles.name}>{data?.product?.name}</Text>
          <Text style={styles.des}>{data?.product?.description}</Text>

          {/* Quantity with Dropdown */}
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantity:</Text>
            <Text style={styles.quantity}>
              {data?.product?.value} {data?.product?.unit}
            </Text>
          </View>

          {/* Dropdown Modal */}
          <Modal
            visible={isDropdownVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPressOut={() => setDropdownVisible(false)}
            >
              <View style={styles.dropdownList}>
                {quantities.map((qty, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedQty(qty);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{qty}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        {/* Features Boxes */}
        <View style={styles.featureRow}>
          <View style={styles.featureBox}>
            <Icon
              name="leaf"
              size={22}
              color="#4caf50"
              style={{ marginBottom: 6, borderRadius: 15 }}
            />
            <Text style={styles.featureText}>Sourced{'\n'}Fresh Daily</Text>
          </View>
          <View style={styles.featureBox}>
            <Icon
              name="seedling"
              size={22}
              color="#ff9800"
              style={{ marginBottom: 6, borderRadius: 15 }}
            />
            <Text style={styles.featureText}>100%{'\n'}Organic</Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <View style={styles.featureBox}>
            <Icon
              name="stopwatch"
              size={22}
              color="#2196f3"
              style={{ marginBottom: 6, borderRadius: 15 }}
            />
            <Text style={styles.featureText}>48 Hours{'\n'}Replacement</Text>
          </View>
          <View style={styles.featureBox}>
            <Icon
              name="star"
              size={22}
              color="#fbc02d"
              style={{ marginBottom: 6, borderRadius: 15 }}
            />
            <Text style={styles.featureText}>4.8 ⭐{'\n'}Reviews</Text>
          </View>
        </View>

        {/* Highlights */}
        <Text style={styles.sectionTitle}>Highlights</Text>
        <View style={styles.highlightContainer}>
          {Array.isArray(data?.product?.features) &&
            data.product.features.map((feature, index) => (
              <Text key={index} style={styles.highlightText}>
                • {feature}
              </Text>
            ))}
        </View>

        {/* People also bought */}

        <Productcard listName={'People also bought '} style={{ padding: 6 }} />
      </ScrollView>

      <BottomCartBar
        productId={data?.product?._id}
        value={data?.product?.value}
        unit={data?.product?.unit}
        price={data?.product?.price}
        originalPrice={data?.product?.originalPrice}
        style={styles.bottomBar}
        // token={API_TOKEN}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0', // light subtle background
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 10,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Shadow for Android
    elevation: 3,
  },

  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  sideImages: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    gap: 8,
    backgroundColor: '#fff',
    height: 'auto',
    marginLeft: 4,
  },
  smallImg: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    padding: 12,
    // marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },

  ContentContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 10,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Shadow for Android
    elevation: 3,
  },

  PriceContainer: {
    flexDirection: 'row',
    gap: 6,
  },

  price: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  discount: {
    color: 'green',
    backgroundColor: '#cff6c9ff',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 12,
    fontSize: 10,
    marginBottom: 10,
    marginTop: 15,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    // marginBottom: 5,
  },
  des: {
    fontSize: 12,
    // fontWeight: '600',
    color: '#333',
    // marginBottom: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  qtyLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  quantity: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  dropdownText: {
    fontSize: 12,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdownList: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    padding: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#000',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  featureBox: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    // shadow for iOS
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 3,

    // shadow for Android
    elevation: 6,
  },

  featureText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 8,
    color: '#000',
    paddingLeft: 14,
  },
  highlightContainer: {
    marginTop: 1,
    paddingLeft: 14,
  },
  highlightText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8, // har line ke niche thoda gap
    lineHeight: 10, // line spacing clean dikhane ke liye
  },
  suggestCard: {
    width: 160,
    height: 230,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  suggestImage: {
    width: 120,
    height: 100,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  suggestName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  suggestText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
    textAlign: 'center',
  },
  suggestPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // optional styling
    backgroundColor: '#def2f3ff',
    elevation: 5, // shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 0,
    borderTopLeftRadius: 50,
  },
});
