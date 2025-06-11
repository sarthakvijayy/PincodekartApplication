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

const OrderSummaryScreen = ({ selectedAddressId, route }) => {
  const addressId = route?.params?.addressId;

  const {
    data,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_CART);

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>
        {item.quantity}x {item.productName} - ₹
        {item.price * item.quantity}
      </Text>
      {item.variantName && (
        <Text style={styles.variantName}>
          Variant: {item.variantName}
        </Text>
      )}
      {item.size && (
        <Text style={styles.variantName}>Size: {item.size}</Text>
      )}
    </View>
  );

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        // renderItem={renderProductItem}
         renderItem={({ item }) => (
                  <CartItemCard
                    item={item}
                    // updateQuantity={updateQuantity}
                    // removeFromCart={removeFromCart}
                  />
                )}
        style={{ marginBottom: 10 }}
      />

      <Text style={styles.totalText}>
        Total: ₹
        {cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )}
      </Text>
    </View>
  );
};

export default OrderSummaryScreen;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  productItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
  },
  variantName: {
    fontSize: 12,
    color: "#666",
  },
  totalText: {
    fontWeight: "700",
    fontSize: 16,
    marginVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});