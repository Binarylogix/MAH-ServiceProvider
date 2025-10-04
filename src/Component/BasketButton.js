import React from "react";
import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function GradientButton({
  title = "Button",
  onPress,
  icon,
  colors = ["#EC4E31", "#40196C"],
  height = 55,
  width = "80%",
  textStyle,
  iconStyle,
 
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <View style={styles.content}>
            {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center", 
   
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height:55,
    width:'70%',
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
