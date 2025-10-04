// DynamicIcon.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function IconCom({
  type = 'image',        // 'image' or 'icon'
  source,                // local or remote image
  ImageName,             // icon name for MaterialIcons
  iconSize = 24,         // size of icon or image
  iconColor = '#000',    // color of icon
  onPress,               // function on press
  style,                 // custom style
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      {/* {type === 'image' && source ? ( */}
        <Image 
          source={source} 
          style={[styles.image, { width: iconSize, height: iconSize }]} 
        />
    {/* //   ) : type === 'icon' && ImageName ? (
    //     <MaterialIcons name={ImageName} size={iconSize} color={iconColor} />
    //   ) : null} */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
});
