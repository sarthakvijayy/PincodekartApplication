import React, { useState } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
  Image, Alert, Modal
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART, GET_PRODUCT } from "../graphql/queries";
import { UPDATE_CART, REMOVE_FROM_CART } from "../graphql/mutations";
import CartHeader from "./CartHeader";
import AsyncStorage from '@react-native-async-storage/async-storage';


const CartScreen = () => {
  const navigation = useNavigation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_CART);

  const [updateCartMutation] = useMutation(UPDATE_CART, {
    onCompleted: () => refetch(),
  });

  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, {
    onCompleted: () => refetch(),
  });

  const updateQuantity = async (item, newQty) => {
    if (newQty < 1 || newQty > 5) {
      Alert.alert("Limit", "Quantity must be between 1 and 5");
      return;
    }
    await updateCartMutation({
      variables: {
        productId: item.productId,
        quantity: newQty,
      },
    });
  };

  const removeFromCart = async (item) => {
    await removeFromCartMutation({
      variables: {
        productId: item.productId,
        variantName: item.variantName,
        size: item.size,
      },
    });
  };

  const cartItems = data?.getCart?.cartProducts || [];
  const isLoggedIn = !error && data?.getCart; // If query has no error and cart exists

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + (item.quantity ?? 1), 0);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const price = parseFloat(item.price ?? 0);
      const qty = item.quantity ?? 1;
      return total + price * qty;
    }, 0);

  const totalPrice = getTotalPrice();

  const handlePlaceOrder = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigation.navigate("MyOrdersScreen");
    }
  };

   const email =  AsyncStorage.getItem('guestCart');
   console.log("fsdfdsf", JSON.parse(email))

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3D5AFE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CartHeader />
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) =>
          `${item.productId}_${item.size ?? ""}_${item.variantName ?? ""}_${index}`
        }
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        )}
        contentContainerStyle={{ paddingBottom: 150 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>🛒 Your cart is empty.</Text>
          </View>
        }
      />

      <View style={styles.summaryContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>₹{totalPrice.toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.placeOrderBtn, cartItems.length === 0 && { opacity: 0.4 }]}
            onPress={handlePlaceOrder}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Modal for Login Prompt */}
      <Modal
        animationType="slide"
        transparent
        visible={showLoginModal}
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>You are not logged in</Text>
            <Text style={styles.modalSubtitle}>Please log in to place your order</Text>

            <View style={styles.amountBox}>
              <Text style={styles.amountWhite}>₹{totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                setShowLoginModal(false);
                navigation.navigate("LoginScreen");
              }}
            >
              <Text style={styles.loginButtonText}>Login & Place Order</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowLoginModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartScreen;

// CartItemCard component remains same as you have

// 🔵 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    paddingTop: 28,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
    fontFamily: "Poppins_500Medium",
  },
  summaryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#333",
  },
  placeOrderBtn: {
    backgroundColor: "#FF6F00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Poppins_700Bold",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  amountBox: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  amountWhite: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#2A55E5",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  modalCancelText: {
    color: "#2A55E5",
    fontSize: 16,
    marginTop: 4,
  },
});
