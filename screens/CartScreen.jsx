import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  // ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART, GET_PRODUCT } from "../graphql/queries";
import { UPDATE_CART, REMOVE_FROM_CART } from "../graphql/mutations";
import CartHeader from "./CartHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
const CartScreen = () => {
  const navigation = useNavigation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_CART);
  const {
    isLoggedIn: isLoggedInUser,
    guestCartData,
    refreshGuestCart,
  } = useIsLoggedIn();
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
    if (isLoggedInUser) {
      await updateCartMutation({
        variables: {
          productId: item.productId,
          quantity: newQty,
        },
      });
    } else {
      const guestCart = await AsyncStorage.getItem("guestCart");
      let parsedData = JSON.parse(guestCart) || [];
      parsedData = parsedData.map((cartItem) => {
        if (
          cartItem.productId === item.productId &&
          cartItem.variantName === item.variantName &&
          cartItem.size === item.size
        ) {
          return { ...cartItem, quantity: newQty };
        }
        return cartItem;
      });
      await AsyncStorage.setItem(
        "guestCart",
        JSON.stringify(parsedData)
      );
      refreshGuestCart();
    }
  };
  const removeFromCart = async (item) => {
    if (isLoggedInUser) {
      await removeFromCartMutation({
        variables: {
          productId: item.productId,
          variantName: item.variantName,
          size: item.size,
        },
      });
    } else {
      const guestCart = await AsyncStorage.getItem("guestCart");
      let parsedData = JSON.parse(guestCart) || [];
      parsedData = parsedData.filter(
        (cartItem) =>
          !(
            cartItem.productId === item.productId &&
            cartItem.variantName === item.variantName &&
            cartItem.size === item.size
          )
      );
      await AsyncStorage.setItem(
        "guestCart",
        JSON.stringify(parsedData)
      );
      refreshGuestCart();
    }
  };
  const cartItems = data?.getCart?.cartProducts || [];
  const isLoggedIn = !error && data?.getCart;
  const getTotalItems = () =>
    cartItems.reduce(
      (total, item) => total + (item.quantity ?? 1),
      0
    );
  const getTotalPrice = () =>
    isLoggedInUser
      ? cartItems.reduce((total, item) => {
          const price = parseFloat(item.price ?? 0);
          const qty = item.quantity ?? 1;
          return total + price * qty;
        }, 0)
      : guestCartData?.reduce((total, item) => {
          const price = parseFloat(item.price ?? 0);
          const qty = item.quantity ?? 1;
          return total + price * qty;
        }, 0);
  const totalPrice = getTotalPrice();
  const handlePlaceOrder = () => {
    if (!isLoggedInUser) {
      navigation.navigate("LoginScreen");
    } else {
      navigation.navigate("MyOrdersScreen");
    }
  };
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
        data={isLoggedInUser ? cartItems : guestCartData}
        keyExtractor={(item, index) =>
          `${item.productId}_${item.size ?? ""}_${
            item.variantName ?? ""
          }_${index}`
        }
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            isLoggedInUser={isLoggedInUser}
          />
        )}
        contentContainerStyle={{ paddingBottom: 150 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              :shopping_trolley: Your cart is empty.
            </Text>
          </View>
        }
      />
      <View style={styles.summaryContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>₹{totalPrice}</Text>
          <TouchableOpacity
            style={[
              styles.placeOrderBtn,
              (isLoggedInUser
                ? cartItems.length
                : guestCartData?.length || 0) === 0 && {
                opacity: 0.4,
              },
            ]}
            onPress={handlePlaceOrder}
            disabled={
              isLoggedInUser
                ? cartItems.length < 1
                : guestCartData?.length < 1
            }
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
            <Text style={styles.modalTitle}>
              You are not logged in
            </Text>
            <Text style={styles.modalSubtitle}>
              Please log in to place your order
            </Text>
            <View style={styles.amountBox}>
              <Text style={styles.amountWhite}>₹{totalPrice}</Text>
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                setShowLoginModal(false);
                navigation.navigate("LoginScreen");
              }}
            >
              <Text style={styles.loginButtonText}>
                Login & Place Order
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowLoginModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default CartScreen;

