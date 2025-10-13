// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';

// const defaultProfileImg = {
//   uri: 'https://randomuser.me/api/portraits/men/1.jpg',
// };

// const menuOptions = [
//   { icon: 'translate', label: 'Language' },
//   { icon: 'car-wash', label: 'Service' },
//   { icon: 'account-outline', label: 'Staff' },
//   { icon: 'cube-outline', label: 'Products' },
//   { icon: 'image-multiple-outline', label: 'Gallery' },
//   { icon: 'information-outline', label: 'Help and Support' },
//   { icon: 'clipboard-text-outline', label: 'Terms & Conditions' },
//   { icon: 'shield-account-outline', label: 'Privacy and Policy' },
//   { icon: 'logout', label: 'Log out', highlight: true },
// ];

// export default function Profile() {
//   const navigation = useNavigation();
//   const [vendorData, setVendorData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchVendorDetails = async () => {
//       try {
//         const token = await AsyncStorage.getItem('vendorToken');
//         const id = await AsyncStorage.getItem('vendorId');
//         if (!token) {
//           Alert.alert('Error', 'No token found, please log in again');
//           return;
//         }

//         const response = await fetch(
//           `https://www.makeahabit.com/api/v1/vendor/details/${id}`,
//           {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           },
//         );

//         const data = await response.json();
//         if (response.ok) {
//           setVendorData(data);
//         } else {
//           Alert.alert(
//             'Error',
//             data.message || 'Failed to fetch vendor details',
//           );
//         }
//       } catch (error) {
//         console.error(error);
//         Alert.alert('Error', 'Something went wrong while fetching data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVendorDetails();
//   }, []);

//   const handleLogout = async () => {
//     Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Log Out',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             await AsyncStorage.clear();
//             navigation.reset({
//               index: 0,
//               routes: [{ name: 'VendorLogin' }],
//             });
//           } catch (error) {
//             Alert.alert('Error', 'Failed to log out. Please try again.');
//           }
//         },
//       },
//     ]);
//   };

//   const handleMenuPress = label => {
//     if (label === 'Log out') {
//       handleLogout();
//     } else if (label === 'Service') {
//       navigation.navigate('AddService');
//     } else {
//       Alert.alert(label, `You tapped on "${label}"`);
//     }
//   };

//   if (loading) {
//     return (
//       <View
//         style={[
//           styles.container,
//           { justifyContent: 'center', alignItems: 'center' },
//         ]}
//       >
//         <ActivityIndicator size="large" color="#14ad5f" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
//         {/* Modern Avatar Card */}
//         <View style={styles.profileCard}>
//           <Image
//             source={
//               vendorData?.profileImage
//                 ? { uri: vendorData.profileImage }
//                 : defaultProfileImg
//             }
//             style={styles.avatar}
//           />
//           <Text style={styles.profileName}>
//             {vendorData?.data?.fullName || 'Vendor Name'}
//           </Text>
//           <Text style={styles.profileEmail}>
//             {vendorData?.data?.email || 'vendor@example.com'}
//           </Text>

//           {/* Gradient Edit Profile Button */}
//           <TouchableOpacity
//             onPress={() => navigation.navigate('EditProfile')}
//             activeOpacity={0.8}
//             style={{ borderRadius: 25, overflow: 'hidden' }} // ensures gradient is clipped
//           >
//             <LinearGradient
//               colors={['#FF4584', '#FF7A59']} // gradient colors
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.editButton}
//             >
//               <Text style={styles.editButtonText}>Edit Profile</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* Menu Options */}
//         <View style={styles.list}>
//           {menuOptions.map(({ icon, label, highlight }, idx) => (
//             <TouchableOpacity
//               style={[styles.listRow, highlight && { borderBottomWidth: 0 }]}
//               key={idx}
//               activeOpacity={0.7}
//               onPress={() => handleMenuPress(label)}
//             >
//               <View style={styles.leftGroup}>
//                 <MaterialCommunityIcons
//                   name={icon}
//                   size={25}
//                   color={highlight ? '#e04444' : '#111'}
//                 />
//                 <Text
//                   style={[styles.listLabel, highlight && { color: '#e04444' }]}
//                 >
//                   {label}
//                 </Text>
//               </View>
//               <MaterialCommunityIcons
//                 name="chevron-right"
//                 size={25}
//                 color="#161616"
//                 style={{ opacity: label === 'Log out' ? 0 : 1 }}
//               />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f7f9fa' },

