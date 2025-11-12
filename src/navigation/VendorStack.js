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

import AddPhotos from '../Screens/AddPhotos/AddPhotos';
import AddStaff from '../Screens/AddStaff/AddStaff';
import AllServices from '../Screens/addservice/AllServices';
import AllStaff from '../Screens/AddStaff/AllStaff';
import AllPhoto from '../Screens/AddPhotos/AllPhoto';
import AllProduct from '../Screens/AddProduct/AllProduct';
import EditProfile from '../Screens/editprofile/EditProfile';
import AllServices1 from '../Screens/addservice/AllServices1';
import FAQScreen from '../Screens/Faqscreen/FAQScreen';
import RateUsScreen from '../Screens/RateUs/RateUsScreen';
import HelpAndSupportScreen from '../Screens/helpSupport/HelpAndSupportScreen';
import PrivacyPolicyScreen from '../Screens/privacyPolicy/PrivacyPolicyScreen';
import BusinessProfile from '../Screens/editbProfile/BusinessProfile';
import Notification from '../Screens/Notification/Notification';
import BookingDetailsScreen from '../Screens/bookingscreen/BookingDetailsScreen';
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
      {/* vendorscr */}
      <Stack.Screen name="VendorLogin" component={VenderLogin} />
      <Stack.Screen name="RootScreen" component={RootIndex} />
      <Stack.Screen name="VendorTab" component={VendorTab} />
      <Stack.Screen name="VendorRegistration" component={VendorRegistration} />
      <Stack.Screen name="OwnerOtpIndex" component={OwnerOtpIndex} />
      <Stack.Screen name="OrderScreenIndex" component={OrderScreenIndex} />

      <Stack.Screen name="AddPhotos" component={AddPhotos} />
      <Stack.Screen name="AddStaff" component={AddStaff} />
      <Stack.Screen name="AllServices" component={AllServices} />
      <Stack.Screen name="AllStaff" component={AllStaff} />
      <Stack.Screen name="AllPhoto" component={AllPhoto} />
      <Stack.Screen name="AllProduct" component={AllProduct} />

      <Stack.Screen name="Bprofile" component={BusinessProfile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AllServices1" component={AllServices1} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
      <Stack.Screen name="RateUsScreen" component={RateUsScreen} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name="HelpAndSupportScreen"
        component={HelpAndSupportScreen}
      />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}
