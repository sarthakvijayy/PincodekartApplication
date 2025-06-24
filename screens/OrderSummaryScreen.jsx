import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_CART, GET_ADDRESS_QUERY } from "../graphql/queries";
import { CartItemCard } from "./CartScreen";

const OrderSummaryScreen = ({ selectedAddressId, onProceed }) => {
  const {
    data: addressData,
    loading: addressLoading,
    error: addressError,
  } = useQuery(GET_ADDRESS_QUERY, {
    variables: { getAddressId: selectedAddressId },
    skip: !selectedAddressId,
  });

  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_CART);

  const cartItems = cartData?.getCart?.cartProducts || [];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = 50;
  const shippingFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal - discount + shippingFee;

  const renderItem = ({ item }) => (
    <CartItemCard item={item} isSummary={true} />
  );

  if (cartLoading || addressLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3D5AFE" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (cartError || addressError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          {cartError?.message || addressError?.message}
        </Text>
      </View>
    );
  }

  const address = addressData?.getAddress;

  return (
    <View style={styles.container}>
      {/* ✅ Deliver To Section */}
      <View style={styles.addressCard}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.deliverLabel}>Deliver to</Text>
          {/* <TouchableOpacity onPress={() => onProceed?.(0)}>
            <Text style={styles.editBtn}>Change Address</Text>
          </TouchableOpacity> */}
        </View>
        <Text style={styles.addressName}>
          {address?.fullName || "No Name"}{" "}
          {address?.tag && (
            <Text style={styles.addressTag}>{address?.tag}</Text>
          )}
        </Text>
        <Text style={styles.addressText}>
          {address?.addressLine1}, {address?.addressLine2}
        </Text>
        <Text style={styles.addressText}>
          {address?.city}, {address?.state} - {address?.pincode}
        </Text>
        <Text style={styles.addressText}>{address?.country}</Text>
      </View>

      {/* 🛒 Cart Products */}
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* 💵 Order Price Breakdown */}
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.value, { color: "green" }]}>
            - ₹{discount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={styles.value}>
            {shippingFee === 0 ? "Free" : `₹${shippingFee.toFixed(2)}`}
          </Text>
        </View>

        <View style={styles.totalWrapper}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
        </View>
      </View>

      {/* 🔵 Proceed Button */}
      <TouchableOpacity style={styles.button} onPress={onProceed}>
        <Text style={styles.buttonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  addressCard: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  deliverLabel: {
    fontSize: 14,
    color: "#444",
    fontFamily: "Poppins-Medium",
  },
  editBtn: {
    fontSize: 13,
    color: "#3D5AFE",
    fontFamily: "Poppins-SemiBold",
  },
  addressName: {
    fontSize: 13,
    marginTop: 6,
    fontFamily: "Poppins-SemiBold",
  },
  addressTag: {
    fontSize: 12,
    backgroundColor: "#E0E0E0",
    color: "#333",
    paddingHorizontal: 6,
    marginLeft: 6,
    borderRadius: 4,
  },
  addressText: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
    fontFamily: "Poppins-Regular",
  },
  priceSection: {
    marginTop: 10,
    marginBottom: 60,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#333",
  },
  totalWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#000",
  },
  button: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#3D5AFE",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