export const CartItemCard = ({
  item,
  updateQuantity,
  removeFromCart,
  isSummary = false,
}) => {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [product, setProduct] = useState(null);
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { getProductId: item.productId },
  });
  useEffect(() => {
    setQty(item.quantity ?? 1);
    setPrice(item.price || product?.sellingPrice || 0);
    setProduct(data?.getProduct);
  }, [item, data]);
  if (loading) return <ActivityIndicator style={{ padding: 16 }} />;
  if (error) return <Text>Error loading product</Text>;
  // const product = data?.getProduct;
  // const price = item.price || product?.sellingPrice || 0;
  // const qty = item.quantity ?? 1;
  const variantImage = product?.variant?.find(
    (variant) =>
      variant.variantName?.toLowerCase().trim() ===
      item.variantName?.toLowerCase().trim()
  )?.images?.[0];
  const imageUrl = variantImage || product?.previewImage;
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <View style={styles.productDetails}>
        {!isSummary && (
          <TouchableOpacity
            style={styles.trashIcon}
            onPress={() => removeFromCart(item)}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#FF3E3E"
            />
          </TouchableOpacity>
        )}
        <Text style={styles.brandName}>
          {product?.brand || "Brand"}
        </Text>
        <Text numberOfLines={2} style={styles.productTitle}>
          {product?.productName}
        </Text>
        <Text style={styles.badge}>Size: {item.size}</Text>
        <Text style={styles.badge}>Qty: {item.quantity}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.priceRow}>
            <Text style={styles.sellingPrice}>₹{price}</Text>
            <Text style={styles.mrp}>
              ₹{product?.price || price + 400}
            </Text>
            <Text style={styles.discount}>30% OFF</Text>
          </View>
        </View>
        <Text style={styles.greenDelivery}>Open Box Delivery</Text>
        <Text style={styles.deliveryBy}>Delivery by 24 Oct 2024</Text>
        {!isSummary && (
          <View style={styles.qtyWrapper}>
            <TouchableOpacity
              onPress={() => {
                updateQuantity(item, qty - 1);
                setQty(qty - 1);
              }}
              style={styles.qtyBtn}
            >
              <AntDesign name="minus" size={14} color="#000" />
            </TouchableOpacity>
            <Text style={styles.qtyNumber}>{qty}</Text>
            <TouchableOpacity
              onPress={() => {
                updateQuantity(item, qty + 1);
                setQty(qty + 1);
              }}
              style={styles.qtyBtn}
            >
              <AntDesign name="plus" size={14} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
// :large_blue_circle: Styles
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
    marginTop: "50%",
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
  summaryText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    marginBottom: 6,
  },
  clearButton: {
    backgroundColor: "#0C8CE9",
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 10,
  },
  clearButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  cardContainer: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    position: "relative",
  },
  productImage: {
    width: 100,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    position: "relative",
  },
  trashIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    padding: 4,
  },
  brandName: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#222",
  },
  productTitle: {
    fontSize: 13,
    color: "#333",
    fontFamily: "Poppins-Regular",
    marginVertical: 2,
  },
  badge: {
    backgroundColor: "#FFF",
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sellingPrice: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins-SemiBold",
  },
  mrp: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    fontFamily: "Poppins-Regular",
  },
  discount: {
    fontSize: 12,
    color: "green",
    fontFamily: "Poppins-Medium",
  },
  greenDelivery: {
    fontSize: 11,
    color: "#00A651",
    fontFamily: "Poppins-Medium",
    marginTop: 4,
  },
  deliveryBy: {
    fontSize: 11,
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
  detailsBtn: {
    marginTop: 10,
    backgroundColor: "#3B49F4",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    width: 125,
  },
  detailsText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  qtyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyBtn: {
    backgroundColor: "#F0F0F0",
    padding: 5,
    borderRadius: 20,
  },
  qtyNumber: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins-SemiBold",
    paddingHorizontal: 6,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
    color: "#000",
  },
  placeOrderBtn: {
    backgroundColor: "#0C8CE9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});
