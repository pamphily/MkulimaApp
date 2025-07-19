import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";
import { useCart, CartItem, LastTransaction } from "../../../context/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import HeaderComponent from "../../../components/HeaderComponent";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SWIPE_THRESHOLD = 100;

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
  const [modalVisible, setModalVisible] = useState(false);

  const arrowAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim, { toValue: -10, duration: 800, useNativeDriver: true }),
        Animated.timing(arrowAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          closeModal();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const fakeTransactionAPI = async (orderPayload: any): Promise<{ success: boolean; orderId?: string; message?: string }> => {
    console.log("Simulating transaction with payload:", orderPayload);
    await new Promise((res) => setTimeout(res, 1500));

    const success = Math.random() > 0.2;
    if (success) {
      return {
        success: true,
        orderId: `ORD-${Math.floor(Math.random() * 1000000)}`,
      };
    } else {
      return {
        success: false,
        message: "Demo transaction failed. Try again.",
      };
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Add products to cart before checkout.");
      return;
    }

    const orderPayload = {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.productName,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
      total: getTotalAmount(),
      timestamp: new Date().toISOString(),
      paymentMethod: "demo",
    };

    try {
      setIsLoading(true);
      const response = await fakeTransactionAPI(orderPayload);
      setIsLoading(false);

      if (response.success) {
        const tx: LastTransaction = {
          orderId: response.orderId!,
          total: orderPayload.total,
          timestamp: orderPayload.timestamp,
          items: cartItems,
        };
        setLastTransaction(tx);
        clearCart();
        openModal();
      } else {
        Alert.alert("Transaction Failed", response.message || "Something went wrong.");
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to process transaction.");
    }
  };

  const ReceiptModal = () => {
    if (!lastTransaction) return null;
    return (
      <Animated.View
        style={[styles.modalContainer, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.modalHeader}>
          <View style={styles.modalDragHandle} />
          <Text style={styles.modalTitle}>Receipt</Text>
          <TouchableOpacity onPress={closeModal}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.receiptBody}>
          <Text style={styles.receiptText}>Order ID: {lastTransaction.orderId}</Text>
          <Text style={styles.receiptText}>Date: {new Date(lastTransaction.timestamp).toLocaleString()}</Text>
          <Text style={[styles.receiptText, { fontWeight: "700", marginTop: 12 }]}>Items:</Text>
          {lastTransaction.items.map(({ product, quantity }) => (
            <View key={product.id} style={styles.receiptItem}>
              <Text>{product.productName} x {quantity}</Text>
              <Text>TZS {(product.price * quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.receiptTotal}>
            <Text style={styles.receiptTotalText}>Total:</Text>
            <Text style={styles.receiptTotalText}>TZS {lastTransaction.total.toFixed(2)}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <HeaderComponent title="My Cart" />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          {lastTransaction && (
            <TouchableOpacity onPress={openModal} style={styles.viewReceiptButton}>
              <Text style={{ color: "#2e7d32" }}>View Last Receipt</Text>
            </TouchableOpacity>
          )}
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
            <TouchableOpacity
              style={[styles.checkoutButton, isLoading && { backgroundColor: "#aaa" }]}
              onPress={handleCheckout}
              disabled={isLoading}
            >
              <Text style={styles.checkoutText}>
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {modalVisible && <ReceiptModal />}

      {!modalVisible && (
        <Animated.View
          style={[
            styles.swipeArrow,
            { transform: [{ translateY: arrowAnim }] },
          ]}
        >
          <Ionicons name="chevron-up" size={32} color="#2e7d32" />
          <Text style={styles.swipeText}>Swipe up to view last receipt</Text>
        </Animated.View>
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
