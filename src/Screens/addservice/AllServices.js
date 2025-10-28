// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   StyleSheet,
// //   ActivityIndicator,
// //   TouchableOpacity,
// //   Alert,
// //   Modal,
// //   TextInput,
// //   Image,
// //   ScrollView,
// // } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import LinearGradient from 'react-native-linear-gradient';
// // import HeaderLeft from '../../Component/Header/HeaderLeft';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { launchImageLibrary } from 'react-native-image-picker';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { fetchVendorDetails } from '../../redux/Vendor/vendorDetailsSlice';

// // const CATEGORY_BASE = 'https://www.makeahabit.com/api/v1/servicecategory/';
// // const CREATE_CATEGORY_API =
// //   'https://www.makeahabit.com/api/v1/servicecategory/createServiceCategory';
// // const IMAGE_BASE = 'https://www.makeahabit.com/api/v1/uploads';

// // export default function ServiceCategoryManager() {
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [categoryId, setCategoryId] = useState(null);
// //   const dispatch = useDispatch();
// //   useEffect(() => {
// //     dispatch(fetchVendorDetails());
// //   }, []);
// //   const vendor = useSelector(state => state.vendorDetails.vendor);

// //   const categoryId1 = vendor?.data?.category?._id;
// //   console.log(vendor);
// //   // Modal states
// //   const [showModal, setShowModal] = useState(false);
// //   const [categoryName, setCategoryName] = useState('');
// //   const [editingCategoryId, setEditingCategoryId] = useState(null);
// //   const [selectedImage, setSelectedImage] = useState(null);

// //   // fetch categories
// //   const fetchCategories = async () => {
// //     setLoading(true);
// //     try {
// //       const token = await AsyncStorage.getItem('vendorToken');
// //       if (!token) return;
// //       const res = await fetch(`${CATEGORY_BASE}getAll`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       const data = await res.json();
// //       if (data.success) setCategories(data.categories || []);
// //     } catch (err) {
// //       console.log('Fetch categories error:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useFocusEffect(
// //     useCallback(() => {
// //       fetchCategories();
// //     }, []),
// //   );

// //   // pick image
// //   const handleImagePick = async () => {
// //     const result = await launchImageLibrary({ mediaType: 'photo' });
// //     if (!result.didCancel && result.assets?.length > 0) {
// //       setSelectedImage(result.assets[0]);
// //     }
// //   };

// //   // create or edit category
// //   const handleSaveCategory = async () => {
// //     if (!categoryName.trim()) {
// //       Alert.alert('Error', 'Please enter a category name.');
// //       return;
// //     }

// //     const vendorId = await AsyncStorage.getItem('vendorId');
// //     const token = await AsyncStorage.getItem('vendorToken');

// //     if (!vendorId || !token) {
// //       Alert.alert('Error', 'Vendor ID or token not found.');
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append('serviceCategory', categoryName);
// //     formData.append('Vendor', vendorId);
// //     if (selectedImage) {
// //       formData.append('img', {
// //         uri: selectedImage.uri,
// //         name: selectedImage.fileName || 'category.jpg',
// //         type: selectedImage.type || 'image/jpeg',
// //       });
// //     }
// //     formData.append('category, category');

// //     try {
// //       const apiUrl = editingCategoryId
// //         ? `${CATEGORY_BASE}update/${editingCategoryId}`
// //         : CREATE_CATEGORY_API;

// //       const method = editingCategoryId ? 'PUT' : 'POST';

// //       const res = await fetch(apiUrl, {
// //         method,
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'multipart/form-data',
// //         },
// //         body: formData,
// //       });

// //       const data = await res.json();
// //       if (data.success || data.message === 'Service Category created') {
// //         Alert.alert('Success', editingCategoryId ? 'Updated' : 'Created');
// //         setShowModal(false);
// //         setCategoryName('');
// //         setSelectedImage(null);
// //         setEditingCategoryId(null);
// //         fetchCategories();
// //       } else {
// //         Alert.alert('Error', data.message || 'Something went wrong.');
// //       }
// //     } catch (err) {
// //       console.log('Save category error:', err);
// //       Alert.alert('Error', 'Failed to save category.');
// //     }
// //   };

