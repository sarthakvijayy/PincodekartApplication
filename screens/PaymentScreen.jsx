import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ORDER, CREATE_COUPAN } from "../graphql/mutations";
import { GET_CART , VARIFY_COUPAN } from "../graphql/queries";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CartItemCard } from "./CartScreen";

const PaymentScreen = ({ addressId }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const navigation = useNavigation();
  const route = useRoute();

  const { data, loading: cartLoading, error: cartError } = useQuery(GET_CART);
  const cartItems = data?.getCart?.cartProducts || [];

  const [createOrder, { loading: placingOrder }] = useMutation(CREATE_ORDER, {
    onCompleted: (data) => {
      Alert.alert("Success", "Order placed successfully!");
      navigation.replace("OrderConfirmedScreen", {
        orderData: data.createOrder,
      });
    },
    onError: (err) => {
      Alert.alert("Error", err.message);
    },
  });

  const [createCoupon, { loading: couponLoading }] = useMutation(CREATE_COUPAN, {
    onCompleted: (data) => {
      const discountValue = data.createCoupon.discount;
      setAppliedDiscount(discountValue);
      setCouponModalVisible(false);
      Alert.alert("Coupon Applied", `Discount ₹${discountValue} applied.`);
    },
    onError: (err) => {
      Alert.alert("Invalid Coupon", err.message);
    },
  });

  const handlePlaceOrder = async () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method.");
      return;
    }
    if (!addressId) {
      Alert.alert("Error", "Address is missing");
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
        },
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderCartItem = ({ item }) => <CartItemCard item={item} />;

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

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountedTotal = Math.max(0, total - appliedDiscount);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Order</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCartItem}
        style={{ marginBottom: 10 }}
      />

      <Text style={styles.total}>Subtotal: ₹{total}</Text>
      {appliedDiscount > 0 && (
        <Text style={styles.discount}>Discount: ₹{appliedDiscount}</Text>
      )}
      <Text style={styles.totalFinal}>Total: ₹{discountedTotal}</Text>

      {/* Coupon Section */}
      <TouchableOpacity
        style={styles.couponLine}
        onPress={() => setCouponModalVisible(true)}
      >
        <Text style={styles.couponLineText}>Have a Coupon Code?</Text>
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
            <Text style={styles.modalTitle}>Enter Coupon Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Coupon Code"
              value={couponCodeInput}
              onChangeText={setCouponCodeInput}
            />
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                if (!couponCodeInput) {
                  Alert.alert("Please enter a code.");
                  return;
                }
                createCoupon({
                  variables: {
                    couponName: couponCodeInput,
                    couponCode: couponCodeInput,
                    discount: 0,
                  },
                });
              }}
              disabled={couponLoading}
            >
              {couponLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.applyBtnText}>Apply</Text>
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

      <Text style={[styles.title, { marginTop: 24 }]}>
        Select Payment Method
      </Text>

      {["Online", "Cash on Delivery"].map((method) => (
        <TouchableOpacity
          key={method}
          style={[
            styles.radioContainer,
            selectedMethod === method && styles.selected,
          ]}
          onPress={() => setSelectedMethod(method)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.outerCircle,
              selectedMethod === method && styles.activeOuterCircle,
            ]}
          >
            {selectedMethod === method && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.radioLabel}>{method}</Text>
        </TouchableOpacity>
      ))}

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
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  total: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 6,
    color: "#333",
  },
  totalFinal: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: 4,
    color: "#000",
  },
  discount: {
    fontSize: 16,
    color: "green",
    fontWeight: "600",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  selected: {
    borderColor: "#3D5AFE",
    backgroundColor: "#E8EDFF",
  },
  outerCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activeOuterCircle: {
    borderColor: "#3D5AFE",
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3D5AFE",
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  center: {
    alignItems: "center",
    marginTop: 16,
  },
  placeOrderBtn: {
    backgroundColor: "#3D5AFE",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  placeOrderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  couponLine: {
    padding: 14,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  couponLineText: {
    color: "#388E3C",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
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
    fontSize: 16,
  },
});
