import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import HeaderCom from '../Component/HeaderCom';
import CategoriesHomeIndex from './CategoriesHome/CategoriesHomeIndex';
import Productcard from './Productcard/Productcard';
import Banner from './banner/Banner';

export default function HomeIndex({ navigation }) {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (search.trim() !== '') {
      navigation.navigate('SearchScreen', { searchQuery: search });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <HeaderCom />

      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search salons, laundries..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      <Banner />
      <CategoriesHomeIndex />

      {/* Products */}
      <Productcard listName={'Top Salons'} />
      <Productcard listName={'Top Laundries'} />
      <Productcard listName={'Top Florists'} />

      <Banner />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 44,
    elevation: 2,
    marginHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: '#222',
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 6,
  },
});
