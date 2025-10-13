// AddService.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const API_BASE = 'https://www.makeahabit.com';
const API_BASE1 = 'https://www.makeahabit.com/api/v1';
const API_BASE2 = 'https://www.makeahabit.com/api/v1';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(async config => {
  try {
    const token = await AsyncStorage.getItem('vendorToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // no-op
  }
  return config;
}); // [web:21][web:27]

const AddService = () => {
  const navigation = useNavigation();
  const [icons, setIcons] = useState([]); // [{_id, name, img}]
  const [categories, setCategories] = useState([]); // raw array from API
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // selections
  const [selectedIcon, setSelectedIcon] = useState(null); // icon object
  const [selectedCategory, setSelectedCategory] = useState(null); // category object

  // dropdown visibility
  const [openIconDrop, setOpenIconDrop] = useState(false);
  const [openCategoryDrop, setOpenCategoryDrop] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        // parallel fetch
        const [iconRes, catRes] = await Promise.all([
          api.get('/api/v1/service/service-icon-list'),
          api.get('/api/v1/servicecategory/getAllServiceCategories'),
        ]);
        if (!isMounted) return;

        // icon list
        const iconList = Array.isArray(iconRes.data?.icons)
          ? iconRes.data.icons
          : [];
        setIcons(iconList);

        // categories list
        const catList = Array.isArray(catRes.data) ? catRes.data : [];
        setCategories(catList);
      } catch (err) {
        Alert.alert('Error', 'Failed to load dropdown data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []); // [web:21]

  const categoryDisplay = c => {
    // Prefer nested category.name; fallback to serviceCategory field
    return c?.category?.name || c?.serviceCategory || 'Unknown'; // [web:22]
  };

  const categoryImageUrl = c => {
    const raw = c?.img || c?.category?.img || '';
    if (!raw) return null;
    return raw.startsWith('http')
      ? raw
      : `${API_BASE1}${raw.startsWith('/') ? '' : '/'}${raw}`;
  }; // [web:22]

  const iconImageUrl1 = i => {
    // Icon img appears as a filename; serve from uploads path if needed
    const raw = i?.img || '';
    if (!raw) return null;
    // If backend serves icons under /uploads/icons/, adjust path accordingly
    return raw.startsWith('http') ? raw : `${API_BASE2}/uploads/icon/${raw}`;
  };
  const iconImageUrl = i => {
    // Icon img appears as a filename; serve from uploads path if needed
    const raw = i?.img || '';
    if (!raw) return null;
    // If backend serves icons under /uploads/icons/, adjust path accordingly
    return raw.startsWith('http') ? raw : `${API_BASE1}/uploads/icon/${raw}`;
  }; // [web:22]

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      Number(price) > 0 &&
      selectedIcon?._id &&
      selectedCategory?._id
    );
  }, [name, price, selectedIcon, selectedCategory]); // [web:22]

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert(
        'Missing data',
        'Please fill all fields and select icon and category.',
      );
      return;
    }
    try {
      setLoadingSubmit(true);
      const payload = {
        name: name.trim(),
        price: Number(price),
        icon: selectedIcon._id,
        ServiceCategory: selectedCategory._id,
      };
      await api.post('/api/v1/service/create', payload);

      // optional toast/alert, then go back
      Alert.alert('Success', 'Service created successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);

      // Or immediate navigation without Alert:
      // navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to create service.');
    } finally {
      setLoadingSubmit(false);
    }
  }; // [web:21]

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  } // [web:21]

  return (
    <LinearGradient
      colors={['#d8e8a0ff', '#fbfffdff']} // adjust colors to your brand or preference
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={{ padding: 4, marginRight: 6 }}
          >
            <Icon name="arrow-left" size={24} color="#111" />
          </Pressable>
          <Text style={styles.title}>Create Service</Text>
        </View>

        <Text style={styles.label}>Select Service category</Text>
        <Pressable
          style={styles.dropdownButton}
          onPress={() => setOpenCategoryDrop(v => !v)}
        >
          <Text style={styles.dropdownText}>
            {selectedCategory
              ? categoryDisplay(selectedCategory)
              : 'Select Service category'}
          </Text>
        </Pressable>
        {openCategoryDrop && (
          <FlatList
            data={categories}
            keyExtractor={(item, idx) => `${item._id}-${idx}`}
            style={styles.dropdownList}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedCategory(item);
                  setOpenCategoryDrop(false);
                }}
                style={styles.row}
              >
                {categoryImageUrl(item) ? (
                  <Image
                    source={{ uri: categoryImageUrl(item) }}
                    style={styles.catImg}
                  />
                ) : (
                  <View style={styles.placeholderImg} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowText}>{categoryDisplay(item)}</Text>
                  <Text style={styles.rowSub}>
                    {item?.serviceCategory || 'Category'} •{' '}
                    {item?.category?.status || 'Active'}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        )}

        <Text style={styles.label}>Service name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Luxury Facial Treatment"
          style={styles.input}
        />

        <Text style={styles.label}>Select Service icon</Text>
        <Pressable
          style={styles.dropdownButton}
          onPress={() => setOpenIconDrop(v => !v)}
        >
          <Text style={styles.dropdownText}>
            {selectedIcon ? selectedIcon.name : 'Select icon'}
          </Text>
        </Pressable>
        {openIconDrop && (
          <FlatList
            data={icons}
            keyExtractor={(item, idx) => `${item._id}-${idx}`}
            style={styles.dropdownList}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedIcon(item);
                  setOpenIconDrop(false);
                }}
                style={styles.row}
              >
                {iconImageUrl(item) ? (
                  <Image
                    source={{ uri: iconImageUrl1(item) }}
                    style={styles.iconImg}
                  />
                ) : (
                  <View style={styles.placeholderIcon} />
                )}
                <Text style={styles.rowText}>{item.name}</Text>
              </Pressable>
            )}
          />
        )}

        <Text style={styles.label}>Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="299"
          keyboardType="numeric"
          style={styles.input}
        />

        <Pressable
          style={[
            styles.submitBtn,
            { opacity: canSubmit && !loadingSubmit ? 1 : 0.6 },
          ]}
          disabled={!canSubmit || loadingSubmit}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>
            {loadingSubmit ? 'Submitting...' : 'Create Service'}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default AddService;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },
  label: { fontSize: 14, color: '#151515ff', marginTop: 10, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
  },
  dropdownText: { fontSize: 14, color: '#222' },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    maxHeight: 260,
    marginTop: 8,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10 },
  rowText: { fontSize: 14, color: '#222' },
  rowSub: { fontSize: 12, color: '#777', marginTop: 2 },
  iconImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
  },
  catImg: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  placeholderIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eaeaea',
  },
  placeholderImg: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#eaeaea',
    marginRight: 8,
  },
  submitBtn: {
    marginTop: 16,
    backgroundColor: '#14AD5F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
