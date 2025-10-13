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
} from 'react-native';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const AllServices1 = ({ route }) => {
  const { categoryId, categoryName, categoryImage } = route.params;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `https://www.makeahabit.com/api/v1/service/getAllByServiceCategory/${categoryId}`,
        );
        if (response.data?.success) {
          setServices(response.data.services);
        } else {
          Alert.alert('Error', 'Failed to load services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        Alert.alert('Error', 'Unable to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  // Category action buttons
  const editCategory = () =>
    Alert.alert('Edit Category', `Edit ${categoryName}`);
  const deleteCategory = () =>
    Alert.alert('Delete Category', `Delete ${categoryName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive' },
    ]);
  const addService = () =>
    Alert.alert('Add Service', `Add new service for category ${categoryName}`);

  const editService = name => Alert.alert('Edit Service', `Edit ${name}`);
  const deleteService = name =>
    Alert.alert('Delete Service', `Delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive' },
    ]);

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      {item.icon && item.icon.img ? (
        <Image
          source={{
            uri: `https://www.makeahabit.com/api/v1/uploads/ServiceIcon/${item.icon.img}`,
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
        onPress={() => editService(item.name)}
        style={styles.iconButton}
      >
        <MaterialCommunityIcons name="pencil" size={22} color="#00D65F" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => deleteService(item.name)}
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
            {categoryImage ? (
              <Image
                source={{
                  uri: `https://www.makeahabit.com/api/v1/uploads/ServiceCategory/${categoryImage}`,
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
              style={styles.actionButton}
              onPress={editCategory}
            >
              <MaterialCommunityIcons name="pencil" size={24} color="#00D65F" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={deleteCategory}
            >
              <MaterialCommunityIcons name="delete" size={24} color="#ff4444" />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addServiceButton}
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addServiceButton: {
    backgroundColor: '#14ad5f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addServiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  servicesHeader: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 10,
    color: '#222',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  serviceImage: { width: 60, height: 60, borderRadius: 8 },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#333' },
  servicePrice: { fontSize: 14, color: '#666', marginTop: 4 },
  iconButton: { marginLeft: 15, padding: 5 },
});

export default AllServices1;
