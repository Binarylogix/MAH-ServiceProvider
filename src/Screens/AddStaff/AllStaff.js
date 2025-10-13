import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderLeft from '../../Component/Header/HeaderLeft';

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

export default function AllStaff({ navigation }) {
  const handleAdd = () => {
    navigation.navigate('AddStaff');
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
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderLeft title={'All Staff'} />
          <TouchableOpacity onPress={handleAdd} activeOpacity={0.8}>
            <LinearGradient
              colors={['#00D65F', '#01823A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.AddBtn}
            >
              <Text style={styles.Addservice}>Add Staff</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Service List */}
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
  container: { flex: 1, padding: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  AddBtn: {
    padding: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Addservice: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 4,
    marginBottom: 12,
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
