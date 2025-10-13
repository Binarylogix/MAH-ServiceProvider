import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';

export default function SplaceIndex({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run animations in parallel
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    // Navigate after animation completes
    const timer = setTimeout(() => {
      navigation.replace('RootScreen');
      // navigation.replace('VendorTab');
      // navigation.replace('VendorRegistration');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  // Background color interpolation (black → light green)
  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(0,0,0)', '#e6f0c1ff'],
  });

  return (
    <Animated.View style={[styles.mainContainar, { backgroundColor }]}>
      <Animated.Image
        source={require('../../assets/Logo/logo.png')}
        style={[
          styles.ImageStyle,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContainar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageStyle: {
    height: 230,
    width: 230,
    borderRadius: 25,
    resizeMode: 'contain',
  },
});
