// screens/OrderScreen/OrderWizardModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type AgriProduct = {
  id: string;
  productName: string;
  description?: string;
  price: number;
  imageUri?: string;
};

type OrderWizardModalProps = {
  product: AgriProduct;
  onClose: () => void;
};

const OrderWizardModal: React.FC<OrderWizardModalProps> = ({ product, onClose }) => {
  // Step index: 1 = product details; 2 = delivery; 3 = payment/summary
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // --- Common state across steps ---
  // Step 1:
  const [quantity, setQuantity] = useState<number>(1);
  // Promo code (optional)
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Step 2 (delivery/pickup)
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState<string>(""); // for delivery
  const [pickupLocation, setPickupLocation] = useState<string>(""); // for pickup
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [showDeliveryPicker, setShowDeliveryPicker] = useState<boolean>(false);
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [showPickupPicker, setShowPickupPicker] = useState<boolean>(false);

  // Step 3 (payment)
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "cash" | "card">("mpesa");
  const [mpesaNumber, setMpesaNumber] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>(""); // MM/YY
  const [cardCvv, setCardCvv] = useState<string>("");

  // Common:
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Placeholder pickup locations
  const pickupLocations = ["Main Warehouse", "Downtown Store", "Uptown Pickup Point"];

  // --- Effects ---
  // Recalculate shipping fee when address changes or method changes
  useEffect(() => {
    if (deliveryMethod === "delivery" && address.trim()) {
      calculateShippingFee(address).then(fee => setShippingFee(fee));
    } else {
      setShippingFee(0);
    }
  }, [deliveryMethod, address]);

  // Reset fields when switching methods
  useEffect(() => {
    if (deliveryMethod === "delivery") {
      setPickupLocation("");
    } else {
      setAddress("");
      setShippingFee(0);
    }
  }, [deliveryMethod]);

  // --- Helper functions ---
  const calculateShippingFee = async (addr: string): Promise<number> => {
    // Placeholder: replace with real API call
    return new Promise(resolve => {
      setTimeout(() => resolve(50), 200); // flat fee
    });
  };

  const validatePromoCode = async (code: string): Promise<{ valid: boolean; discount: number }> => {
    // Placeholder: replace with real API call
    return new Promise(resolve => {
      setTimeout(() => {
        if (code.trim().toUpperCase() === "SAVE10") {
          resolve({ valid: true, discount: 0.1 });
        } else {
          resolve({ valid: false, discount: 0 });
        }
      }, 200);
    });
  };

  // Totals (computed on Step 3, but can compute anytime)
  const unitPrice = product.price;
  const subTotal = unitPrice * quantity;
  const discountAmount = promoApplied ? subTotal * promoDiscount : 0;
  const totalPayable = subTotal - discountAmount + (deliveryMethod === "delivery" ? shippingFee : 0);

  // --- Step validation before moving next ---
  const validateStep1 = (): boolean => {
    // Quantity >=1 always, so no extra check. Could add limits.
    // Promo code optional; if entered but not applied, we could prompt:
    if (promoCode.trim() && !promoApplied) {
      Alert.alert(
        "Promo Code",
        "You entered a promo code but haven’t applied it. Would you like to apply it now?",
        [
          { text: "Skip", onPress: () => setPromoApplied(false) },
          { text: "Apply", onPress: () => onApplyPromo() },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (deliveryMethod === "delivery") {
      if (!address.trim()) {
        Alert.alert("Address required", "Please provide a delivery address.");
        return false;
      }
      // Optionally ensure deliveryDate >= today
    } else {
      if (!pickupLocation.trim()) {
        Alert.alert("Pickup Location", "Please select a pickup location.");
        return false;
      }
      // Ensure pickupDate >= today
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    // Payment-specific validation
    if (paymentMethod === "mpesa") {
      if (!/^\d{9,12}$/.test(mpesaNumber.trim())) {
        Alert.alert("Mpesa Number", "Enter a valid phone number.");
        return false;
      }
    } else if (paymentMethod === "card") {
      if (!/^\d{12,19}$/.test(cardNumber.replace(/\s+/g, ""))) {
        Alert.alert("Card Number", "Enter a valid card number.");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) {
        Alert.alert("Expiry", "Enter expiry as MM/YY.");
        return false;
      }
      if (!/^\d{3,4}$/.test(cardCvv.trim())) {
        Alert.alert("CVV", "Enter a valid CVV.");
        return false;
      }
    }
    return true;
  };

  // --- Handlers ---
  const onApplyPromo = async () => {
    if (!promoCode.trim()) {
      Alert.alert("Enter Code", "Please enter a promo code.");
      return;
    }
    const { valid, discount } = await validatePromoCode(promoCode);
    if (valid) {
      setPromoApplied(true);
      setPromoDiscount(discount);
      Alert.alert("Promo Applied", `You received ${(discount * 100).toFixed(0)}% off.`);
    } else {
      setPromoApplied(false);
      setPromoDiscount(0);
      Alert.alert("Invalid Code", "The promo code is not valid.");
    }
  };

  const onChangeDeliveryDate = (_event: any, selectedDate?: Date) => {
    setShowDeliveryPicker(false);
    if (selectedDate) {
      setDeliveryDate(selectedDate);
    }
  };
  const onChangePickupDate = (_event: any, selectedDate?: Date) => {
    setShowPickupPicker(false);
    if (selectedDate) {
      setPickupDate(selectedDate);
    }
  };

  const handleConfirmOrder = async () => {
    // Final validation
    if (!validateStep3()) return;

    setLoading(true);
    try {
      // Build payload
      const payload: any = {
        productId: product.id,
        quantity,
        deliveryMethod,
        date:
          deliveryMethod === "delivery"
            ? deliveryDate.toISOString()
            : pickupDate.toISOString(),
        paymentMethod,
        totalAmount: totalPayable,
      };
      if (deliveryMethod === "delivery") {
        payload.address = address.trim();
        payload.shippingFee = shippingFee;
      } else {
        payload.pickupLocation = pickupLocation.trim();
      }
      if (promoApplied) {
        payload.promoCode = promoCode.trim().toUpperCase();
      }
      if (paymentMethod === "mpesa") {
        payload.mpesaNumber = mpesaNumber.trim();
      } else if (paymentMethod === "card") {
        payload.cardDetails = {
          number: cardNumber.replace(/\s+/g, ""),
          expiry: cardExpiry.trim(),
          cvv: cardCvv.trim(),
        };
      }
      // Replace URL with your backend endpoint
      const response = await fetch("http://<YOUR_SERVER_IP>:5000/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Order Failed", data.message || "Could not place order.");
      } else {
        Alert.alert("Order Confirmed", `Order ID: ${data.orderId}\nThank you!`);
        onClose();
      }
    } catch (err) {
      console.error("Network error:", err);
      Alert.alert("Network Error", "Unable to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigation between steps
  const goNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      setStep(3);
    }
  };
  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  // --- Render per step ---
  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <Text style={styles.stepIndicatorText}>Step {step} of 3</Text>
      <View style={styles.stepDotsContainer}>
        {[1, 2, 3].map(i => (
          <View
            key={i}
            style={[
              styles.stepDot,
              step === i ? styles.stepDotActive : styles.stepDotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View>
      {/* Product Summary */}
      <View style={styles.productCard}>
        {product.imageUri ? (
          <Image source={{ uri: product.imageUri }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.productName}</Text>
          {product.description ? (
            <Text style={styles.productDescription} numberOfLines={2}>
              {product.description}
            </Text>
          ) : null}
          <Text style={styles.productPrice}>TSH {product.price.toFixed(2)}</Text>
        </View>
      </View>

      {/* Quantity Selector */}
      <View style={styles.section}>
        <Text style={styles.label}>Quantity</Text>
        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyButton}>
            <Ionicons name="remove-circle-outline" size={32} color="#333" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={styles.qtyButton}>
            <Ionicons name="add-circle-outline" size={32} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Promo Code */}
      <View style={styles.section}>
        <Text style={styles.label}>Promo Code</Text>
        <View style={styles.promoRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter code"
            value={promoCode}
            onChangeText={text => {
              setPromoCode(text);
              setPromoApplied(false);
              setPromoDiscount(0);
            }}
            returnKeyType="done"
            onSubmitEditing={onApplyPromo}
          />
          <TouchableOpacity style={styles.promoButton} onPress={onApplyPromo}>
            <Text style={styles.promoButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
        {promoApplied && (
          <Text style={styles.promoAppliedText}>
            Promo applied: {(promoDiscount * 100).toFixed(0)}% off
          </Text>
        )}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      {/* Fulfillment */}
      <View style={styles.section}>
        <Text style={styles.label}>Fulfillment</Text>
        <View style={styles.optionGroup}>
          <TouchableOpacity
            style={[styles.optionButton, deliveryMethod === "delivery" && styles.selectedOption]}
            onPress={() => setDeliveryMethod("delivery")}
          >
            <MaterialCommunityIcons name="truck-delivery-outline" size={18} color="#333" />
            <Text style={styles.optionText}>Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, deliveryMethod === "pickup" && styles.selectedOption]}
            onPress={() => setDeliveryMethod("pickup")}
          >
            <MaterialCommunityIcons name="storefront" size={18} color="#333" />
            <Text style={styles.optionText}>Pickup</Text>
          </TouchableOpacity>
        </View>

        {deliveryMethod === "delivery" ? (
          <>
            <TextInput
              placeholder="Enter delivery address"
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDeliveryPicker(true)}>
              <Ionicons name="calendar-outline" size={18} color="#333" />
              <Text style={styles.datePickerText}>{deliveryDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDeliveryPicker && (
              <DateTimePicker
                value={deliveryDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={onChangeDeliveryDate}
              />
            )}
          </>
        ) : (
          <>
            <View style={styles.pickerPlaceholder}>
              {pickupLocations.map(loc => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.optionButton, pickupLocation === loc && styles.selectedOption]}
                  onPress={() => setPickupLocation(loc)}
                >
                  <MaterialCommunityIcons name="map-marker-outline" size={18} color="#333" />
                  <Text style={styles.optionText}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowPickupPicker(true)}>
              <Ionicons name="calendar-outline" size={18} color="#333" />
              <Text style={styles.datePickerText}>{pickupDate.toDateString()}</Text>
            </TouchableOpacity>
            {showPickupPicker && (
              <DateTimePicker
                value={pickupDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={onChangePickupDate}
              />
            )}
          </>
        )}
      </View>

      {/* Shipping Fee */}
      {deliveryMethod === "delivery" && (
        <View style={styles.section}>
          <Text style={styles.label}>Shipping Fee</Text>
          <Text style={styles.shippingFeeText}>KES {shippingFee.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.optionGroup}>
          <TouchableOpacity
            style={[styles.optionButton, paymentMethod === "mpesa" && styles.selectedOption]}
            onPress={() => setPaymentMethod("mpesa")}
          >
            <Text style={styles.optionText}>Mpesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, paymentMethod === "cash" && styles.selectedOption]}
            onPress={() => setPaymentMethod("cash")}
          >
            <Text style={styles.optionText}>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, paymentMethod === "card" && styles.selectedOption]}
            onPress={() => setPaymentMethod("card")}
          >
            <Text style={styles.optionText}>Card</Text>
          </TouchableOpacity>
        </View>
        {paymentMethod === "mpesa" && (
          <TextInput
            style={styles.input}
            placeholder="Enter Mpesa phone (e.g., 07XXXXXXXX)"
            value={mpesaNumber}
            keyboardType="phone-pad"
            onChangeText={setMpesaNumber}
            returnKeyType="done"
          />
        )}
        {paymentMethod === "card" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={setCardNumber}
              returnKeyType="next"
            />
            <View style={styles.cardRow}>
              <TextInput
                style={[styles.input, styles.cardSmallInput]}
                placeholder="MM/YY"
                value={cardExpiry}
                onChangeText={setCardExpiry}
                returnKeyType="next"
              />
              <TextInput
                style={[styles.input, styles.cardSmallInput]}
                placeholder="CVV"
                keyboardType="number-pad"
                secureTextEntry
                value={cardCvv}
                onChangeText={setCardCvv}
                returnKeyType="done"
              />
            </View>
          </>
        )}
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.label}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>KES {subTotal.toFixed(2)}</Text>
        </View>
        {promoApplied && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Discount</Text>
            <Text style={styles.summaryText}>-KES {discountAmount.toFixed(2)}</Text>
          </View>
        )}
        {deliveryMethod === "delivery" && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Shipping</Text>
            <Text style={styles.summaryText}>KES {shippingFee.toFixed(2)}</Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.summaryTotalRow]}>
          <Text style={styles.summaryTotalText}>Total</Text>
          <Text style={styles.summaryTotalText}>KES {totalPayable.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  // --- Main render ---
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      extraScrollHeight={Platform.OS === "ios" ? 80 : 100}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Render current step */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      {/* Navigation Buttons */}
      <View style={styles.navButtonsContainer}>
        {step > 1 ? (
          <TouchableOpacity style={styles.navButton} onPress={goBack} disabled={loading}>
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.navButtonPlaceholder} />
        )}
        {step < 3 ? (
          <TouchableOpacity style={styles.navButtonPrimary} onPress={goNext} disabled={loading}>
            <Text style={styles.navButtonPrimaryText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.navButtonPrimary}
            onPress={handleConfirmOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.navButtonPrimaryText}>Confirm & Pay</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Cancel at bottom */}
      <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

export default OrderWizardModal;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FBF1" },
  contentContainer: { flexGrow: 1, padding: 16, paddingBottom: 40 },

  // Step indicator
  stepIndicatorContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  stepIndicatorText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  stepDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: "#2e7d32",
  },
  stepDotInactive: {
    backgroundColor: "#ccc",
  },

  // Product summary (step 1)
  productCard: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    overflow: "hidden",
  },
  productImage: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  productDescription: {
    fontSize: 13,
    color: "#666",
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2e7d32",
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },

  // Quantity
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    padding: 4,
  },
  qtyText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
  },

  // Promo
  promoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  promoButton: {
    marginLeft: 10,
    backgroundColor: "#2e7d32",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  promoButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  promoAppliedText: {
    marginTop: 6,
    color: "#2e7d32",
    fontSize: 13,
    fontStyle: "italic",
  },

  // Options
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  selectedOption: {
    backgroundColor: "#d0f0c0",
    borderColor: "#2e7d32",
  },
  optionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },

  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  datePickerText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  pickerPlaceholder: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  shippingFeeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },

  // Card inputs
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cardSmallInput: {
    flex: 1,
    marginRight: 10,
  },

  // Summary
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    marginTop: 6,
  },
  summaryTotalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e7d32",
  },

  // Navigation buttons (Next / Back / Confirm)
  navButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888",
    backgroundColor: "#fff",
  },
  navButtonText: {
    fontSize: 14,
    color: "#333",
  },
  navButtonPlaceholder: {
    width: 100, // same approximate width so spacing consistent
  },
  navButtonPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#2e7d32",
  },
  navButtonPrimaryText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },

  // Confirm / Cancel
  confirmButton: {
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#888",
    fontSize: 14,
  },
});
