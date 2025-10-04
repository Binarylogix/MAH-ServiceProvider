import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import HeaderCom from '../Component/HeaderCom';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Category({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const API_TOKEN = await AsyncStorage.getItem('userToken');

        const catResponse = await axios.get(
          'https://www.mandlamart.co.in/api/category/getAllCategories',
          { headers: { Authorization: `Bearer ${API_TOKEN}` } },
        );

        if (catResponse.data.success && Array.isArray(catResponse.data.data)) {
          const catData = catResponse.data.data;

          // default limit 8 subcategories
          setCategories(
            catData.map(cat => ({
              ...cat,
              subCategories: cat.subCategories, // keep all, limit applied in render
            })),
          );
        }
      } catch (err) {
        console.log(
          'API error:',
          err.response ? err.response.data : err.message || err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleExpand = catId => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const renderSubCategory = sub => (
    <View style={styles.pContainer} key={sub._id}>
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() =>
          navigation.navigate('ProductPage', {
            subCategoryId: sub._id,
            subCategoryName: sub.subCategoryName,
          })
        }
      >
        <Image
          source={
            sub.image
              ? { uri: 'https://www.mandlamart.co.in' + sub.image }
              : require('../assets/sampann.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>
      <Text style={styles.name}>{sub.subCategoryName}</Text>
    </View>
  );

  const renderCategory = ({ item }) => {
    const isExpanded = expandedCategories[item._id];
    const subCatsToShow = isExpanded
      ? item.subCategories
      : item.subCategories.slice(0, 8); // default 8

    return (
      <View style={styles.section} key={item._id}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{item.categoryName}</Text>
          <TouchableOpacity onPress={() => toggleExpand(item._id)}>
            <Text style={styles.seeAll}>
              {isExpanded ? 'See Less' : 'See All'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {subCatsToShow.map(renderSubCategory)}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderCom />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#40196C"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView>
          {categories.map(cat => renderCategory({ item: cat }))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  pContainer: {
    width: 85,
    height: 85,
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAll: {
    color: 'green',
    fontWeight: '500',
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    // paddingVertical: 5,
    backgroundColor: '#e8f2ff',
    borderRadius: 5,
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  name: {
    // marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});
