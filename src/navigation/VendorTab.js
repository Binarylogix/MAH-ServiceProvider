import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

import VendorHome from '../Screens/ServiceProviderPanel/ShopHome/VendorHome';

import ServiceProvidersList from '../Screens/ServiceProvidersList/ServiceProvidersList';
import Profile from '../Screens/Profile';
import TransactionScreen from '../Screens/Booking/TransactionScreen';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        let iconElement;
        switch (route.name) {
          case 'Home':
            iconElement = (
              <MaterialIcons
                name="home"
                size={24}
                color={isFocused ? '#01823A' : '#8F9BB3'}
              />
            );
            break;

          case 'Transaction':
            iconElement = (
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={24}
                color={isFocused ? '#01823A' : '#8F9BB3'}
              />
            );
            break;

          case 'Booking':
            iconElement = (
              <MaterialCommunityIcons
                name="view-grid"
                size={25}
                color={isFocused ? '#01823A' : '#8F9BB3'}
              />
            );
            break;

          case 'Profile':
            iconElement = (
              <FontAwesome
                name="user"
                size={22}
                color={isFocused ? '#01823A' : '#8F9BB3'}
              />
            );
            break;

          default:
            iconElement = (
              <Ionicons
                name="ellipse-outline"
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

export default function VendorTab() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home" component={VendorHome} />
        <Tab.Screen name="Transaction" component={TransactionScreen} />
        <Tab.Screen name="Booking" component={ServiceProvidersList} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
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
});
