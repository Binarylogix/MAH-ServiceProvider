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
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSalonList } from '../../redux/slices/SalonListSlice';
import { fetchCategoryList } from '../../redux/slices/CategoryListSlice';
import { fetchServiceCategoryList } from '../../redux/slices/ServiceCategory';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import noImage from '../../assets/images/noimage.jpg';

const BASE_URL = 'https://www.makeahabit.com/api/v1/uploads';

const ServiceDividedByCategory = ({ route }) => {

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const CategoryId = route.params?.categoryId;
  const ShopCategory = route.params?.ShopCategory;
console.log("CategoryId",CategoryId)
  const {
    values: salons = [],
    loading: salonLoading,
    error: salonError,
  } = useSelector(state => state.salonList || {});
  const {
    values: categories = [],
    loading: categoryLoading,
    error: categoryError,
  } = useSelector(state => state.CategoryList || {});

 const {
  values: servicecategories = [],
  loading: servicecategoryLoading,
  error: servicecategoryError,
} = useSelector(state => state.ServiceCategoryList || {});

console.log("Service Categories from state:", servicecategories);


  useEffect(() => {
    dispatch(fetchSalonList());
    dispatch(fetchCategoryList());
  }, [dispatch]);

 useEffect(() => {
  if (CategoryId) {
    console.log("Dispatching fetch for categoryId:", CategoryId);
    dispatch(fetchServiceCategoryList(CategoryId));
  }
}, [dispatch, CategoryId]);


  //  useEffect(() => {
  //   if (categories.length > 0 && CategoryId) {
  //     setSelectedCategory(CategoryId);
  //   }
  // }, [categories, CategoryId]);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      // Set initial selected category only once
      if (CategoryId && categories.some(cat => cat._id === CategoryId)) {
        setSelectedCategory(CategoryId);
      } else {
        setSelectedCategory(null); // default to 'All'
      }
    }
  }, [categories, CategoryId]);

  const filteredSalons = salons
    .filter(salon =>
      selectedCategory
        ? salon.category?._id === selectedCategory ||
          salon.category === selectedCategory
        : true,
    )
    .filter(salon => salon.name?.toLowerCase().includes(search.toLowerCase()));

  const renderSalonCard = ({ item }) => (
    <TouchableOpacity
      style={styles.salonCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ShopProfile', { salon: item })}
    >
      <Image
        source={item.image || noImage}
        style={styles.salonImage}
        resizeMode="cover"
      />

      <View style={styles.salonDetails}>
        <Text style={styles.salonName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.salonLocation}>📍 {item.city || 'N/A'}</Text>
        <Text style={styles.salonServices} numberOfLines={1}>
          <Text style={{ fontWeight: '600' }}>Services:</Text>{' '}
          {item.services?.length > 0
            ? item.services.map(s => s.name).join(', ')
            : 'Not provided'}
        </Text>
        <Text style={styles.salonRating}>⭐ {item.rating || '0.0'}</Text>
      </View>

      <TouchableOpacity style={styles.heartIcon}>
        <Text style={{ fontSize: 20, color: '#18A558' }}>♡</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderLeft title={`All ${ShopCategory}`} />

      <View style={styles.container}>
        {/* 🔍 Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search salons..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.searchIcon}>
            <Text style={{ fontSize: 18 }}>🔍</Text>
          </View>
        </View>
{/* 
        <View style={{ flex: 0 }}>
         
          {categoryLoading ? (
            <ActivityIndicator size="small" color="#18A558" />
          ) : categoryError ? (
            <Text style={{ color: 'red', textAlign: 'center' }}>
              Failed to load categories
            </Text>
          ) : (
            <FlatList
              horizontal
              data={[{ _id: 'all', name: 'All' }, ...categories]}
              keyExtractor={item => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item }) => {
                const isSelected =
                  item._id === selectedCategory ||
                  (item._id === 'all' && selectedCategory === null);

                return (
                  <TouchableOpacity
                    style={[
                      styles.categoryBtn,
                      isSelected && styles.selectedCategoryBtn, // ✅ use isSelected
                    ]}
                    onPress={() =>
                      item._id === 'all'
                        ? setSelectedCategory(null)
                        : setSelectedCategory(item._id)
                    }
                  >
                    {item._id !== 'all' ? (
                      <Image
                        source={
                          item.img && item.img.uri
                            ? {
                                uri: item.img.uri.startsWith('http')
                                  ? item.img.uri
                                  : `${BASE_URL}/${item.img.uri}`,
                              }
                            : noImage
                        }
                        style={styles.avatar}
                      />
                    ) : null}

                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.selectedCategoryText, // ✅ use isSelected
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View> */}



        
        <View style={{ flex: 0 }}>
         
          {servicecategoryLoading ? (
            <ActivityIndicator size="small" color="#18A558" />
          ) : servicecategoryError ? (
            <Text style={{ color: 'red', textAlign: 'center' }}>
              Failed to load categories
            </Text>
          ) : (
            <FlatList
              horizontal
              data={[{ _id: 'all', name: 'All' }, ...servicecategories]}
              keyExtractor={item => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item }) => {
                const isSelected =
                  item._id === selectedCategory ||
                  (item._id === 'all' && selectedCategory === null);

                return (
                  <TouchableOpacity
                    style={[
                      styles.categoryBtn,
                      isSelected && styles.selectedCategoryBtn, // ✅ use isSelected
                    ]}
                    onPress={() =>
                      item._id === 'all'
                        ? setSelectedCategory(null)
                        : setSelectedCategory(item._id)
                    }
                  >
                    {item._id !== 'all' ? (
                      <Image
                        source={
                          item.img && item.img.uri
                            ? {
                                uri: item.img.uri.startsWith('http')
                                  ? item.img.uri
                                  : `${BASE_URL}/${item.img.uri}`,
                              }
                            : noImage
                        }
                        style={styles.avatar}
                      />
                    ) : null}

                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.selectedCategoryText, // ✅ use isSelected
                      ]}
                    >
                      {item.serviceCategory}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        {/* 🔸 Heading Row */}
        <View style={styles.nearestRow}>
          <Text style={styles.nearestText}>Nearest Salons</Text>
          <TouchableOpacity>
            <Text style={styles.allSalonText}>All Salons</Text>
          </TouchableOpacity>
        </View>

        {/* 🏪 Salon List */}
        {salonLoading ? (
          <ActivityIndicator size="large" color="#18A558" />
        ) : salonError ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>
            Failed to load salons
          </Text>
        ) : (
          <FlatList
            data={filteredSalons}
            keyExtractor={item => item._id}
            renderItem={renderSalonCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
    </View>
  );
};

export default ServiceDividedByCategory;

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
    backgroundColor: '#F1F3F4',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 44,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#222',
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 6,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    elevation: 1,
  },
  selectedCategoryBtn: {
    backgroundColor: '#18A558',
    borderColor: '#18A558',
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 6,
    backgroundColor: '#eee',
  },
  nearestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 0,
  },
  nearestText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  allSalonText: {
    fontSize: 14,
    color: '#18A558',
    fontWeight: '600',
  },
  salonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  salonImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  salonDetails: {
    flex: 1,
  },
  salonName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  salonLocation: {
    fontSize: 13,
    color: '#18A558',
    fontWeight: '600',
  },
  salonServices: {
    fontSize: 12,
    color: '#666',
  },
  salonRating: {
    fontSize: 12,
    color: '#18A558',
    fontWeight: '700',
  },
  heartIcon: {
    marginLeft: 8,
  },
});
