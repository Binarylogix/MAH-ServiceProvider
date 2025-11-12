import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import LinearGradient from 'react-native-linear-gradient';

const AllServices1 = ({ route }) => {
  const { categoryId, categoryName, categoryImage } = route.params;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal and form states
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [serviceId, setServiceId] = useState(null);

  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [icons, setIcons] = useState([]);
  const [iconSearch, setIconSearch] = useState('');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch vendor services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const vendorId = await AsyncStorage.getItem('vendorId');
      const response = await axios.get(
        `https://www.makeahabit.com/api/v1/vendorservices/getVendorServicesByVendorAndCatId/${vendorId}/${categoryId}`,
      );
      setServices(response.data.data || []);
    } catch (e) {
      // Alert.alert('Error', 'Failed to fetch services');
    }
    setLoading(false);
  };

  // Fetch icons for autocomplete
  const fetchIcons = async () => {
    try {
      const res = await axios.get(
        'https://www.makeahabit.com/api/v1/service/service-icon-list',
      );
      if (res.data.success) setIcons(res.data.icons);
    } catch {
      Alert.alert('Error', 'Failed to load icons');
    }
  };

  useEffect(() => {
    fetchServices();
  }, [categoryId]);

  useEffect(() => {
    fetchIcons();
  }, []);

  // Filter icons for autocomplete
  useEffect(() => {
    if (iconSearch.trim()) {
      const filtered = icons.filter(icon =>
        icon.name.toLowerCase().includes(iconSearch.toLowerCase()),
      );
      setFilteredIcons(filtered);
    } else {
      setFilteredIcons([]);
    }
  }, [iconSearch, icons]);

  // Open modal for add
  const openAddModal = () => {
    setEditMode(false);
    setEditServiceId(null);
    setServiceName('');
    setServicePrice('');
    setSelectedIcon(null);
    setIconSearch('');
    setFilteredIcons([]);
    setModalVisible(true);
  };

  // Open modal for edit
  const openEditModal = service => {
    console.log(service._id);
    setEditMode(true);
    setEditServiceId(service._id);
    // setServiceName(service.service?.serviceName || '');
    // setServicePrice(service.price?.toString() || '');
    // const iconId = service.service?.icon?._id || service.service?.icon;
    // const matchIcon = icons.find(i => i._id === iconId) || null;
    // setSelectedIcon(matchIcon);
    // setIconSearch(matchIcon?.name || '');
    // setFilteredIcons([]);
    setModalVisible(true);
  };

  // Add or update service handler
  // const handleAddOrEditService = async () => {
  //   if (!serviceName.trim() || !servicePrice.trim() || !selectedIcon) {
  //     Alert.alert(
  //       'Validation',
  //       'Please fill all fields including icon selection',
  //     );
  //     return;
  //   }

  //   setIsSaving(true);
  //   try {
  //     const vendorId = await AsyncStorage.getItem('vendorId');
  //     const token = await AsyncStorage.getItem('vendorToken');

  //     // Check if service exists globally
  //     const allServicesRes = await axios.get(
  //       'https://www.makeahabit.com/api/v1/newservice/all',
  //     );
  //     let serviceId = allServicesRes.data.data?.find(
  //       s => s.serviceName.toLowerCase() === serviceName.toLowerCase(),
  //     )?._id;
  //     console.log('dd');
  //     if (editMode) {
  //       // Update vendor service
  //       await axios.put(
  //         `https://www.makeahabit.com/api/v1/vendorservices/update/${editServiceId}`,
  //         { price: Number(servicePrice), service: serviceId },
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );
  //       Alert.alert('Success', 'Service updated successfully');
  //     } else {
  //       // Add new vendor service
  //       console.log('aa', vendorId, {
  //         Vendor: vendorId,
  //         category: categoryId,
  //         serviceCategory: categoryId,
  //         service: serviceId,
  //         price: Number(servicePrice),
  //       });
  //       await axios.post(
  //         'https://www.makeahabit.com/api/v1/vendorservices/addVendorService',
  //         {
  //           Vendor: vendorId,
  //           category: categoryId,
  //           serviceCategory: categoryId,
  //           service: serviceId,
  //           price: Number(servicePrice),
  //         },
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );
  //       Alert.alert('Success', 'Service added successfully');
  //     }

  //     setModalVisible(false);
  //     fetchServices();

  //     // Reset form states
  //     setEditMode(false);
  //     setEditServiceId(null);
  //     setServiceName('');
  //     setServicePrice('');
  //     setSelectedIcon(null);
  //     setIconSearch('');
  //     setFilteredIcons([]);
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to add or update service');
  //     console.log(error);
  //   }
  //   setIsSaving(false);
  // };
  const [allServices, setAllServices] = useState([]);
  const [selectedFullService, setSelectedFullService] = useState(null);

  // Fetch all services globally once
  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const res = await axios.get(
          'https://www.makeahabit.com/api/v1/newservice/all',
        );
        setAllServices(res.data.data || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to load all services');
      }
    };
    fetchAllServices();
  }, []);

  // Filter services by name for autocomplete suggestions
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    if (serviceName.trim()) {
      const filtered = allServices.filter(s =>
        s.serviceName.toLowerCase().includes(serviceName.toLowerCase()),
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [serviceName, allServices]);

  // On selecting a service suggestion
  const handleServiceSelect = service => {
    setSelectedFullService(service);
    setServiceName(service.serviceName);
    setFilteredServices([]);
  };

  // Adjust handleAddOrEditService to use selectedFullService._id
  const handleAddOrEditService = async () => {
    // if (!serviceName.trim() || !servicePrice.trim() || !selectedFullService) {
    //   Alert.alert(
    //     'Validation',
    //     'Please fill all fields including valid service selection.',
    //   );
    //   return;
    // }

    setIsSaving(true);
    try {
      const vendorId = await AsyncStorage.getItem('vendorId');
      const token = await AsyncStorage.getItem('vendorToken');

      if (editMode) {
        await axios.put(
          `https://www.makeahabit.com/api/v1/vendorservices/updateVendorService/${editServiceId}`,
          { price: Number(servicePrice) }, // Only send price, no service field here
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Alert.alert('Success', 'Service updated successfully');
      } else {
        let serviceId = selectedFullService._id;
        await axios.post(
          'https://www.makeahabit.com/api/v1/vendorservices/addVendorService',
          {
            Vendor: vendorId,
            category: categoryId,
            serviceCategory: categoryId,
            service: serviceId,
            price: Number(servicePrice),
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Alert.alert('Success', 'Service added successfully');
      }

      setModalVisible(false);
      fetchServices();

      setEditMode(false);
      setEditServiceId(null);
      setServiceName('');
      setServicePrice('');
      setSelectedFullService(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to add or update service');
      console.log(error);
    }
    setIsSaving(false);
  };

  // Delete service confirmation and handler
  const handleDeleteService = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('vendorToken');

              // ✅ Remove locally first
              setServices(prev => prev.filter(s => s._id !== id));

              await axios.delete(
                `https://www.makeahabit.com/api/v1/vendorservices/deleteVendorService/${id}`,
                { headers: { Authorization: `Bearer ${token}` } },
              );

              Alert.alert('Deleted', 'Service deleted successfully');

              // ✅ Re-sync quietly in case of mismatch
              fetchServices();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete service');
            }
          },
        },
      ],
    );
  };

  // Suggestion rendering inside modal for icon autocomplete

  // Render single service card
  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      {item.service?.icon?.img ? (
        <Image
          source={{
            uri: `https://www.makeahabit.com/api/v1/uploads/icon/${item.service.icon.img}`,
          }}
          style={styles.serviceImage}
        />
      ) : (
        <View style={[styles.serviceImage, styles.imagePlaceholder]}>
          <MaterialCommunityIcons name="image-off" size={32} color="#888" />
        </View>
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.serviceName}>{item.service?.serviceName}</Text>
        <Text style={styles.servicePrice}>₹{item.price}</Text>
      </View>
      <TouchableOpacity
        onPress={() => openEditModal(item)}
        style={styles.iconButton}
      >
        <MaterialCommunityIcons name="pencil" size={22} color="#00D65F" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleDeleteService(item._id)}
        style={styles.iconButton}
      >
        <MaterialCommunityIcons name="delete" size={22} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#e6f0c1ff', '#fbfffdff']} // adjust colors to your brand or preference
      style={{ flex: 1, padding: 16 }}
    >
      <HeaderLeft title="Services" />
      {/* Your existing header and layout */}
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.leftSide}>
            {categoryImage ? (
              <Image
                source={{
                  uri: `https://www.makeahabit.com/api/v1/uploads/icon/${categoryImage}`,
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
            <Text style={styles.categoryName}>{categoryName}</Text>
          </View>
          <View style={styles.rightSide}>
            <TouchableOpacity
              style={styles.addServiceButton}
              onPress={openAddModal}
            >
              <Text style={styles.addServiceButtonText}>Add Service</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.servicesHeader}>All Services</Text>

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
                {editMode ? 'Edit Service' : 'Add Service'}
              </Text>

              {!editMode && (
                <>
                  <Text style={styles.label}>Service Name</Text>
                  <TextInput
                    style={styles.input}
                    value={serviceName}
                    onChangeText={setServiceName}
                    placeholder="Search service by name..."
                  />

                  {filteredServices.length > 0 && (
                    <ScrollView style={styles.suggestionBox}>
                      {filteredServices.map(service => (
                        <TouchableOpacity
                          key={service._id}
                          style={[
                            styles.suggestionItem,
                            selectedFullService?._id === service._id &&
                              styles.selectedSuggestion,
                          ]}
                          onPress={() => handleServiceSelect(service)}
                        >
                          {service.icon?.img && (
                            <Image
                              source={{
                                uri: `https://www.makeahabit.com/api/v1/uploads/icon/${service.icon.img}`,
                              }}
                              style={styles.suggestionIcon}
                            />
                          )}
                          <Text style={styles.suggestionText}>
                            {service.serviceName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}

                  {selectedFullService && (
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                      <Image
                        source={{
                          uri: `https://www.makeahabit.com/api/v1/uploads/icon/${selectedFullService.icon.img}`,
                        }}
                        style={{ width: 60, height: 60, borderRadius: 8 }}
                      />
                      <Text>{selectedFullService.serviceName}</Text>
                    </View>
                  )}
                </>
              )}

              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={servicePrice}
                onChangeText={setServicePrice}
                placeholder="Enter price"
              />

              {selectedIcon && !editMode && (
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                  <Image
                    source={{
                      uri: `https://www.makeahabit.com/api/v1/uploads/icon/${selectedIcon.img}`,
                    }}
                    style={{ width: 60, height: 60, borderRadius: 8 }}
                  />
                  <Text>{selectedIcon.name}</Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#14ad5f' }]}
                  onPress={handleAddOrEditService}
                  disabled={isSaving}
                >
                  <Text style={styles.modalBtnText}>
                    {isSaving
                      ? 'Saving...'
                      : editMode
                      ? 'Update Service'
                      : 'Add Service'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#ff8383' }]}
                  onPress={() => setModalVisible(false)}
                  disabled={isSaving}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  leftSide: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    padding: 10,
    flex: 1,
  },
  rightSide: { justifyContent: 'center', alignItems: 'flex-end' },
  categoryImage: { width: 100, height: 100, borderRadius: 12 },
  imagePlaceholder: {
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  addServiceButton: {
    backgroundColor: '#14ad5f',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 3,
    marginLeft: 10,
  },
  addServiceButtonText: { color: '#fff', fontWeight: '600' },
  servicesHeader: {
    fontSize: 18,
    fontWeight: '600',
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
  serviceImage: { width: 60, height: 60, borderRadius: 8 },
  serviceName: { fontSize: 12, fontWeight: '500', color: '#222' },
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
    maxHeight: '90%',
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
    maxHeight: 120,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#14ad5f',
    backgroundColor: '#fff',
    borderRadius: 8,
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
});

export default AllServices1;