// //   // delete category
// //   const handleDelete = async id => {
// //     Alert.alert('Delete Category', 'Are you sure you want to delete this?', [
// //       { text: 'Cancel', style: 'cancel' },
// //       {
// //         text: 'Delete',
// //         style: 'destructive',
// //         onPress: async () => {
// //           try {
// //             const token = await AsyncStorage.getItem('vendorToken');
// //             if (!token) return;
// //             const res = await fetch(`${CATEGORY_BASE}delete/${id}`, {
// //               method: 'DELETE',
// //               headers: { Authorization: `Bearer ${token}` },
// //             });
// //             const data = await res.json();
// //             if (data.success) {
// //               Alert.alert('Deleted', 'Category deleted successfully');
// //               fetchCategories();
// //             } else {
// //               Alert.alert('Error', data.message || 'Delete failed');
// //             }
// //           } catch (err) {
// //             console.log('Delete error:', err);
// //           }
// //         },
// //       },
// //     ]);
// //   };

// //   const handleEdit = category => {
// //     setCategoryName(category.serviceCategory);
// //     setSelectedImage(null);
// //     setEditingCategoryId(category._id);
// //     setShowModal(true);
// //   };

// //   const renderItem = ({ item }) => (
// //     <View style={styles.card}>
// //       <View style={styles.leftRow}>
// //         <Image
// //           source={{ uri: `${IMAGE_BASE}${item.img}` }}
// //           style={styles.categoryImage}
// //         />
// //         <Text style={styles.categoryName}>{item.serviceCategory}</Text>
// //       </View>
// //       <View style={styles.actionRow}>
// //         <TouchableOpacity
// //           onPress={() => handleEdit(item)}
// //           style={styles.actionBtn}
// //         >
// //           <Icon name="pencil" size={22} color="#007BFF" />
// //         </TouchableOpacity>
// //         <TouchableOpacity
// //           onPress={() => handleDelete(item._id)}
// //           style={styles.actionBtn}
// //         >
// //           <Icon name="delete" size={22} color="#E25438" />
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
// //       <View style={{ flex: 1, padding: 16 }}>
// //         <HeaderLeft title="Service Categories" />

// //         <TouchableOpacity
// //           style={[styles.addBtn, { marginVertical: 12 }]}
// //           onPress={() => {
// //             setEditingCategoryId(null);
// //             setCategoryName('');
// //             setSelectedImage(null);
// //             setShowModal(true);
// //           }}
// //         >
// //           <Text style={styles.addBtnText}>Add Category</Text>
// //         </TouchableOpacity>

// //         {loading ? (
// //           <ActivityIndicator size="large" color="#01823A" />
// //         ) : (
// //           <FlatList
// //             data={categories}
// //             keyExtractor={item => item._id}
// //             renderItem={renderItem}
// //             ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
// //             ListEmptyComponent={
// //               <Text style={{ textAlign: 'center', marginTop: 20 }}>
// //                 No categories found
// //               </Text>
// //             }
// //           />
// //         )}

// //         {/* Modal */}
// //         <Modal visible={showModal} transparent animationType="slide">
// //           <View style={styles.modalContainer}>
// //             <ScrollView contentContainerStyle={styles.modalContent}>
// //               <Text style={styles.modalTitle}>
// //                 {editingCategoryId ? 'Edit Category' : 'Add Category'}
// //               </Text>

// //               <TextInput
// //                 placeholder="Category Name"
// //                 value={categoryName}
// //                 onChangeText={setCategoryName}
// //                 style={styles.input}
// //               />

// //               <TouchableOpacity
// //                 style={styles.uploadBtn}
// //                 onPress={handleImagePick}
// //               >
// //                 <Text>Select Image</Text>
// //               </TouchableOpacity>

// //               {selectedImage && (
// //                 <Image
// //                   source={{ uri: selectedImage.uri }}
// //                   style={styles.previewImage}
// //                 />
// //               )}