//   profileCard: {
//     backgroundColor: '#fff',
//     margin: 16,
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//     elevation: 6,
//   },

//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 15,
//   },

//   profileName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111',
//     marginBottom: 4,
//   },

//   profileEmail: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 15,
//   },

//   editButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     alignItems: 'center',
//   },

//   editButtonText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//   },

//   list: { marginTop: 20 },

//   listRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     borderBottomWidth: 0.7,
//     borderBottomColor: '#e7e8ec',
//     justifyContent: 'space-between',
//     paddingVertical: 17,
//   },

//   leftGroup: { flexDirection: 'row', alignItems: 'center' },
//   listLabel: { fontSize: 16, marginLeft: 16, color: '#181818' },
// });

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Added import
import MenuCard from '../Component/MenuCard';
import {
  fetchVendorDetails,
  clearVendorDetails,
} from '../redux/Vendor/vendorDetailsSlice';

const defaultProfileImg = {
  uri: 'https://randomuser.me/api/portraits/men/1.jpg',
};

export default function Profile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { vendor, loading, error } = useSelector(state => state.vendorDetails);

  useEffect(() => {
    dispatch(fetchVendorDetails());
    return () => dispatch(clearVendorDetails()); // optional cleanup
  }, [dispatch]);

  // ✅ Fixed handleLogout
  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'VendorLogin' }],
            });
          } catch (error) {
            Alert.alert('Error', 'Failed to log out. Please try again.');
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#14ad5f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <Image
            source={
              vendor?.data?.profileImage
                ? { uri: vendor.data.profileImage }
                : defaultProfileImg
            }
            style={styles.avatar}
          />
          <Text style={styles.profileName}>
            {vendor?.data?.fullName || 'Vendor Name'}
          </Text>
          <Text style={styles.profileEmail}>
            {vendor?.data?.email || 'vendor@example.com'}
          </Text>

          {/* Gradient Edit Profile Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
            style={{ borderRadius: 25, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={['#FF4584', '#FF7A59']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Menu Cards */}
        <View style={styles.menucard}>
          <MenuCard icon="translate" label="Language" onPress={() => {}} />
          <MenuCard
            icon="car-wash"
            label="Service"
            onPress={() => navigation.navigate('AddService')}
          />
          <MenuCard
            icon="account-outline"
            label="Staff"
            onPress={() => navigation.navigate('AddStaff')}
          />
          <MenuCard
            icon="cube-outline"
            label="Products"
            onPress={() => navigation.navigate('AddProduct')}
          />
          <MenuCard
            icon="image-multiple-outline"
            label="Gallery"
            onPress={() => navigation.navigate('AddPhotos')}
          />
          <MenuCard
            icon="help-circle"
            label="FAQ"
            onPress={() => navigation.navigate('FAQScreen')}
          />
          <MenuCard
            icon="information-outline"
            label="Help and Support"
            onPress={() => navigation.navigate('HelpAndSupportScreen')}
          />
          <MenuCard
            icon="clipboard-text-outline"
            label="Terms & Conditions"
            onPress={() => {}}
          />
          <MenuCard
            icon="shield-account-outline"
            label="Privacy and Policy"
            onPress={() => {}}
          />
          <MenuCard
            icon="star"
            label="Rate Us"
            onPress={() => navigation.navigate('RateUsScreen')}
          />
          <MenuCard
            icon="logout"
            label="Log out"
            highlight={true}
            onPress={handleLogout} // ✅ Fixed
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fa' },
  center: { justifyContent: 'center', alignItems: 'center' },
  menucard: { paddingHorizontal: 18 },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  profileEmail: { fontSize: 14, color: '#666', marginBottom: 15 },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  editButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
