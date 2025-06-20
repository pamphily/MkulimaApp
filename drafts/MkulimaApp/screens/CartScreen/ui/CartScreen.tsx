import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useCart, CartItem } from "../../../context/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import HeaderComponent from "../../../components/HeaderComponent"; // Ensure path is correct

const CartScreen: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount } = useCart();
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: CartItem }) => {
    const { product, quantity } = item;
    const subtotal = product.price * quantity;

    return (
      <View style={styles.itemContainer}>
        {product.imageUri ? (
          <Image source={{ uri: product.imageUri }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Ionicons name="image-outline" size={32} color="#ccc" />
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.productName}
          </Text>
          <Text style={styles.priceText}>TZS {product.price.toFixed(2)}</Text>
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              onPress={() => {
                if (quantity > 1) updateQuantity(product.id, quantity - 1);
                else
                  Alert.alert("Remove Item", "Quantity will be zero. Remove item?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Remove",
                      style: "destructive",
                      onPress: () => removeFromCart(product.id),
                    },
                  ]);
              }}
            >
              <Ionicons name="remove-circle-outline" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity(product.id, quantity + 1)}>
              <Ionicons name="add-circle-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>TZS {subtotal.toFixed(2)}</Text>
          <TouchableOpacity onPress={() => removeFromCart(product.id)}>
            <Ionicons name="trash-outline" size={24} color="#e53935" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const totalAmount = getTotalAmount();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Add products to cart before checkout.");
      return;
    }
    navigation.navigate("Checkout" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <HeaderComponent title="Your Cart" />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.product.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>TZS {totalAmount.toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBF1",
  },
  headerWrapper: {
    zIndex: 10,
    elevation: 5,
    backgroundColor: "#F7FBF1",
  },
  listContainer: {
    paddingTop: 61, // Space for header
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f1f7e9",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  thumbnailPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  priceText: {
    fontSize: 14,
    color: "#2e7d32",
    fontWeight: "500",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  subtotalContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  subtotalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f1f7e9",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
