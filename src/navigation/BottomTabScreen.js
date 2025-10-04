import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import HomeScreen from '../Screens/HomeScreen';
import Cart from '../Screens/cart/Cart';
import Category from '../Screens/Category';
import AllBooking from '../Screens/Booking/AllBooking';
import ServiceProvidersList from '../Screens/ServiceProvidersList/ServiceProvidersList';
import ShopProfile from '../Screens/ServiceProvidersList/ShopProfile';
import Wallet from '../Screens/Wallet';
import Profile from '../Screens/Profile';
import ViewBasket from '../Component/ViewBasket';

import Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        // Center button (Cart)
        if (route.name === 'Cart') {
          return (
            <View key={route.key} style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                style={styles.floatingButtonContainer}
              >
                <LinearGradient
                  colors={['#00D65F', '#01823A']}
                  style={styles.floatingButton}
                >
                  <Ionicons name="search" size={28} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          );
        }

        // Other tabs
        let iconElement;
        switch (route.name) {
          case 'Home':
            iconElement = (
              <MaterialIcons
                name="home"
                size={22}
                color={isFocused ? '#01823A' : '#8F9BB3'}
              />
            );
            break;
          case 'Category':
            iconElement = (
              <MaterialCommunityIcons
                name="view-grid"
                size={25}
                color={isFocused ? '#01823A' : '#8F9BB3'}
              />
            );
            break;
          case 'Wallet':
            iconElement = (
              <MaterialCommunityIcons
                name="wallet-outline"
                size={25}
                color={isFocused ? '#01823A' : '#8F9BB3'}
              />
            );
            break;
          case 'Profile':
            iconElement = (
              <Icon
                name="user"
                size={22}
                color={isFocused ? '#01823A' : '#8F9BB3'}
              />
            );
            break;
          default:
            iconElement = (
              <Icon
                name="circle-question"
                size={22}
                color={isFocused ? '#01823A' : '#8F9BB3'}
              />
            );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.tabButton}
          >
            {iconElement}
            <Text
              style={{
                color: isFocused ? '#01823A' : '#8F9BB3',
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Cart Overlay Component
function CartOverlay({ quantity, unit }) {
  const navigation = useNavigation();
  const handlePress = () => navigation.navigate('Cart');

  return (
    <View style={styles.cartOverlay}>
      <ViewBasket quantity={quantity} unit={unit} onPress={handlePress} />
    </View>
  );
}

export default function BottomTabScreen() {
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('');

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');
      if (!userId || !token) return;

      const res = await axios.get(
        `https://www.mandlamart.co.in/api/cart/getAllCart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.data) {
        setCartData(res.data);
        setQuantity(res.data.items.length || 0);
      } else {
        setCartData(null);
        setQuantity(0);
      }
    } catch (err) {
      console.log('❌ Axios error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        {/* <Tab.Screen name="Booking" component={Category} /> */}
        <Tab.Screen name="Booking1" component={AllBooking} />
        <Tab.Screen name="Cart" component={Cart} />
        <Tab.Screen name="Wallet" component={Wallet} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>

      {/* Loading indicator */}
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -25 }, { translateY: -25 }],
          }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {/* Cart overlay */}
      {/* {cartData && quantity > 0 && (
        <CartOverlay quantity={quantity} unit={unit} />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  floatingButtonContainer: {
    position: 'absolute',
    top: -38, // makes it float above tab bar
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#fff', // white border to blend with tab bar
  },
  cartOverlay: {
    position: 'absolute',
    bottom: 80, // adjusted for curvy tab
    width: '100%',
    alignItems: 'center',
    zIndex: 999,
  },
});

