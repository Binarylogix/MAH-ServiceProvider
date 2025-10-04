// components/CustomImage.js
import React from "react";
import { Image, StyleSheet } from "react-native";

export default function ImageCom({
  source,         // local ya remote image
  width = 50,     // default width
  height = 50,    // default height
  borderRadius = 0, // default radius
  style,          // extra custom styles
}) {
  return (
    <Image
      source={source}
      style={[
        styles.image,
        { width, height, borderRadius },
        style,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
  },
});