// //               <TouchableOpacity
// //                 style={styles.submitBtn}
// //                 onPress={handleSaveCategory}
// //               >
// //                 <Text style={styles.submitText}>
// //                   {editingCategoryId ? 'Update' : 'Add'}
// //                 </Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity onPress={() => setShowModal(false)}>
// //                 <Text style={styles.cancelText}>Cancel</Text>
// //               </TouchableOpacity>
// //             </ScrollView>
// //           </View>
// //         </Modal>
// //       </View>
// //     </LinearGradient>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   addBtn: {
// //     backgroundColor: '#00D65F',
// //     paddingVertical: 10,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //   },
// //   addBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
// //   card: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: 12,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   leftRow: { flexDirection: 'row', alignItems: 'center' },
// //   categoryImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
// //   categoryName: { fontSize: 16, fontWeight: '600', color: '#222' },
// //   actionRow: { flexDirection: 'row' },
// //   actionBtn: { marginLeft: 12 },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     backgroundColor: '#00000099',
// //     padding: 20,
// //   },
// //   modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
// //   modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 10,
// //     padding: 10,
// //     marginVertical: 6,
// //   },
// //   uploadBtn: {
// //     borderWidth: 1,
// //     borderColor: '#aaa',
// //     padding: 10,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     marginVertical: 10,
// //   },
// //   previewImage: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 8,
// //     alignSelf: 'center',
// //     marginVertical: 8,
// //   },
// //   submitBtn: {
// //     backgroundColor: '#00D65F',
// //     paddingVertical: 10,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //     marginTop: 10,
// //   },
// //   submitText: { color: '#fff', fontWeight: 'bold' },
// //   cancelText: { textAlign: 'center', color: '#555', marginTop: 10 },
// // });
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchVendorDetails } from '../../redux/Vendor/vendorDetailsSlice';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import HeaderLeft from '../../Component/Header/HeaderLeft';

