// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   TextInput,
//   ScrollView,
// } from 'react-native';
// import HeaderLeft from '../../Component/Header/HeaderLeft';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { useNavigation } from '@react-navigation/native';
// import { CommonActions } from '@react-navigation/native';

// const AllServices1 = ({ route }) => {
//   const { categoryId, categoryName, categoryImage } = route.params;

//   const navigation = useNavigation();

//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [icons, setIcons] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedIcon, setSelectedIcon] = useState(null);

//   const [iconSearch, setIconSearch] = useState('');
//   const [filteredIcons, setFilteredIcons] = useState([]);

//   // Add/Edit Service Form Fields
//   const [serviceName, setServiceName] = useState('');
//   const [serviceDesc, setServiceDesc] = useState('');
//   const [servicePrice, setServicePrice] = useState('');
//   const [editMode, setEditMode] = useState(false);
//   const [editServiceId, setEditServiceId] = useState(null);

//   const [iconDropdownVisible, setIconDropdownVisible] = useState(false);

//   // Category Update Modal
//   const [updateCategoryModalVisible, setUpdateCategoryModalVisible] =
//     useState(false);
//   const [categoryNameInput, setCategoryNameInput] = useState(
//     categoryName || '',
//   );
//   const [categoryImg, setCategoryImg] = useState(null);
//   const [updatedCategoryImage, setUpdatedCategoryImage] =
//     useState(categoryImage);

//   useEffect(() => {
//     fetchServices();
//   }, [categoryId]);

//   useEffect(() => {
//     fetchIcons();
//   }, []);

//   useEffect(() => {
//     if (!modalVisible) {
//       setIconSearch('');
//       setFilteredIcons([]);
//     }
//   }, [modalVisible]);

//   useEffect(() => {
//     if (
//       iconSearch.trim().length > 0 &&
//       (!selectedIcon || iconSearch !== selectedIcon.name)
//     ) {
//       const results = icons.filter(icon =>
//         icon.name.toLowerCase().includes(iconSearch.toLowerCase()),
//       );
//       setFilteredIcons(results);
//     } else {
//       setFilteredIcons([]);
//     }
//   }, [iconSearch, icons, selectedIcon]);

//   // ✅ Fetch services
//   const fetchServices = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `https://www.makeahabit.com/api/v1/service/getAllByServiceCategory/${categoryId}`,
//       );
//       if (response.data?.success) setServices(response.data.services);
//       else Alert.alert('Error', 'Failed to load services');
//     } catch (error) {
//       console.error('Error fetching services:', error);
//       Alert.alert('Error', 'Unable to fetch services');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch service icons
//   const fetchIcons = async () => {
//     try {
//       const res = await axios.get(
//         'https://www.makeahabit.com/api/v1/service/service-icon-list',
//       );
//       if (res.data?.success) setIcons(res.data.icons);
//     } catch (e) {
//       console.log('Error fetching icons', e);
//     }
//   };

//   // ✅ Pick category image
//   const pickCategoryImage = () => {
//     launchImageLibrary({ mediaType: 'photo' }, res => {
//       if (!res.didCancel && res.assets && res.assets.length > 0) {
//         setCategoryImg(res.assets[0]);
//       }
//     });
//   };

//   // ✅ Update Category (Multipart PUT)
//   const handleUpdateCategory = async () => {
//     if (!categoryNameInput.trim()) {
//       Alert.alert('Validation', 'Please enter category name');
//       return;
//     }

//     if (!selectedIcon) {
//       Alert.alert('Validation', 'Please select an icon');
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('vendorToken');
//       const vendorId = await AsyncStorage.getItem('vendorId');

//       // Use JSON payload instead of FormData because no image upload
//       const payload = {
//         serviceCategory: categoryNameInput,
//         vendorId,
//         icon: selectedIcon._id, // pass icon id instead of image
//       };

//       const res = await axios.put(
//         `https://www.makeahabit.com/api/v1/servicecategory/updateServiceCategory/${categoryId}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (res.data?.success) {
//         Alert.alert('Success', 'Category updated successfully!');
//         setUpdateCategoryModalVisible(false);
//         setUpdatedCategoryImage(
//           res.data.updatedCategory?.img || updatedCategoryImage,
//         );
//       } else {
//         Alert.alert('Error', res.data?.message || 'Failed to update category.');
//       }
//     } catch (error) {
//       console.log(
//         'Update category error:',
//         error.response?.data || error.message,
//       );
//       Alert.alert('Error', 'Something went wrong while updating category.');
//     }
//   };

