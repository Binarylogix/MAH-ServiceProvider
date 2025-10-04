import * as React from 'react';
import {} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabScreen from './BottomTabScreen';
import Index from '../Screens/Login/Index';
import OtpIndex from '../Screens/Otp/OtpIndex';
import SplaceIndex from '../Screens/SplaceScreen/SplaceIndex';
import Card from '../Screens/Card';
import AccountDetails from '../Screens/Profilecard/AccountDetails';
import CreateUserProfile from '../Screens/Profilecard/CreateUserProfile';
import ViewBasket from '../Component/ViewBasket';
//dbscr

import VenderLogin from '../Screens/ServiceProviderPanel/ShopLogin/VenderLogin';
import OwnerOtpIndex from '../Screens/ServiceProviderPanel/SPotp/OwnerOtpIndex';
import OrderScreenIndex from '../Screens/ServiceProviderPanel/ShopHome/OrderScreenIndex';
import ContectAdminIndex from '../Screens/DeliveryPanel/dbnotregister/ContectAdminIndex';
import RootIndex from '../Screens/root/RootIndex';
import ProductPage from '../Screens/ProductPage/ProductPage';
import ShopProfile from '../Screens/ServiceProvidersList/ShopProfile';
import ServiceProvidersList from '../Screens/ServiceProvidersList/ServiceProvidersList';
const Stack = createNativeStackNavigator();
export default function StackNavigator() {
  return (
    // <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SplaceScreen"
      >
        <Stack.Screen name="SplaceScreen" component={SplaceIndex} />
        <Stack.Screen name="Rootindex" component={RootIndex} />
        <Stack.Screen name="Login" component={Index} />
        <Stack.Screen name="OtpScreen" component={OtpIndex} />
        <Stack.Screen name="TabScreen" component={BottomTabScreen} />
        <Stack.Screen name="productView" component={Card} />
        <Stack.Screen name="ViewBasket" component={ViewBasket} />
        <Stack.Screen name="AccountDetails" component={AccountDetails} />
        <Stack.Screen name="CreateUserProfile" component={CreateUserProfile} />
        
         <Stack.Screen name="ServiceProvidersList" component={ServiceProvidersList} 
         options={{
          // headerShown: true,
          title: 'Shops List',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
         }}/>

        <Stack.Screen name="ShopProfile" component={ShopProfile} 
         options={{
          // headerShown: true,
           title: 'Shops Details',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
         }}/>

        {/* deliveryscr */}
        <Stack.Screen name="VenderLogin" component={VenderLogin} />
        <Stack.Screen name="RootScreen" component={RootIndex} />
        <Stack.Screen name="OwnerOtpIndex" component={OwnerOtpIndex} />
        <Stack.Screen name="OrderScreenIndex" component={OrderScreenIndex} />
        <Stack.Screen name="AdminControl" component={ContectAdminIndex} />
        <Stack.Screen name="ProductPage" component={ProductPage} />
      </Stack.Navigator>
    // </NavigationContainer>
  );
}

