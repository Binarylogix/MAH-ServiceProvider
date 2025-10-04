// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, ActivityIndicator } from 'react-native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import StackNavigator from './src/navigation/StackNavigator';
// import FlashMessage from 'react-native-flash-message';

// function App() {
//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={{ flex: 1, }} edges={['top' ,'left', 'right', 'bottom']}>
//        <FlashMessage position="top" />
//         <NavigationContainer>
//           <StackNavigator />
//         </NavigationContainer>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }


// export default App;





import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import store from './src/redux/Store';
function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, }}
        edges={['top','left', 'right', 'bottom']}
      >
        <Provider store={store}>
          <FlashMessage position="top" />
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;