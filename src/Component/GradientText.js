import React from "react";
import { Text, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";

const GradientText = ({ text, style }) => {
  return (
    <MaskedView maskElement={<Text style={[style, styles.mask]}>{text}</Text>}>
      <LinearGradient
        colors={["#FF512F", "#DD2476"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  mask: {
    backgroundColor: "transparent",
  },
});

export default GradientText;
