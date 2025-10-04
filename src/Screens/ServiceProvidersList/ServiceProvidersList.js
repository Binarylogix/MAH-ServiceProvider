import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { getImageUri } from '../../constants/BASE_URl';

const ServiceProvidersList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    fetch('https://www.makeahabit.com/api/v1/category/get-all')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
          setSelectedCategory(data.categories[0]._id);
        }
      });
  }, []);

  // Fetch salons when selectedCategory changes
  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    fetch('https://www.makeahabit.com/api/v1/vendor/all-sallon-list')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter salons by selectedCategory id matching salon.category
          const filtered = data.data.filter(
            salon => salon.category === selectedCategory,
          );
          setSalons(filtered);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory]);

  const filteredSalons = salons.filter(salon =>
    salon.businessName.toLowerCase().includes(search.toLowerCase()),
  );

  const renderSalonCard = ({ item }) => (
    <View style={styles.salonCard}>
      <Image
        source={{ uri: getImageUri('business', item.businessCard) }}
        style={styles.salonImage}
      />
      <View style={styles.salonDetails}>
        <Text style={styles.salonName}>{item.businessName}</Text>
        <Text style={styles.salonLocation}>📍 {item.city || ''}</Text>
        <Text style={styles.salonServices}>
          <Text style={{ fontWeight: '600' }}>Services:</Text>{' '}
          {item.services && item.services.length > 0
            ? item.services.map(s => s.name).join(', ')
            : 'Not provided'}
        </Text>
        <Text style={styles.salonRating}>⭐ {item.avgRating || '0.0'}</Text>
      </View>
      <TouchableOpacity style={styles.heartIcon}>
        <Text style={{ fontSize: 20, color: '#18A558' }}>♡</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={text => setSearch(text)}
        />
        <View style={styles.searchIcon}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
        </View>
      </View>

      {/* Category Toggle */}
      <View style={styles.categoryRow}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat._id}
            style={[
              styles.categoryBtn,
              selectedCategory === cat._id && styles.selectedCategoryBtn,
            ]}
            onPress={() => setSelectedCategory(cat._id)}
          >
            <Image
              source={{ uri: getImageUri(cat.img) }}
              style={styles.avatar}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat._id && styles.selectedCategoryText,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nearest Salon & All Salon link */}
      <View style={styles.nearestRow}>
        <Text style={styles.nearestText}>Nearest Salon</Text>
        <TouchableOpacity>
          <Text style={styles.allSalonText}>All Salon</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#18A558" />
      ) : (
        <FlatList
          data={filteredSalons}
          keyExtractor={item => item._id}
          renderItem={renderSalonCard}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 44,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },
  searchIcon: { marginLeft: 6 },
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#222',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff',
    gap: 6,
  },
  selectedCategoryBtn: { backgroundColor: '#18A558', borderColor: '#18A558' },
  categoryText: { fontSize: 14, color: '#222', fontWeight: '600' },
  selectedCategoryText: { color: '#fff' },
  avatar: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 3 },
  nearestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nearestText: { fontSize: 16, fontWeight: '700', color: '#222' },
  allSalonText: { fontSize: 14, color: '#18A558', fontWeight: '600' },
  salonCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  salonImage: { width: 64, height: 64, borderRadius: 10, marginRight: 10 },
  salonDetails: { flex: 1 },
  salonName: { fontSize: 15, fontWeight: '700', color: '#222' },
  salonLocation: {
    fontSize: 13,
    color: '#18A558',
    fontWeight: '600',
    marginBottom: 2,
  },
  salonServices: { fontSize: 12, color: '#666', marginBottom: 2 },
  salonRating: {
    fontSize: 12,
    color: '#18A558',
    fontWeight: '700',
    marginTop: 2,
  },
  heartIcon: { marginLeft: 10 },
});

export default ServiceProvidersList;
