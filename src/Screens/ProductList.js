import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const products = [
  {
    id: "1",
    title: "Tata Sampann Fine Besan / Kadale Hittu - 1Kg",
    price: 120,
    oldPrice: 240,
    discount: 50,
    image: require('../assets/sampann.png')
  },
  {
    id: "2",
    title: "Aashirvaad Multigrain - 5Kg",
    price: 120,
    oldPrice: 240,
    discount: 50,
    image: require("../assets/aashirvaad.png"),
  },
  {
    id: "3",
    title: "Tata Sampann Fine Besan / Kadale Hittu - 1Kg",
    price: 120,
    oldPrice: 240,
    discount: 50,
    image: require('../assets/sampann.png')
  },
  {
    id: "4",
    title: "Aashirvaad Multigrain - 5Kg",
    price: 120,
    oldPrice: 240,
    discount: 50,
    image: require("../assets/aashirvaad.png"),
  },
];

export default function ProductList() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Wishlist */}
      <TouchableOpacity style={styles.wishlist}>
        <Icon name="heart-outline" size={20} color="red" />
      </TouchableOpacity>

      {/* Product Image */}
      <Image source={item.image} style={styles.image} />

      {/* Discount */}
      <Text style={styles.discount}>{item.discount}% Off</Text>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Price Row */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹ {item.price}</Text>
        <Text style={styles.oldPrice}>₹ {item.oldPrice}</Text>
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addText}>+ ADD</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Filter Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity><Text style={styles.filterText}>Filters</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.filterText}>Sort</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.filterText}>Brand</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.filterText}>Quantity</Text></TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 3,
  },
  wishlist: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 5,
  },
  discount: {
    color: "green",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "gray",
  },
  addBtn: {
    backgroundColor: "green",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