//   // ✅ Delete Category API (DELETE)
//   const deleteCategory = async () => {
//     Alert.alert(
//       'Confirm Delete',
//       'Are you sure you want to delete this entire category? This will remove all its services too!',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const token = await AsyncStorage.getItem('vendorToken');
//               const res = await axios.delete(
//                 `https://www.makeahabit.com/api/v1/servicecategory/deleteServiceCategory/${categoryId}`,
//                 {
//                   headers: { Authorization: `Bearer ${token}` },
//                 },
//               );

//               if (res.data?.success) {
//                 Alert.alert('Deleted', 'Category deleted successfully!');
//                 navigation.goBack();
//               } else {
//                 Alert.alert(
//                   'Error',
//                   res.data?.message || 'Failed to delete category.',
//                 );
//               }
//             } catch (err) {
//               console.log(
//                 'Delete category error:',
//                 err.response?.data || err.message,
//               );
//               Alert.alert(
//                 'Error',
//                 'Something went wrong while deleting category.',
//               );
//             }
//           },
//         },
//       ],
//     );
//   };

//   // ✅ Add service
//   // in addService:
//   const addService = async () => {
//     await fetchIcons();
//     setEditMode(false);
//     setServiceName('');
//     setServiceDesc('');
//     setServicePrice('');
//     setSelectedIcon(null);

//     setFilteredIcons(icons); // Preload icons to show immediately
//     setIconDropdownVisible(false); // dropdown closed initially

//     setModalVisible(true);
//   };

//   // in editService (after icons loaded and selectedIcon set):
//   setFilteredIcons(fetchedIcons || []);
//   setIconDropdownVisible(false);
//   setModalVisible(true);

//   // ✅ Submit new service
//   const handleAddService = async () => {
//     if (!serviceName || !servicePrice || !selectedIcon) {
//       Alert.alert('Validation', 'Please fill all required fields');
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('vendorToken');

//       const payload = {
//         name: serviceName,
//         description: serviceDesc,
//         price: Number(servicePrice),
//         icon: selectedIcon._id,
//         serviceCategory: categoryId,
//       };

