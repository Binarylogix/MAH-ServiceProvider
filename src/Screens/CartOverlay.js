import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ViewBasket from '../Component/ViewBasket'; // your component

function CartOverlay({ quantity, unit }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.cartOverlay}>
      <ViewBasket quantity={quantity} unit={unit} onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  cartOverlay: {
    position: 'absolute',
    bottom: 66, // above tab bar
    width: '100%',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default CartOverlay;
