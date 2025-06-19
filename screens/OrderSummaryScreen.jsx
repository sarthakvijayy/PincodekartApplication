import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_CART } from "../graphql/queries";
import { CartItemCard } from "./CartScreen";

const OrderSummaryScreen = ({ route }) => {
  const addressId = route?.params?.addressId;

  const { data, loading: cartLoading, error: cartError } = useQuery(GET_CART);

  const cartItems = data?.getCart?.cartProducts || [];

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
        <Text style={{ color: "red" }}>
          Failed to load cart: {cartError.message}
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <CartItemCard item={item} isSummary={true} />
  );

  
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discount = 50; 
  const shippingFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal - discount + shippingFee;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.value, { color: "#2e7d32" }]}>
            - ₹{discount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.label}>Shipping Fee</Text>
          <Text style={styles.value}>
            {shippingFee === 0 ? "Free" : `₹${shippingFee.toFixed(2)}`}
          </Text>
        </View>

        <View style={styles.totalWrapper}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderSummaryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
    color: "#333",
  },
  priceSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  value: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
    color: "#333",
  },
  totalWrapper: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
