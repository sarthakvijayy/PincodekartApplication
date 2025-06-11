import React, { useState } from "react";
import {View,Text,TouchableOpacity,StyleSheet,Alert,ActivityIndicator,FlatList,} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ORDER } from "../graphql/mutations";
import { GET_CART } from "../graphql/queries";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CartItemCard } from "./CartScreen";

const PaymentScreen = ({addressId}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  // const { addressId } = route.params || {};

  const {
    data,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_CART);

  const cartItems = data?.getCart?.cartProducts || [];

  const [createOrder, { loading: placingOrder }] = useMutation(
    CREATE_ORDER,
    {
      onCompleted: (data) => {
        Alert.alert("Success", "Order placed successfully!");
        navigation.replace("OrderConfirmedScreen", {
          orderData: data.createOrder,
        });
      },
      onError: (err) => {
        Alert.alert("Error", err.message);
      },
    }
  );


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

  const renderCartItem = ({ item }) => (
    <CartItemCard
      item={item}
   
    />
  );

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Order</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCartItem}
        style={{ marginBottom: 10 }}
      />

      <Text style={styles.total}>Total: ₹{total}</Text>

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
            {selectedMethod === method && (
              <View style={styles.innerCircle} />
            )}
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
  item: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "500",
  },
  variant: {
    fontSize: 12,
    color: "#555",
  },
  total: {
    fontWeight: "700",
    fontSize: 16,
    marginVertical: 10,
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
});