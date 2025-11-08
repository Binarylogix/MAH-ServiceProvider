// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   Modal,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useSelector, useDispatch } from 'react-redux';
// import axios from 'axios';
// import { fetchVendorDetails } from '../../redux/Vendor/vendorDetailsSlice';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import HeaderLeft from '../../Component/Header/HeaderLeft';

// const CategoryManager = () => {
//   const dispatch = useDispatch();
//   const vendor = useSelector(state => state.vendorDetails.vendor);
//   const navigation = useNavigation();

//   const [categories, setCategories] = useState([]);
//   const [icons, setIcons] = useState([]); // all icons
//   const [filteredIcons, setFilteredIcons] = useState([]); // for autocomplete
//   const [showModal, setShowModal] = useState(false);
//   const [categoryName, setCategoryName] = useState('');
//   const [iconQuery, setIconQuery] = useState(''); // input text for autocomplete
//   const [selectedIcon, setSelectedIcon] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   console.log('categories', categories);

//   // ✅ Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const vendorId = await AsyncStorage.getItem('vendorId');
//       const token = await AsyncStorage.getItem('vendorToken');
//       if (!vendorId || !token) return;

//       console.log('Fetching categories for vendorId:', vendorId);

//       setLoading(true);
//       const res = await axios.get(
//         `https://www.makeahabit.com/api/v1/newservicecategories/listByCategory/${vendor?.data?.category}`,
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       console.log('new data', res.data.categories);
//       setCategories(res?.data?.data || []);
//     } catch (err) {
//       console.log(
//         '❌ Error fetching categories:',
//         err.response?.data || err.message,
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch icon list
//   const fetchIcons = async () => {
//     try {
//       const res = await axios.get(
//         'https://www.makeahabit.com/api/v1/service/service-icon-list',
//       );
//       if (res.data.success) {
//         setIcons(res.data.icons);
//         setFilteredIcons(res.data.icons);
//       }
//     } catch (err) {
//       console.log(
//         '❌ Error fetching icons:',
//         err.response?.data || err.message,
//       );
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchVendorDetails());
//     fetchIcons();
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchCategories();
//     }, []),
//   );

//   // ✅ Autocomplete filter logic
//   const handleIconSearch = text => {
//     setIconQuery(text);
//     if (text.trim() === '') {
//       setFilteredIcons(icons);
//       setShowSuggestions(false);
//     } else {
//       const filtered = icons.filter(icon =>
//         icon.name.toLowerCase().includes(text.toLowerCase()),
//       );
//       setFilteredIcons(filtered);
//       setShowSuggestions(true);
//     }
//   };

//   // ✅ Create new category
//   const handleSaveCategory = async () => {
//     if (!categoryName.trim()) {
//       Alert.alert('Error', 'Please enter category name.');
//       return;
//     }
//     if (!selectedIcon) {
//       Alert.alert('Error', 'Please select an icon.');
//       return;
//     }

//     const vendorId = await AsyncStorage.getItem('vendorId');
//     const token = await AsyncStorage.getItem('vendorToken');
//     const category = vendor?.data?.category;

//     if (!vendorId || !token || !category) {
//       Alert.alert('Error', 'Missing vendor, token, or category ID.');
//       return;
//     }

//     const body = {
//       serviceCategory: categoryName,
//       category,
//       vendorId,
//       icon: selectedIcon._id,
//     };

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         'https://www.makeahabit.com/api/v1/serviceCategory/createServiceCategory',
//         body,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (res.data.success) {
//         showSuccessModal();
//         setShowModal(false);
//         setCategoryName('');
//         setSelectedIcon(null);
//         setIconQuery('');
//         fetchCategories();
//       } else {
//         Alert.alert('Error', res.data.message || 'Something went wrong.');
//       }
//     } catch (err) {
//       console.log(
//         '❌ Create Category Error:',
//         err.response?.data || err.message,
//       );
//       Alert.alert('Error', 'Failed to create category.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showSuccessModal = () => {
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 2000);
//   };

//   return (
//     <View style={styles.container}>
//       <HeaderLeft title={'Manage Categories'} />

//       {/* <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => setShowModal(true)}
//       >
//         <MaterialCommunityIcons name="plus" color="#fff" size={22} />
//         <Text style={styles.addButtonText}>Add Category</Text>
//       </TouchableOpacity> */}

//       {loading ? (
//         <ActivityIndicator size="large" color="#14ad5f" />
//       ) : (
//         <FlatList
//           data={categories}
//           keyExtractor={item => item._id}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() =>
//                 navigation.navigate('AllServices1', {
//                   categoryId: item._id,
//                   categoryName: item.serviceCategoryName,
//                   categoryImage: item.icon?.img,
//                 })
//               }
//               style={styles.card}
//             >
//               {item.icon?.img ? (
//                 <Image
//                   source={{
//                     uri: `https://www.makeahabit.com/api/v1/uploads/icon/${item.icon.img}`,
//                   }}
//                   style={styles.cardImage}
//                 />
//               ) : (
//                 <View style={styles.placeholderImage}>
//                   <MaterialCommunityIcons
//                     name="image-off"
//                     size={30}
//                     color="#999"
//                   />
//                 </View>
//               )}
//               <Text style={styles.cardText}>{item.serviceCategoryName}</Text>
//               <MaterialCommunityIcons
//                 name="chevron-right"
//                 size={26}
//                 color="#14ad5f"
//                 style={{ marginLeft: 'auto' }}
//               />
//             </TouchableOpacity>
//           )}
//         />
//       )}