const CategoryManager = () => {
  const dispatch = useDispatch();
  const vendor = useSelector(state => state.vendorDetails.vendor);
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [icons, setIcons] = useState([]); // all icons
  const [filteredIcons, setFilteredIcons] = useState([]); // for autocomplete
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [iconQuery, setIconQuery] = useState(''); // input text for autocomplete
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const vendorId = await AsyncStorage.getItem('vendorId');
      const token = await AsyncStorage.getItem('vendorToken');
      if (!vendorId || !token) return;

      setLoading(true);
      const res = await axios.get(
        `https://www.makeahabit.com/api/v1/servicecategory/getServiceCategoryByVendorId/${vendorId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log(res.data.data);
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.log(
        '❌ Error fetching categories:',
        err.response?.data || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch icon list
  const fetchIcons = async () => {
    try {
      const res = await axios.get(
        'https://www.makeahabit.com/api/v1/service/service-icon-list',
      );
      if (res.data.success) {
        setIcons(res.data.icons);
        setFilteredIcons(res.data.icons);
      }
    } catch (err) {
      console.log(
        '❌ Error fetching icons:',
        err.response?.data || err.message,
      );
    }
  };

  useEffect(() => {
    dispatch(fetchVendorDetails());
    fetchIcons();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, []),
  );

  // ✅ Autocomplete filter logic
  const handleIconSearch = text => {
    setIconQuery(text);
    if (text.trim() === '') {
      setFilteredIcons(icons);
      setShowSuggestions(false);
    } else {
      const filtered = icons.filter(icon =>
        icon.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredIcons(filtered);
      setShowSuggestions(true);
    }
  };

  // ✅ Create new category
  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'Please enter category name.');
      return;
    }
    if (!selectedIcon) {
      Alert.alert('Error', 'Please select an icon.');
      return;
    }

    const vendorId = await AsyncStorage.getItem('vendorId');
    const token = await AsyncStorage.getItem('vendorToken');
    const category = vendor?.data?.category;

    if (!vendorId || !token || !category) {
      Alert.alert('Error', 'Missing vendor, token, or category ID.');
      return;
    }

    const body = {
      serviceCategory: categoryName,
      category,
      vendorId,
      icon: selectedIcon._id,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        'https://www.makeahabit.com/api/v1/serviceCategory/createServiceCategory',
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.data.success) {
        showSuccessModal();
        setShowModal(false);
        setCategoryName('');
        setSelectedIcon(null);
        setIconQuery('');
        fetchCategories();
      } else {
        Alert.alert('Error', res.data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.log(
        '❌ Create Category Error:',
        err.response?.data || err.message,
      );
      Alert.alert('Error', 'Failed to create category.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessModal = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <View style={styles.container}>
      <HeaderLeft title={'Manage Categories'} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <MaterialCommunityIcons name="plus" color="#fff" size={22} />
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#14ad5f" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AllServices1', {
                  categoryId: item._id,
                  categoryName: item.serviceCategory,
                  categoryImage: item.icon?.img,
                })
              }
              style={styles.card}
            >
              {item.icon?.img ? (
                <Image
                  source={{
                    uri: `https://www.makeahabit.com/api/v1/uploads/icon/${item.icon.img}`,
                  }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <MaterialCommunityIcons
                    name="image-off"
                    size={30}
                    color="#999"
                  />
                </View>
              )}
              <Text style={styles.cardText}>{item.serviceCategory}</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={26}
                color="#14ad5f"
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
          )}
        />
      )}

      {/* ✅ Add Category Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Add New Service Category</Text>

              <TextInput
                placeholder="Enter category name"
                value={categoryName}
                onChangeText={setCategoryName}
                style={styles.input}
              />

              {/* ✅ Icon Autocomplete Input */}
              <Text style={styles.label}>Search Icon</Text>
              <TextInput
                placeholder="Type icon name..."
                value={iconQuery}
                onChangeText={handleIconSearch}
                style={styles.input}
                onFocus={() => setShowSuggestions(true)}
              />

              {/* ✅ Suggestions Dropdown */}
              {showSuggestions && filteredIcons.length > 0 && (
                <View style={styles.suggestionBox}>
                  <ScrollView style={{ maxHeight: 150 }}>
                    {filteredIcons.map(icon => (
                      <TouchableOpacity
                        key={icon._id}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setSelectedIcon(icon);
                          setIconQuery(icon.name);
                          setShowSuggestions(false);
                        }}
                      >
                        <Image
                          source={{
                            uri: `https://www.makeahabit.com/api/v1/uploads/icon/${icon.img}`,
                          }}
                          style={styles.suggestionIcon}
                        />
                        <Text style={styles.suggestionText}>{icon.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {selectedIcon && (
                <View style={styles.selectedIconPreview}>
                  <Image
                    source={{
                      uri: `https://www.makeahabit.com/api/v1/uploads/icon/${selectedIcon.img}`,
                    }}
                    style={styles.iconPreviewImg}
                  />
                  <Text style={styles.iconPreviewText}>
                    {selectedIcon.name}
                  </Text>
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(false);
                    setCategoryName('');
                    setSelectedIcon(null);
                    setIconQuery('');
                    setShowSuggestions(false);
                  }}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveCategory}
                  style={styles.saveBtn}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ✅ Success Modal */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successBox}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successText}>Category Added Successfully!</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CategoryManager;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#14ad5f',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  addButtonText: { color: '#fff', fontSize: 16, marginLeft: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  placeholderImage: {
    width: 50,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: { fontSize: 16, color: '#333', flex: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 16,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  suggestionBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionIcon: { width: 30, height: 30, borderRadius: 5, marginRight: 10 },
  suggestionText: { fontSize: 14, color: '#333' },
  selectedIconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 10,
  },
  iconPreviewImg: { width: 40, height: 40, marginRight: 10, borderRadius: 6 },
  iconPreviewText: { fontSize: 14, color: '#14ad5f', fontWeight: '600' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelBtn: { marginRight: 12 },
  cancelText: {
    backgroundColor: '#ff8383ff',
    color: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  saveBtn: {
    backgroundColor: '#14ad5f',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    backgroundColor: '#fff',
    paddingVertical: 25,
    paddingHorizontal: 35,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  successEmoji: { fontSize: 40, marginBottom: 8 },
  successText: { fontSize: 16, fontWeight: '700', color: '#14ad5f' },
});
