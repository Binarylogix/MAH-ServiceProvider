// import React, { useEffect } from "react";
// import { View, ActivityIndicator, Image, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function SplaceIndex({ navigation }) {
//     useEffect(() => {
//         const checkLogin = async () => {
//             const token = await AsyncStorage.getItem("userToken");
//             if (token) {
//                 navigation.reset({
//                     index: 0,
//                     routes: [{ name: "TabScreen" }], // ✅ Direct Home
//                 });
//             } else {
//                 navigation.reset({
//                     index: 0,
//                     routes: [{ name: "Login" }], // ✅ Pehle Login
//                 });
//             }
//         };
//         checkLogin();
//     }, []);

//     return (
//         <View style={styles.mainContainar}>
//             <Image source={require('../../assets/Logo.jpg')} style={styles.ImageStyle} />
//         </View>
//     );
// }
// const styles = StyleSheet.create({
//     mainContainar: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center"
//     },
//     ImageStyle: {
//         height: 150,
//         width: 150,
//         borderRadius: 20,

//     }
// })

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';

export default function SplaceIndex({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Rootindex');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.mainContainar}>
      <Image
        source={require('../../assets/Logo/logo.png')}
        style={styles.ImageStyle}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageStyle: {
    height: 150,
    width: 150,
    borderRadius: 20,
  },
});
