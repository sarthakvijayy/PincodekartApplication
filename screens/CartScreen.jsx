import React from "react";
import {View,Text,FlatList,StyleSheet,TouchableOpacity,Alert,ActivityIndicator,Image,} from "react-native";
import { useNavigation, navigation} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CartHeader from "./CartHeader";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART, GET_PRODUCT } from "../graphql/queries";
import { UPDATE_CART, REMOVE_FROM_CART } from "../graphql/mutations";

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
      Alert.alert(
        "Invalid Quantity",
        "Quantity cannot be less than 1"
      );
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
    cartItems.reduce(
      (total, item) => total + (item.quantity ?? 1),
      0
    );

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const price = parseFloat(item.price ?? 0);
      const qty = item.quantity ?? 1;
      return total + price * qty;
    }, 0);

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      // <View style={styles.emptyContainer}>
      //   <Text style={styles.emptyText}>
      //     Failed to load cart items.
      //   </Text>
      //   <TouchableOpacity onPress={() => refetch()}>
      //     <Text style={{ color: "#007bff", marginTop: 10 }}>
      //       Try Again
      //     </Text>
      //   </TouchableOpacity>
      // </View>

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
          `${item.productId}_${item.size ?? ""}_${
            item.variantName ?? ""
          }_${index}`
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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              🛒 Your cart is empty.
            </Text>
          </View>
        }
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Total Items: {getTotalItems()}
        </Text>
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

  Alert.alert(
    "Place Order",
    "Are you sure you want to place the order?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("MyOrdersScreen");
        },
      },
    ]
  );
}}

        >
          <Text style={styles.clearButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const CartItemCard = ({
  item,
  updateQuantity,
  removeFromCart,
}) => {
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { getProductId: item.productId },
  });

  if (loading)
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" />
      </View>
    );
  if (error)
    return (
      <View style={styles.card}>
        <Text>Error loading product</Text>
      </View>
    );

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
    
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.details}>
        {removeFromCart && (
          <TouchableOpacity
            style={styles.removeIcon}
            onPress={() => removeFromCart(item)}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color="#FF3E3E"
            />
          </TouchableOpacity>
        )}
        

        <Text numberOfLines={1} style={styles.title}>
          {product?.productName}
        </Text>
        <Text style={styles.price}>₹{price}</Text>
        <Text>Size: {item.size}</Text>
        <Text>Variant: {item.variantName}</Text>
        {updateQuantity && (
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => updateQuantity(item, qty - 1)}
            >
              <Ionicons
                name="remove-circle-outline"
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            <Text style={styles.qty}>{qty}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item, qty + 1)}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color="#333"
              />
            </TouchableOpacity>
          </View>
        )}
         
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
    backgroundColor: "#2A55E5", // updated color
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
    fontFamily: "Poppins_500Medium",
  },
  card: {
    flexDirection: "row",
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    alignItems: "flex-start",
    position: "relative",
  },
  image: {
    width: 120,
    height: 130,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  removeIcon: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 4,
    zIndex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    marginRight: 24,
  },
  price: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333",
    marginVertical: 4,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  qty: {
    fontSize: 16,
    marginHorizontal: 12,
    fontFamily: "Poppins_500Medium",
  },
    center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