//       const res = await axios.post(
//         'https://www.makeahabit.com/api/v1/service/create',
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (res.data?.success) {
//         Alert.alert('Success', 'Service added successfully');
//         setModalVisible(false);
//         fetchServices();
//       } else {
//         Alert.alert('Error', res.data?.message || 'Failed to add service');
//       }
//     } catch (err) {
//       console.log('Add service error:', err.response?.data || err.message);
//       Alert.alert('Error', 'Something went wrong while adding service');
//     }
//   };

//   // ✅ Update existing service
//   const handleUpdateService = async () => {
//     if (!serviceName || !servicePrice || !selectedIcon) {
//       Alert.alert('Validation', 'Please fill all required fields');
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('vendorToken');

//       const payload = {
//         name: serviceName,
//         description: serviceDesc,
//         price: Number(servicePrice),
//         icon: selectedIcon._id,
//         serviceCategory: categoryId,
//       };

//       const res = await axios.put(
//         `https://www.makeahabit.com/api/v1/service/update/${editServiceId}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (res.data?.success) {
//         Alert.alert('Success', 'Service updated successfully');
//         setModalVisible(false);
//         setEditMode(false);
//         setEditServiceId(null);
//         fetchServices();
//       } else {
//         Alert.alert('Error', res.data?.message || 'Failed to update service');
//       }
//     } catch (err) {
//       console.log('Update service error:', err.response?.data || err.message);
//       Alert.alert('Error', 'Something went wrong while updating service');
//     }
//   };

//   // ✅ Delete service
//   const deleteService = async id => {
//     Alert.alert('Confirm', 'Are you sure you want to delete this service?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             const token = await AsyncStorage.getItem('vendorToken');
//             const res = await axios.delete(
//               `https://www.makeahabit.com/api/v1/service/delete/${id}`,
//               {
//                 headers: { Authorization: `Bearer ${token}` },
//               },
//             );
//             if (res.data?.success) {
//               Alert.alert('Deleted', 'Service deleted successfully');
//               fetchServices();
//             } else Alert.alert('Error', 'Failed to delete');
//           } catch (err) {
//             console.log('Delete error', err);
//             Alert.alert('Error', 'Something went wrong');
//           }
//         },
//       },
//     ]);
//   };

//   // ✅ Edit service

//   const editService = async item => {
//     try {
//       // Ensure icons are loaded
//       let fetchedIcons = icons;
//       if (!icons || icons.length === 0) {
//         const res = await axios.get(
//           'https://www.makeahabit.com/api/v1/service/service-icon-list',
//         );
//         fetchedIcons = res.data?.icons || [];
//         setIcons(fetchedIcons);
//       }

//       // Find the icon object from icons list (handles icon as object or id string)
//       const iconId = item.icon?._id || item.icon;
//       const matchedIcon = fetchedIcons.find(i => i._id === iconId);

//       // Populate form fields and icon states
//       setEditMode(true);
//       setEditServiceId(item._id);
//       setServiceName(item.name);
//       setServiceDesc(item.description || '');
//       setServicePrice(String(item.price));
//       setSelectedIcon(matchedIcon || null);
//       setIconSearch(matchedIcon ? matchedIcon.name : '');

//       // Show modal
//       setModalVisible(true);

//       // Preload filteredIcons to show suggestions immediately on focus
//       setFilteredIcons(fetchedIcons);
//     } catch (err) {
//       console.log('Error fetching icons before edit', err);
//       Alert.alert('Error', 'Unable to load icons.');
//     }
//   };

//   const renderService = ({ item }) => (
//     <View style={styles.serviceCard}>
//       {item.icon && item.icon.img ? (
//         <Image
//           source={{
//             uri: `https://www.makeahabit.com/api/v1/uploads/icon/${item.icon.img}`,
//           }}
//           style={styles.serviceImage}
//         />
//       ) : (
//         <View style={[styles.serviceImage, styles.imagePlaceholder]}>
//           <MaterialCommunityIcons name="image-off" size={32} color="#888" />
//         </View>
//       )}

//       <View style={{ flex: 1, marginLeft: 10 }}>
//         <Text style={styles.serviceName}>{item.name}</Text>
//         <Text style={styles.servicePrice}>₹{item.price}</Text>
//       </View>

//       <TouchableOpacity
//         onPress={() => editService(item)}
//         style={styles.iconButton}
//       >
//         <MaterialCommunityIcons name="pencil" size={22} color="#00D65F" />
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => deleteService(item._id)}
//         style={styles.iconButton}
//       >
//         <MaterialCommunityIcons name="delete" size={22} color="#ff4444" />
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <HeaderLeft title="Manage Services" />
//       <View style={styles.container}>
//         <View style={styles.topRow}>
//           <View style={styles.leftSide}>
//             {updatedCategoryImage ? (
//               <Image
//                 source={{
//                   uri: `https://www.makeahabit.com/api/v1/uploads/ServiceCategory/${updatedCategoryImage}`,
//                 }}
//                 style={styles.categoryImage}
//               />
//             ) : (
//               <View style={[styles.categoryImage, styles.imagePlaceholder]}>
//                 <MaterialCommunityIcons
//                   name="image-off"
//                   size={40}
//                   color="#888"
//                 />
//               </View>
//             )}
//             <Text style={styles.categoryName}>{categoryNameInput}</Text>
//           </View>

//           <View style={styles.rightSide}>
//             <TouchableOpacity
//               style={[styles.categoryButton, { backgroundColor: '#0E86D4' }]}
//               onPress={() => setUpdateCategoryModalVisible(true)}
//             >
//               <Text style={styles.addServiceButtonText}>Edit</Text>
//             </TouchableOpacity>

//             {/* <TouchableOpacity
//               style={[styles.categoryButton, { backgroundColor: '#D11A2A' }]}
//               onPress={deleteCategory}
//             >
//               <Text style={styles.addServiceButtonText}>Delete</Text>
//             </TouchableOpacity> */}

//             <TouchableOpacity
//               style={[styles.addServiceButton, { marginTop: 10 }]}
//               onPress={addService}
//             >
//               <Text style={styles.addServiceButtonText}>Add Service</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <Text style={styles.servicesHeader}>Services</Text>

