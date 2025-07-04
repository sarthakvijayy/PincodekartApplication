import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useQuery } from "@apollo/client";
import { GET_CART, GET_ADDRESS_QUERY } from "../graphql/queries";
import { CartItemCard } from "./CartScreen";
import useIsLoggedIn from "../hooks/useIsLoggedIn";

const OrderSummaryScreen = ({
  selectedAddressId,
  onProceed,
  setSelectedSlot,
  selectedSlot,
  isbuynow,
}) => {
  const { buyNowData } = useIsLoggedIn();
  // const [selectedSlot, setSelectedSlot] = useState("09AM - 10AM");

  const deliverySlots = [
    { id: 1, label: "09:00AM - 10:00AM", value: "09:00AM - 10:00AM" },
    { id: 2, label: "10:00AM - 11:00AM", value: "10:00AM - 11:00AM" },
    { id: 3, label: "11:00AM - 12:00PM", value: "11:00AM - 12:00PM" },
    { id: 4, label: "12:00PM - 01:00PM", value: "12:00PM - 01:00PM" },
    { id: 5, label: "01:00PM - 02:00PM", value: "01:00PM - 02:00PM" },
    { id: 6, label: "02:00PM - 03:00PM", value: "02:00PM - 03:00PM" },
    { id: 7, label: "03:00PM - 04:00PM", value: "03:00PM - 04:00PM" },
    { id: 8, label: "04:00PM - 05:00PM", value: "04:00PM - 05:00PM" },
    { id: 9, label: "05:00PM - 06:00PM", value: "05:00PM - 06:00PM" },
    {
      id: 10,
      label: "06:00PM - 07:00PM",
      value: "06:00PM - 07:00PM",
    },
    {
      id: 11,
      label: "07:00PM - 08:00PM",
      value: "07:00PM - 08:00PM",
    },
    {
      id: 12,
      label: "08:00PM - 09:00PM",
      value: "08:00PM - 09:00PM",
    },
  ];

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

  console.log("buyNowData", buyNowData);
  console.log("isbuynow11111", isbuynow);

  const cartItems = isbuynow
    ? buyNowData
      ? [buyNowData]
      : []
    : cartData?.getCart?.cartProducts || [];

  console.log("cartItems11111", cartItems);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = 50;
  const shippingFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal - discount + shippingFee;

  // if (cartLoading || addressLoading) {
  //   return (
  //     <View style={styles.center}>
  //       <ActivityIndicator size="large" color="#3D5AFE" />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

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
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ✅ Deliver To Section */}
        <View style={styles.addressCard}>
          <Text style={styles.deliverLabel}>Deliver to</Text>
          <Text style={styles.addressName}>
            {address?.fullName || "No Name"}{" "}
            {address?.tag && (
              <Text style={styles.addressTag}>{address?.tag}</Text>
            )}
          </Text>

          <Text style={styles.addressText}>{address?.mobileNo}</Text>

          <Text style={styles.addressText}>
            {address?.addressLine1}, {address?.addressLine2}
          </Text>
          <Text style={styles.addressText}>
            {address?.city}, {address?.state} - {address?.pincode}
          </Text>
          <Text style={styles.addressText}>{address?.country}</Text>
        </View>

        {/* 🛒 Cart Products */}
        <View style={styles.cartItemsWrapper}>
          {cartItems.map((item, index) => (
            <CartItemCard key={index} item={item} isSummary={true} />
          ))}
        </View>

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
              {shippingFee === 0
                ? "Free"
                : `₹${shippingFee.toFixed(2)}`}
            </Text>
          </View>

          <View style={styles.totalWrapper}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              ₹{total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* 📦 Delivery Slot */}
        <View style={styles.slotContainer}>
          <Text style={styles.slotLabel}>
            Choose the delivery time slot
          </Text>
          <View style={styles.slotPicker}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedSlot(value)}
              items={deliverySlots}
              value={selectedSlot}
              useNativeAndroidPickerStyle={true} // ✅ This ensures native dropdown, not modal
              placeholder={{}}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        {/* 💵 Price Breakdown */}
      </ScrollView>

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
    backgroundColor: "#fff",
  },
  addressCard: {
    padding: 14,
    margin: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  deliverLabel: {
    fontSize: 14,
    color: "#444",
    fontFamily: "Poppins-Medium",
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
  cartItemsWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  slotContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  slotLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    marginBottom: 10,
  },
  slotPicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    // paddingHorizontal: 10,
  },
  priceSection: {
    marginHorizontal: 16,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 16,
    marginBottom: 20,
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

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#333",
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: "100%",
  },
  inputAndroid: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#333",
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: "100%",
  },
};
