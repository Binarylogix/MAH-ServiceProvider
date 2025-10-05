import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalonList } from '../../redux/slices/SalonListSlice';
import noImage from '../../assets/images/noimage.jpg';
import HeaderLeft from '../../Component/Header/HeaderLeft';

const BASE_URL = 'https://www.makeahabit.com/api/v1/uploads';

export default function SearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const searchQuery = route.params?.searchQuery || '';

  const {
    values: salons = [],
    loading,
    error,
  } = useSelector(state => state.salonList || {});

  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    dispatch(fetchSalonList());
  }, [dispatch]);

  useEffect(() => {
    if (salons.length > 0) {
      const result = salons.filter(s =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFiltered(result);
    }
  }, [salons, searchQuery]);

  const renderSalon = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ShopProfile', { salon: item })}
    >
      {/* <Image
        source={
          item.image
            ? { uri: item.image.startsWith('http') ? item.image : `${BASE_URL}/${item.image}` }
            : noImage
        }
        style={styles.image}
      /> */}
       <View style={styles.image}>
               <Image
                      source={item.image || noImage}
                      style={styles.salonImage}
                      resizeMode="cover"
                    />
            </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.city}>📍 {item.city || 'N/A'}</Text>
        <Text style={styles.services}>
          {item.services?.length
            ? item.services.map(s => s.name).join(', ')
            : 'No services listed'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderLeft title="Search Results" />

      {loading ? (
        <ActivityIndicator size="large" color="#18A558" style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>
          Failed to load data.
        </Text>
      ) : filtered.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#777' }}>
          No results for "{searchQuery}"
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={renderSalon}
          contentContainerStyle={{ padding: 14 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  city: {
    fontSize: 13,
    color: '#18A558',
    fontWeight: '600',
  },
  services: {
    fontSize: 12,
    color: '#666',
  },
});