//         {loading ? (
//           <ActivityIndicator
//             size="large"
//             color="#14ad5f"
//             style={{ marginTop: 40 }}
//           />
//         ) : services.length === 0 ? (
//           <Text style={{ color: '#777', marginTop: 20 }}>
//             No services found
//           </Text>
//         ) : (
//           <FlatList
//             data={services}
//             keyExtractor={item => item._id}
//             renderItem={renderService}
//             contentContainerStyle={{ paddingBottom: 20 }}
//             style={{ width: '100%' }}
//           />
//         )}
//       </View>

//       {/* ✅ Add/Edit Service Modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <ScrollView>
//               <Text style={styles.modalTitle}>
//                 {editMode ? 'Edit Service' : 'Add New Service'}
//               </Text>

//               {/* Service Name */}
//               <Text style={styles.label}>Service Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={serviceName}
//                 onChangeText={setServiceName}
//                 placeholder="Enter service name"
//               />

//               {/* Description */}
//               <Text style={styles.label}>Description</Text>
//               <TextInput
//                 style={styles.input}
//                 value={serviceDesc}
//                 onChangeText={setServiceDesc}
//                 placeholder="Enter description"
//               />

//               {/* Price */}
//               <Text style={styles.label}>Price</Text>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="numeric"
//                 value={servicePrice}
//                 onChangeText={setServicePrice}
//                 placeholder="Enter price"
//               />

//               {/* Icon Section */}
//               <Text style={styles.label}>Select Icon</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Search icon by name..."
//                 value={iconSearch}
//                 onChangeText={setIconSearch}
//               />

//               {/* Suggestions dropdown */}
//               {filteredIcons.length > 0 && (
//                 <View style={styles.suggestionBox}>
//                   <ScrollView style={{ maxHeight: 150 }}>
//                     {filteredIcons.map(icon => (
//                       <TouchableOpacity
//                         key={icon._id}
//                         style={[
//                           styles.suggestionItem,
//                           selectedIcon?._id === icon._id &&
//                             styles.selectedSuggestion,
//                         ]}
//                         onPress={() => {
//                           setSelectedIcon(icon);
//                           setIconSearch(icon.name);
//                           setFilteredIcons([]); // hide suggestions after selecting
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

//               {/* Selected Icon Preview */}
//               {selectedIcon && (
//                 <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
//                   <Image
//                     source={{
//                       uri: `https://www.makeahabit.com/api/v1/uploads/icon/${selectedIcon.img}`,
//                     }}
//                     style={{ width: 60, height: 60, borderRadius: 8 }}
//                   />
//                   <Text style={{ marginTop: 5 }}>{selectedIcon.name}</Text>
//                 </View>
//               )}

//               {/* Buttons */}
//               <View style={styles.modalButtons}>
//                 <TouchableOpacity
//                   style={[styles.modalBtn, { backgroundColor: '#14ad5f' }]}
//                   onPress={editMode ? handleUpdateService : handleAddService}
//                 >
//                   <Text style={styles.modalBtnText}>
//                     {editMode ? 'Edit' : 'Add'}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.modalBtn, { backgroundColor: '#ff8383ff' }]}
//                   onPress={() => setModalVisible(false)}
//                 >
//                   <Text style={styles.modalBtnText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* ✅ Update Category Modal */}
//       <Modal
//         visible={updateCategoryModalVisible}
//         animationType="slide"
//         transparent
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Edit Category</Text>

//             {/* Category Name Input */}
//             <Text style={styles.label}>Category Name</Text>
//             <TextInput
//               style={styles.input}
//               value={categoryNameInput}
//               onChangeText={setCategoryNameInput}
//               placeholder="Enter category name"
//             />

//             {/* Icon Search Input */}
//             <Text style={[styles.label, { marginTop: 10 }]}>
//               Select Category Icon
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Search icon by name..."
//               value={iconSearch}
//               onChangeText={setIconSearch}
//               onFocus={() => {
//                 if (icons.length === 0) fetchIcons();
//                 setFilteredIcons(icons); // always show initially
//               }}
//             />

