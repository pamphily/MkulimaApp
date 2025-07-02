import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Alert,
  Pressable,
  Image,
  GestureResponderEvent,
} from "react-native";
import { useCart } from "../../../context/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import HeaderComponent from "../../../components/HeaderComponent";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const CartScreen: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalAmount,
    clearCart,
    lastTransaction,
    setLastTransaction,
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const fakeTransactionAPI = async () => {
    await new Promise((res) => setTimeout(res, 1500));
    return {
      success: true,
      orderId: `ORD-${Math.floor(Math.random() * 1000000)}`,
    };
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Add products to cart before checkout.");
      return;
    }

    const total = getTotalAmount();
    const timestamp = new Date().toISOString();

    try {
      setIsLoading(true);
      const response = await fakeTransactionAPI();
      setIsLoading(false);

      if (response.success) {
        const tx = {
          orderId: response.orderId!,
          items: cartItems,
          total,
          timestamp,
        };
        setLastTransaction(tx);
        clearCart();
        setShowReceipt(true);
      } else {
        Alert.alert("Transaction failed", "Try again.");
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Error", "Transaction failed.");
    }
  };

  const renderItem = ({ item }: any) => {
    const { product, quantity } = item;
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.productName}>{product.productName}</Text>
        <Text>Qty: {quantity}</Text>
        <Text>Price: TZS {product.price.toFixed(2)}</Text>
      </View>
    );
  };

  const renderReceipt = () => {
    if (!lastTransaction) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReceipt}
        onRequestClose={() => setShowReceipt(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowReceipt(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.receiptTitle}>Receipt</Text>
            <Text>Order ID: {lastTransaction.orderId}</Text>
            <Text>Date: {new Date(lastTransaction.timestamp).toLocaleString()}</Text>
            <FlatList
              data={lastTransaction.items}
              keyExtractor={(item) => item.product.id}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Text style={styles.itemText}>{item.product.productName}</Text>
                  <Text style={styles.itemText}>
                    {item.quantity} x TZS {item.product.price}
                  </Text>
                </View>
              )}
            />
            <Text style={styles.totalText}>Total: TZS {lastTransaction.total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowReceipt(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent title="My Cart" />
      {renderReceipt()}

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>Your cart is empty.</Text>
          {lastTransaction && (
            <TouchableOpacity onPress={() => setShowReceipt(true)}>
              <Text style={styles.linkText}>View Last Receipt</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <FlatList data={cartItems} keyExtractor={(item) => item.product.id} renderItem={renderItem} />
          <View style={styles.footer}>
            <Text>Total: TZS {getTotalAmount().toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={isLoading}>
              <Text style={styles.checkoutText}>{isLoading ? "Processing..." : "Checkout"}</Text>
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
    paddingTop: 61,
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
  viewReceiptButton: {
    marginTop: 10,
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
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalDragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2e7d32",
  },
  receiptBody: {
    flex: 1,
  },
  receiptText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },
  receiptItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  receiptTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 8,
  },
  receiptTotalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e7d32",
  },
  swipeArrow: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  swipeText: {
    color: "#2e7d32",
    fontSize: 12,
    marginTop: 4,
  },
});
