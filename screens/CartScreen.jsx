import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART, GET_PRODUCT } from "../graphql/queries";
import { UPDATE_CART, REMOVE_FROM_CART } from "../graphql/mutations";
import CartHeader from "./CartHeader";

const CartScreen = () => {
  const navigation = useNavigation();
  const { loading, error, data, refetch } = useQuery(GET_CART);

  const [updateCartMutation] = useMutation(UPDATE_CART, {
    onCompleted: () => refetch(),
    onError: (err) => console.error("UpdateCart Error:", err),
  });

  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, {
    onCompleted: () => refetch(),
    onError: (err) => console.error("RemoveFromCart Error:", err),
  });

  const updateQuantity = async (item, newQty) => {
    if (newQty < 1) {
      Alert.alert("Invalid Quantity", "Quantity cannot be less than 1");
      return;
    }
    try {
      await updateCartMutation({
        variables: {
          productId: item.productId,
          quantity: newQty,
        },
      });
    } catch (err) {
      Alert.alert("Error", "Failed to update quantity.");
    }
  };

  const removeFromCart = async (item) => {
    try {
      await removeFromCartMutation({
        variables: {
          productId: item.productId,
          variantName: item.variantName,
          size: item.size,
        },
      });
    } catch (err) {
      Alert.alert("Error", "Failed to remove item.");
    }
  };

  const cartItems = data?.getCart?.cartProducts || [];

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + (item.quantity ?? 1), 0);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const price = parseFloat(item.price ?? 0);
      const qty = item.quantity ?? 1;
      return total + price * qty;
    }, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3D5AFE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#333", fontSize: 16, marginBottom: 10 }}>
          You are not logged in.
        </Text>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => navigation.replace("LoginScreen")}
        >
          <Text style={styles.detailsText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalPrice = getTotalPrice();

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
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>🛒 Your cart is empty.</Text>
          </View>
        }
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Items: {getTotalItems()}</Text>
        <Text style={styles.summaryText}>
          Total Price: ₹{totalPrice.toFixed(2)}
        </Text>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            if (cartItems.length === 0) {
              Alert.alert("Cart Empty", "Please add a product to place order.");
              return;
            }

            Alert.alert("Place Order", "Are you sure you want to place the order?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("MyOrdersScreen");
                },
              },
            ]);
          }}
        >
          <Text style={styles.clearButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const CartItemCard = ({ item, updateQuantity, removeFromCart }) => {
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { getProductId: item.productId },
  });

  if (loading) return <ActivityIndicator style={{ padding: 16 }} />;

  if (error) return <Text>Error loading product</Text>;

  const product = data?.getProduct;
  const price = item.price || product?.sellingPrice || 0;
  const qty = item.quantity ?? 1;

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
        <TouchableOpacity
          style={styles.trashIcon}
          onPress={() => removeFromCart(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3E3E" />
        </TouchableOpacity>

        <Text style={styles.brandName}>{product?.brand || "Brand"}</Text>

        <Text numberOfLines={2} style={styles.productTitle}>
          {product?.productName}
        </Text>

        <Text style={styles.sellerText}>Selling by : LuxeDazzle</Text>

        <View style={styles.badgeRow}>
          <Text style={styles.badge}>Size: {item.size}</Text>
          <Text style={styles.badge}>Qty: {qty}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.sellingPrice}>₹{price}</Text>
          <Text style={styles.mrp}>₹{product?.price || price + 400}</Text>
          <Text style={styles.discount}>30% OFF</Text>
        </View>

        <Text style={styles.greenDelivery}>Open Box Delivery</Text>
        <Text style={styles.deliveryBy}>Delivery by 24 Oct 2024</Text>
      </View>
    </View>
  );
};

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
  summaryText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    marginBottom: 6,
  },
  clearButton: {
    backgroundColor: "#2A55E5",
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
  sellerText: {
    fontSize: 11,
    color: "#777",
    fontFamily: "Poppins-Regular",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
  },
  badge: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
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
    backgroundColor: "#3b49f4",
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
});

export default CartScreen;