//             {/* Icon dropdown list */}
//             {iconDropdownVisible && filteredIcons.length > 0 && (
//               <View style={styles.suggestionBox}>
//                 <ScrollView style={{ maxHeight: 150 }}>
//                   {filteredIcons.map(icon => (
//                     <TouchableOpacity
//                       key={icon._id}
//                       style={[
//                         styles.suggestionItem,
//                         selectedIcon?._id === icon._id &&
//                           styles.selectedSuggestion,
//                       ]}
//                       onPress={() => {
//                         setSelectedIcon(icon);
//                         setIconSearch(icon.name);
//                         setIconDropdownVisible(false);
//                       }}
//                     >
//                       <Image
//                         source={{
//                           uri: `https://www.makeahabit.com/api/v1/uploads/icon/${icon.img}`,
//                         }}
//                         style={styles.suggestionIcon}
//                       />
//                       <Text style={styles.suggestionText}>{icon.name}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             )}

//             {/* Selected Icon Preview */}
//             {selectedIcon && (
//               <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
//                 <Image
//                   source={{
//                     uri: `https://www.makeahabit.com/api/v1/uploads/icon/${selectedIcon.img}`,
//                   }}
//                   style={{ width: 60, height: 60, borderRadius: 8 }}
//                 />
//                 <Text style={{ marginTop: 5 }}>{selectedIcon.name}</Text>
//               </View>
//             )}

//             {/* Modal Buttons */}
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalBtn, { backgroundColor: '#14ad5f' }]}
//                 onPress={handleUpdateCategory}
//               >
//                 <Text style={styles.modalBtnText}>Save Changes</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.modalBtn, { backgroundColor: '#ff8383ff' }]}
//                 onPress={() => setUpdateCategoryModalVisible(false)}
//               >
//                 <Text style={styles.modalBtnText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, alignItems: 'center' },
//   topRow: {
//     flexDirection: 'row',
//     width: '100%',
//     marginBottom: 20,
//     justifyContent: 'space-between',
//   },
//   leftSide: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     flex: 1,
//   },
//   rightSide: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },
//   categoryButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   categoryImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   imagePlaceholder: {
//     backgroundColor: '#e6e6e6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   categoryName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#333',
//     textAlign: 'center',
//   },
//   addServiceButton: {
//     backgroundColor: '#14ad5f',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   addServiceButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   servicesHeader: {
//     fontSize: 20,
//     fontWeight: '700',
//     alignSelf: 'flex-start',
//     marginBottom: 10,
//   },
//   serviceCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 10,
//     elevation: 3,
//   },
//   serviceImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//   },
//   serviceName: { fontSize: 16, fontWeight: '600', color: '#222' },
//   servicePrice: { color: '#14ad5f', fontWeight: '600' },
//   iconButton: { padding: 6 },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#bbb',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 12,
//   },
//   iconLabel: { fontWeight: '700', marginBottom: 6 },
//   iconOption: {
//     marginRight: 10,
//     alignItems: 'center',
//   },
//   selectedIcon: {
//     borderColor: '#14ad5f',
//     borderWidth: 2,
//     borderRadius: 8,
//   },
//   iconImage: { width: 50, height: 50, borderRadius: 8 },
//   iconName: { fontSize: 12 },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   modalBtn: {
//     flex: 1,
//     marginHorizontal: 5,
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   modalBtnText: { color: '#fff', fontWeight: '600' },
//   suggestionBox: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#14ad5f',
//     borderRadius: 8,
//     marginBottom: 10,
//     elevation: 3,
//   },
//   suggestionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   suggestionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 6,
//     marginRight: 10,
//   },
//   suggestionText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   selectedSuggestion: {
//     backgroundColor: '#e5f9ed',
//   },
//   label: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 5,
//   },

//   imagePickerBtn: {
//     backgroundColor: '#14ad5f',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   imagePickerBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },

//   imagePreviewWrapper: {
//     alignItems: 'center',
//     marginBottom: 15,
//   },

//   imagePreview: {
//     width: 120,
//     height: 120,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#00D65F',
//   },
// });