//       {/* ✅ Add Category Modal */}
//       <Modal visible={showModal} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <ScrollView keyboardShouldPersistTaps="handled">
//               <Text style={styles.modalTitle}>Add New Service Category</Text>

//               <TextInput
//                 placeholder="Enter category name"
//                 value={categoryName}
//                 onChangeText={setCategoryName}
//                 style={styles.input}
//               />

//               {/* ✅ Icon Autocomplete Input */}
//               <Text style={styles.label}>Search Icon</Text>
//               <TextInput
//                 placeholder="Type icon name..."
//                 value={iconQuery}
//                 onChangeText={handleIconSearch}
//                 style={styles.input}
//                 onFocus={() => setShowSuggestions(true)}
//               />

//               {/* ✅ Suggestions Dropdown */}
//               {showSuggestions && filteredIcons.length > 0 && (
//                 <View style={styles.suggestionBox}>
//                   <ScrollView style={{ maxHeight: 150 }}>
//                     {filteredIcons.map(icon => (
//                       <TouchableOpacity
//                         key={icon._id}
//                         style={styles.suggestionItem}
//                         onPress={() => {
//                           setSelectedIcon(icon);
//                           setIconQuery(icon.name);
//                           setShowSuggestions(false);
//                         }}
//                       >
//                         <Image
//                           source={{
//                             uri: `https://www.makeahabit.com/api/v1/uploads/icon/${icon.img}`,
//                           }}
//                           style={styles.suggestionIcon}
//                         />
//                         <Text style={styles.suggestionText}>{icon.name}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </ScrollView>
//                 </View>
//               )}

//               {selectedIcon && (
//                 <View style={styles.selectedIconPreview}>
//                   <Image
//                     source={{
//                       uri: `https://www.makeahabit.com/api/v1/uploads/icon/${selectedIcon.img}`,
//                     }}
//                     style={styles.iconPreviewImg}
//                   />
//                   <Text style={styles.iconPreviewText}>
//                     {selectedIcon.name}
//                   </Text>
//                 </View>
//               )}

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setShowModal(false);
//                     setCategoryName('');
//                     setSelectedIcon(null);
//                     setIconQuery('');
//                     setShowSuggestions(false);
//                   }}
//                   style={styles.cancelBtn}
//                 >
//                   <Text style={styles.cancelText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={handleSaveCategory}
//                   style={styles.saveBtn}
//                 >
//                   <Text style={styles.saveText}>Save</Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* ✅ Success Modal */}
//       {showSuccess && (
//         <View style={styles.successOverlay}>
//           <View style={styles.successBox}>
//             <Text style={styles.successEmoji}>🎉</Text>
//             <Text style={styles.successText}>Category Added Successfully!</Text>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default CategoryManager;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   addButton: {
//     flexDirection: 'row',
//     backgroundColor: '#14ad5f',
//     paddingVertical: 10,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     marginTop: 10,
//   },
//   addButtonText: { color: '#fff', fontSize: 16, marginLeft: 8 },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fafafa',
//     padding: 10,
//     marginTop: 10,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cardImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
//   placeholderImage: {
//     width: 50,
//     height: 50,
//     backgroundColor: '#eee',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   cardText: { fontSize: 16, color: '#333', flex: 1 },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     width: '90%',
//     borderRadius: 16,
//     padding: 20,
//     maxHeight: '85%',
//   },
//   modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 12,
//   },
//   label: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
//   suggestionBox: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//     zIndex: 10,
//   },
//   suggestionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   suggestionIcon: { width: 30, height: 30, borderRadius: 5, marginRight: 10 },
//   suggestionText: { fontSize: 14, color: '#333' },
//   selectedIconPreview: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     backgroundColor: '#f9f9f9',
//     padding: 8,
//     borderRadius: 10,
//   },
//   iconPreviewImg: { width: 40, height: 40, marginRight: 10, borderRadius: 6 },
//   iconPreviewText: { fontSize: 14, color: '#14ad5f', fontWeight: '600' },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 10,
//   },
//   cancelBtn: { marginRight: 12 },
//   cancelText: {
//     backgroundColor: '#ff8383ff',
//     color: '#fff',
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 18,
//   },
//   saveBtn: {
//     backgroundColor: '#14ad5f',
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 18,
//   },
//   saveText: { color: '#fff', fontSize: 15, fontWeight: '600' },
//   successOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.25)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   successBox: {
//     backgroundColor: '#fff',
//     paddingVertical: 25,
//     paddingHorizontal: 35,
//     borderRadius: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   successEmoji: { fontSize: 40, marginBottom: 8 },
//   successText: { fontSize: 16, fontWeight: '700', color: '#14ad5f' },
// });
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

      const res = await axios.get(
        `https://www.makeahabit.com/api/v1/newservicecategories/listByCategory/${parentCategoryId}`,
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
