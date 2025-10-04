import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import HeaderCom from '../Component/HeaderCom';
import CategoriesHomeIndex from './CategoriesHome/CategoriesHomeIndex';

import Productcard from './Productcard/Productcard';
import Banner from './banner/Banner';

//=====This is a Home Screen====//
export default function HomeIndex({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* //======Header Screen call ======// */}


      <HeaderCom />
      

      <Banner />
      <CategoriesHomeIndex />

      {/* //======CategoriesHomeIndex Screen Code=====// */}

      {/*     =====  Productcards=====  */}

      <Productcard listName={'Top Salons '} />
      <Productcard listName={'Top Laundries '} />
      <Productcard listName={'Top Flowriest'} />

      {/* Bottom Banner */}
      <Banner />
    </ScrollView>

    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    height: 45,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    marginTop: 10,
    position: 'relative',
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    paddingRight: 35,
  },

  filterIconWrapper: {
    position: 'absolute',
    right: 15,
    top: 8,
  },

  filterIcon: {
    width: 25,
    height: 25,
    backgroundColor: '#40196C',
  },
  gradientBackground: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryList: {
    marginVertical: 15,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
  },
  categoryText: {
    fontSize: 12,
    marginTop: 5,
  },

  banner: {
    width: '90%',
    height: 130,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: 'green',
  },

  bottomBanner: {
    width: '90%',
    height: 100,
    alignSelf: 'center',
  },

  leftTopButton: {
    position: 'absolute',
    // backgroundColor: 'red',
    // borderTopLeftRadius: 15,
    borderRadius: 10,
    height: 25,
    zIndex: 15,
    backgroundColor: '#E9F5FA',
    flexDirection: 'row',
    gap: 5,
    padding: 3,
    // borderTopRightRadius: 0,
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0,
    // width: 30,
    // alignItems: "center",
    // justifyContent: "center",
    // paddingHorizontal: 8,
    // paddingVertical: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    // marginBottom: 10,
  },

  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },

  addButton: {
    position: 'absolute',
    bottom: 5,
    right: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  addButtonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 12,
  },

  addButtonTextOne: {
    color: 'green',
    fontWeight: '400',
    fontSize: 12,
  },
  rightTopButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#6e6a6aff',
    shadowOffset: { width: 0, height: 2 },
    zIndex: 20,
  },

  heartIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  productText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 4,
  },

  productPrice: {
    fontSize: 14,
    color: 'green',
    textAlign: 'center',
    marginBottom: 5,
  },
});