// export default AllServices1;
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AllServices1 = ({ route }) => {
  const { categoryId, categoryName, categoryImage } = route.params;

  const navigation = useNavigation();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [icons, setIcons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const [iconSearch, setIconSearch] = useState('');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [iconDropdownVisible, setIconDropdownVisible] = useState(false);

  // Add/Edit Service Form Fields
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);

  // Category Update Modal
  const [updateCategoryModalVisible, setUpdateCategoryModalVisible] =
    useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState(
    categoryName || '',
  );
  const [updatedCategoryImage, setUpdatedCategoryImage] =
    useState(categoryImage);

  // Fetch services on categoryId change
  useEffect(() => {
    fetchServices();
  }, [categoryId]);

  // Fetch icons once on mount
  useEffect(() => {
    fetchIcons();
  }, []);

  // Reset icon search and filtered icons on modal close
  useEffect(() => {
    if (!modalVisible) {
      setIconSearch('');
      setFilteredIcons([]);
      setIconDropdownVisible(false);
      setSelectedIcon(null);
    }
  }, [modalVisible]);

  // Filter icons based on iconSearch and selectedIcon
  useEffect(() => {
    if (
      iconSearch.trim().length > 0 &&
      (!selectedIcon || iconSearch !== selectedIcon.name)
    ) {
      const results = icons.filter(icon =>
        icon.name.toLowerCase().includes(iconSearch.toLowerCase()),
      );
      setFilteredIcons(results);
    } else {
      setFilteredIcons([]);
    }
  }, [iconSearch, icons, selectedIcon]);

  // Fetch services API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.makeahabit.com/api/v1/service/getAllByServiceCategory/${categoryId}`,
      );
      if (response.data?.success) setServices(response.data.services);
      else Alert.alert('Error', 'Failed to load services');
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Unable to fetch services');
    } finally {
      setLoading(false);
    }
  };

  // Fetch icons API
  const fetchIcons = async () => {
    try {
      const res = await axios.get(
        'https://www.makeahabit.com/api/v1/service/service-icon-list',
      );
      if (res.data?.success) setIcons(res.data.icons);
    } catch (e) {
      console.log('Error fetching icons', e);
    }
  };

  // Add Service Modal open
  const addService = async () => {
    if (!icons || icons.length === 0) {
      await fetchIcons();
    }
    setEditMode(false);
    setServiceName('');
    setServiceDesc('');
    setServicePrice('');
    setSelectedIcon(null);
    setIconSearch('');
    setFilteredIcons(icons);
    setIconDropdownVisible(false);
    setModalVisible(true);
  };

  // Edit Service Modal open
  const editService = async item => {
    try {
      let fetchedIcons = icons;
      if (!icons || icons.length === 0) {
        const res = await axios.get(
          'https://www.makeahabit.com/api/v1/service/service-icon-list',
        );
        fetchedIcons = res.data?.icons || [];
        setIcons(fetchedIcons);
      }
      const iconId = item.icon?._id || item.icon;
      const matchedIcon = fetchedIcons.find(i => i._id === iconId);

      setEditMode(true);
      setEditServiceId(item._id);
      setServiceName(item.name);
      setServiceDesc(item.description || '');
      setServicePrice(String(item.price));
      setSelectedIcon(matchedIcon || null);
      setIconSearch(matchedIcon ? matchedIcon.name : '');
      setFilteredIcons(fetchedIcons);
      setIconDropdownVisible(false);

      setModalVisible(true);
    } catch (err) {
      console.log('Error fetching icons before edit', err);
      Alert.alert('Error', 'Unable to load icons.');
    }
  };

  // Delete service function
  const deleteService = async id => {
    Alert.alert('Confirm', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('vendorToken');
            const res = await axios.delete(
              `https://www.makeahabit.com/api/v1/service/delete/${id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            if (res.data?.success) {
              Alert.alert('Deleted', 'Service deleted successfully');
              fetchServices();
            } else Alert.alert('Error', 'Failed to delete');
          } catch (err) {
            console.log('Delete error', err);
            Alert.alert('Error', 'Something went wrong');
          }
        },
      },
    ]);
  };

  const handleUpdateCategory = async () => {
    if (!categoryNameInput.trim()) {
      Alert.alert('Validation', 'Please enter category name');
      return;
    }

    if (!selectedIcon) {
      Alert.alert('Validation', 'Please select an icon');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const vendorId = await AsyncStorage.getItem('vendorId');

      const payload = {
        serviceCategory: categoryNameInput,
        vendorId,
        icon: selectedIcon._id,
      };

      const res = await axios.put(
        `https://www.makeahabit.com/api/v1/servicecategory/updateServiceCategory/${categoryId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.data?.success) {
        Alert.alert('Success', 'Category updated successfully!');
        setUpdateCategoryModalVisible(false);
        setUpdatedCategoryImage(
          res.data.updatedCategory?.img || updatedCategoryImage,
        );
      } else {
        Alert.alert('Error', res.data?.message || 'Failed to update category.');
      }
    } catch (error) {
      console.log(
        'Update category error:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Something went wrong while updating category.');
    }
  };

  // Add service submit
  const handleAddService = async () => {
    if (!serviceName || !servicePrice || !selectedIcon) {
      Alert.alert('Validation', 'Please fill all required fields');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const payload = {
        name: serviceName,
        description: serviceDesc,
        price: Number(servicePrice),
        icon: selectedIcon._id,
        serviceCategory: categoryId,
      };
      const res = await axios.post(
        'https://www.makeahabit.com/api/v1/service/create',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (res.data?.success) {
        Alert.alert('Success', 'Service added successfully');
        setModalVisible(false);
        fetchServices();
      } else {
        Alert.alert('Error', res.data?.message || 'Failed to add service');
      }
    } catch (err) {
      console.log('Add service error:', err.response?.data || err.message);
      Alert.alert('Error', 'Something went wrong while adding service');
    }
  };

  // Update service submit
  const handleUpdateService = async () => {
    if (!serviceName || !servicePrice || !selectedIcon) {
      Alert.alert('Validation', 'Please fill all required fields');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const payload = {
        name: serviceName,
        description: serviceDesc,
        price: Number(servicePrice),
        icon: selectedIcon._id,
        serviceCategory: categoryId,
      };
      const res = await axios.put(
        `https://www.makeahabit.com/api/v1/service/update/${editServiceId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (res.data?.success) {
        Alert.alert('Success', 'Service updated successfully');
        setModalVisible(false);
        setEditMode(false);
        setEditServiceId(null);
        fetchServices();
      } else {
        Alert.alert('Error', res.data?.message || 'Failed to update service');
      }
    } catch (err) {
      console.log('Update service error:', err.response?.data || err.message);
      Alert.alert('Error', 'Something went wrong while updating service');
    }
  };

  // Render single service item
  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      {item.icon && item.icon.img ? (
        <Image
          source={{
            uri: `https://www.makeahabit.com/api/v1/uploads/icon/${item.icon.img}`,
          }}
          style={styles.serviceImage}
        />
      ) : (
        <View style={[styles.serviceImage, styles.imagePlaceholder]}>
          <MaterialCommunityIcons name="image-off" size={32} color="#888" />
        </View>
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>₹{item.price}</Text>
      </View>
      <TouchableOpacity
        onPress={() => editService(item)}
        style={styles.iconButton}
      >
        <MaterialCommunityIcons name="pencil" size={22} color="#00D65F" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteService(item._id)}
        style={styles.iconButton}
      >
        <MaterialCommunityIcons name="delete" size={22} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderLeft title="Manage Services" />
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.leftSide}>
            {updatedCategoryImage ? (
              <Image
                source={{
                  uri: `https://www.makeahabit.com/api/v1/uploads/ServiceCategory/${updatedCategoryImage}`,
                }}
                style={styles.categoryImage}
              />
            ) : (
              <View style={[styles.categoryImage, styles.imagePlaceholder]}>
                <MaterialCommunityIcons
                  name="image-off"
                  size={40}
                  color="#888"
                />
              </View>
            )}
            <Text style={styles.categoryName}>{categoryNameInput}</Text>
          </View>
          <View style={styles.rightSide}>
            <TouchableOpacity
              style={[styles.categoryButton, { backgroundColor: '#0E86D4' }]}
              onPress={() => setUpdateCategoryModalVisible(true)}
            >
              <Text style={styles.addServiceButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addServiceButton, { marginTop: 10 }]}
              onPress={addService}
            >
              <Text style={styles.addServiceButtonText}>Add Service</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.servicesHeader}>Services</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#14ad5f"
            style={{ marginTop: 40 }}
          />
        ) : services.length === 0 ? (
          <Text style={{ color: '#777', marginTop: 20 }}>
            No services found
          </Text>
        ) : (
          <FlatList
            data={services}
            keyExtractor={item => item._id}
            renderItem={renderService}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ width: '100%' }}
          />
        )}
      </View>

      {/* Add/Edit Service Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editMode ? 'Edit Service' : 'Add New Service'}
              </Text>

              <Text style={styles.label}>Service Name</Text>
              <TextInput
                style={styles.input}
                value={serviceName}
                onChangeText={setServiceName}
                placeholder="Enter service name"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={serviceDesc}
                onChangeText={setServiceDesc}
                placeholder="Enter description"
              />

              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={servicePrice}
                onChangeText={setServicePrice}
                placeholder="Enter price"
              />

              <Text style={styles.label}>Select Icon</Text>
              <TextInput
                style={styles.input}
                placeholder="Search icon by name..."
                value={iconSearch}
                onChangeText={setIconSearch}
                onFocus={() => {
                  setIconDropdownVisible(true);
                  if (iconSearch.trim() === '') setFilteredIcons(icons);
                }}
                onBlur={() =>
                  setTimeout(() => setIconDropdownVisible(false), 150)
                }
              />

              {iconDropdownVisible && filteredIcons.length > 0 && (
                <View style={styles.suggestionBox}>
                  <ScrollView style={{ maxHeight: 150 }}>
                    {filteredIcons.map(icon => (
                      <TouchableOpacity
                        key={icon._id}
                        style={[
                          styles.suggestionItem,
                          selectedIcon?._id === icon._id &&
                            styles.selectedSuggestion,
                        ]}
                        onPress={() => {
                          setSelectedIcon(icon);
                          setIconSearch(icon.name);
                          setIconDropdownVisible(false);
                          setFilteredIcons([]);
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
                <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
                  <Image
                    source={{
                      uri: `https://www.makeahabit.com/api/v1/uploads/icon/${selectedIcon.img}`,
                    }}
                    style={{ width: 60, height: 60, borderRadius: 8 }}
                  />
                  <Text style={{ marginTop: 5 }}>{selectedIcon.name}</Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#14ad5f' }]}
                  onPress={editMode ? handleUpdateService : handleAddService}
                >
                  <Text style={styles.modalBtnText}>
                    {editMode ? 'Edit' : 'Add'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#ff8383ff' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Update Category Modal */}
      <Modal
        visible={updateCategoryModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Category</Text>

            <Text style={styles.label}>Category Name</Text>
            <TextInput
              style={styles.input}
              value={categoryNameInput}
              onChangeText={setCategoryNameInput}
              placeholder="Enter category name"
            />

            <Text style={[styles.label, { marginTop: 10 }]}>
              Select Category Icon
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Search icon by name..."
              value={iconSearch}
              onChangeText={setIconSearch}
              onFocus={() => {
                if (icons.length === 0) fetchIcons();
                setFilteredIcons(icons);
                setIconDropdownVisible(true);
              }}
              onBlur={() =>
                setTimeout(() => setIconDropdownVisible(false), 150)
              }
            />

            {iconDropdownVisible && filteredIcons.length > 0 && (
              <View style={styles.suggestionBox}>
                <ScrollView style={{ maxHeight: 150 }}>
                  {filteredIcons.map(icon => (
                    <TouchableOpacity
                      key={icon._id}
                      style={[
                        styles.suggestionItem,
                        selectedIcon?._id === icon._id &&
                          styles.selectedSuggestion,
                      ]}
                      onPress={() => {
                        setSelectedIcon(icon);
                        setIconSearch(icon.name);
                        setIconDropdownVisible(false);
                        setFilteredIcons([]);
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
              <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
                <Image
                  source={{
                    uri: `https://www.makeahabit.com/api/v1/uploads/icon/${selectedIcon.img}`,
                  }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
                <Text style={{ marginTop: 5 }}>{selectedIcon.name}</Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#14ad5f' }]}
                onPress={handleUpdateCategory}
              >
                <Text style={styles.modalBtnText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ff8383ff' }]}
                onPress={() => setUpdateCategoryModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  leftSide: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  rightSide: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  imagePlaceholder: {
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  addServiceButton: {
    backgroundColor: '#14ad5f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addServiceButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  servicesHeader: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#222' },
  servicePrice: { color: '#14ad5f', fontWeight: '600' },
  iconButton: { padding: 6 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '600' },
  suggestionBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#14ad5f',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSuggestion: {
    backgroundColor: '#e5f9ed',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
});

export default AllServices1;
