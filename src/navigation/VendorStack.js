import * as React from 'react';
import {} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SplaceIndex from '../Screens/SplaceScreen/SplaceIndex';

import CreateUserProfile from '../Screens/Profilecard/CreateUserProfile';

//dbscr
import VenderLogin from '../Screens/ServiceProviderPanel/ShopLogin/VenderLogin';
import OwnerOtpIndex from '../Screens/ServiceProviderPanel/SPotp/OwnerOtpIndex';
import OrderScreenIndex from '../Screens/ServiceProviderPanel/ShopHome/VendorHome';

import RootIndex from '../Screens/root/RootIndex';

import ShopProfile from '../Screens/ServiceProvidersList/ShopProfile';
import VendorRegistration from '../Screens/ServiceProviderPanel/BusinessRegister/VendorRegistration';
import VendorTab from './VendorTab';

const Stack = createNativeStackNavigator();
export default function VendorStack() {
  return (
    // <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SplaceScreen"
    >
      <Stack.Screen name="SplaceScreen" component={SplaceIndex} />

      <Stack.Screen name="CreateUserProfile" component={CreateUserProfile} />

      <Stack.Screen
        name="ShopProfile"
        component={ShopProfile}
        options={{
          // headerShown: true,
          title: 'Shops Details',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
        }}
      />

      {/* deliveryscr */}
      <Stack.Screen name="VendorLogin" component={VenderLogin} />
      <Stack.Screen name="RootScreen" component={RootIndex} />
      <Stack.Screen name="VendorTab" component={VendorTab} />
      <Stack.Screen name="VendorRegistration" component={VendorRegistration} />
      <Stack.Screen name="OwnerOtpIndex" component={OwnerOtpIndex} />
      <Stack.Screen name="OrderScreenIndex" component={OrderScreenIndex} />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}
