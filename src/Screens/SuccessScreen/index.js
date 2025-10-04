import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
// import { AntDesign } from "@expo/vector-icons"; // expo-vector-icons use किया

export default function Index({ navigation }) {
    return (
        <View style={styles.container}>

            <Image source={require("../assets/Group.png")} />

            <Text style={styles.title}>Success!</Text>
            <Text style={styles.subtitle}>
                Congratulations! You have been successfully authenticated
            </Text>

            {/* Continue Button  */}
            <TouchableOpacity
                style={{ width: "100%", marginTop: 30 }}
                onPress={() => navigation.navigate("TabScreen")} 
            >
                <LinearGradient
                    colors={["#EC4E31", "#40196C"]}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.buttonText}>Continue</Text>
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
        padding: 20,
        backgroundColor: "#fff",
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginHorizontal: 20,
    },
    gradientButton: {
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
