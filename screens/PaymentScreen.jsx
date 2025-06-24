import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ORDER } from "../graphql/mutations";
import { GET_CART, VERIFY_COUPON } from "../graphql/queries";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = ({ addressId, selectedSlot }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [ushopId, setUshopId] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderError, setOrderError] = useState("");

  const navigation = useNavigation();

  const {
    data,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_CART);
  const cartItems = data?.getCart?.cartProducts || [];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountedTotal = Math.max(0, total - appliedDiscount);

  const [createOrder, { loading: placingOrder }] = useMutation(CREATE_ORDER, {
    onCompleted: (data) => {
      navigation.replace("OrderConfirmedScreen", { orderData: data.createOrder });
    },
    onError: (err) => {
      setOrderError(err.message || "Failed to place order.");
    },
  });

  const {
    refetch: verifyCouponRefetch,
    loading: verifyCouponLoading,
  } = useQuery(VERIFY_COUPON, {
    skip: true,
  });

  const handlePlaceOrder = async () => {
    setOrderError(""); // reset previous errors

    if (!selectedMethod) {
      setOrderError("Please select a payment method.");
      return;
    }

    if (!addressId) {
      setOrderError("Delivery address is missing.");
      return;
    }

    if (selectedMethod === "Online") {
      navigation.navigate("PaymentGatewayScreen", { addressId });
      return;
    }

    try {
      await createOrder({
        variables: {
          addressId,
          paymentMethod: "Cash on Delivery",
          ushopId: couponApplied ? ushopId : "",
          couponCode: couponApplied ? couponCodeInput : "",
          timeSlot: selectedSlot,
        },
      });
    } catch (error) {
      setOrderError(error.message || "Failed to place order. Please try again.");
    }
  };

  const applyCoupon = async () => {
    try {
      const { data: refetchResult } = await verifyCouponRefetch({
        ushopId,
        couponcode: couponCodeInput,
      });
      const response = refetchResult?.varifyCoupon;

      if (response?.msg === "Invalid Coupon!") {
        setCouponError("Invalid Coupon!");
        setAppliedDiscount(0);
        setCouponApplied(false);
      } else {
        setCouponError("Valid Coupon!");
        setAppliedDiscount(response?.discountAmount || 0);
        setCouponApplied(true);
        setCouponModalVisible(false);
      }
    } catch (err) {
      setCouponError("Error verifying coupon.");
    }
  };

  if (cartLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3D5AFE" />
        <Text>Loading cart...</Text>
      </View>
    );
  }

  if (cartError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{cartError.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Payment Details</Text>

      {/* Billing Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billing Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>₹{total.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.value, { color: "green" }]}>
            - ₹{appliedDiscount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₹{discountedTotal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Coupon Button */}
      <TouchableOpacity
        style={styles.couponBtn}
        onPress={() => setCouponModalVisible(true)}
      >
        <Text style={styles.couponBtnText}>
          {couponApplied ? "Coupon Applied ✅" : "Apply Coupon Code"}
        </Text>
      </TouchableOpacity>

      {/* Coupon Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={couponModalVisible}
        onRequestClose={() => setCouponModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Coupon Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Coupon Code"
              value={couponCodeInput}
              onChangeText={setCouponCodeInput}
            />
            <TextInput
              style={styles.input}
              placeholder="Ushop ID"
              value={ushopId}
              onChangeText={setUshopId}
            />
            {couponError ? (
              <Text
                style={{
                  color: couponError === "Valid Coupon!" ? "green" : "red",
                  marginBottom: 10,
                }}
              >
                {couponError}
              </Text>
            ) : null}
            <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}>
              {verifyCouponLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.applyBtnText}>Apply Coupon</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCouponModalVisible(false)}>
              <Text style={{ color: "red", marginTop: 12, textAlign: "center" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Method Selection */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        Payment Method
      </Text>
      {["Online", "Cash on Delivery"].map((method) => (
        <TouchableOpacity
          key={method}
          style={[
            styles.radioContainer,
            selectedMethod === method && styles.selected,
          ]}
          onPress={() => setSelectedMethod(method)}
        >
          <View
            style={[
              styles.radioCircle,
              selectedMethod === method && styles.radioCircleSelected,
            ]}
          >
            {selectedMethod === method && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.radioText}>{method}</Text>
        </TouchableOpacity>
      ))}

      {/* 🟥 Show Error Message in Red */}
      {orderError !== "" && (
        <Text style={styles.errorText}>{orderError}</Text>
      )}

      {/* Place Order Button */}
      <TouchableOpacity
        style={[
          styles.placeOrderBtn,
          (!selectedMethod || placingOrder) && { opacity: 0.6 },
        ]}
        onPress={handlePlaceOrder}
        disabled={!selectedMethod || placingOrder}
      >
        {placingOrder ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.placeOrderText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  section: {
    padding: 16,
    backgroundColor: "#F7F9FC",
    borderRadius: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#444",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  couponBtn: {
    padding: 12,
    backgroundColor: "#E0F7FA",
    borderRadius: 8,
    alignItems: "center",
  },
  couponBtnText: {
    color: "#00796B",
    fontWeight: "600",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    borderColor: "#3D5AFE",
    backgroundColor: "#E3F2FD",
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: "#3D5AFE",
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3D5AFE",
  },
  radioText: {
    fontSize: 15,
    fontWeight: "500",
  },
  placeOrderBtn: {
    backgroundColor: "#3D5AFE",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  applyBtn: {
    backgroundColor: "#3D5AFE",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
