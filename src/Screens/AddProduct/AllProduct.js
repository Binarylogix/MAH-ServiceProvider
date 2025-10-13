import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderLeft from '../../Component/Header/HeaderLeft';

const { width } = Dimensions.get('window');

const demoServices = [
  {
    id: '1',
    name: 'Hair Spa',
    category: 'Salon',
    price: 799,
    icon: 'content-cut',
  },
  {
    id: '2',
    name: 'Full Body Massage',
    category: 'Wellness',
    price: 1299,
    icon: 'spa',
  },
  {
    id: '3',
    name: 'Home Cleaning',
    category: 'Household',
    price: 499,
    icon: 'broom',
  },
  {
    id: '4',
    name: 'Car Wash',
    category: 'Automobile',
    price: 699,
    icon: 'car-wash',
  },
];

export default function AllProduct({ navigation }) {
  const handleAdd = () => {
    navigation.navigate('AddProduct');
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={32} color="#01A449" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{item.price}</Text>
        <Icon name="chevron-right" size={22} color="#999" />
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      {/* ✅ Responsive Header */}
      <View style={styles.header}>
        <HeaderLeft title={'All Offer'} />
        <TouchableOpacity onPress={handleAdd} activeOpacity={0.8}>
          <LinearGradient colors={['#00D65F', '#01823A']} style={styles.addBtn}>
            <Text style={styles.addService}>Add Offer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <FlatList
          data={demoServices}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // ✅ Responsive Header Section
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // ensures spacing
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
  },

  addBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#fff',
    elevation: 3,
  },

  addService: {
    color: '#000',
    fontWeight: '700',
    fontSize: width < 360 ? 12 : 14, // responsive font
  },

  // ✅ Card Styling
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  iconContainer: {
    backgroundColor: '#E6F7EE',
    borderRadius: 50,
    padding: 10,
    marginRight: 14,
  },

  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  categoryText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
    marginRight: 4,
  },
});
