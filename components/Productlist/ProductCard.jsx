import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import {ADD_TO_WISHLIST,REMOVE_FROM_WISHLIST,} from "../../graphql/mutations";


const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth / 2 - 20;

const ProductCard = ({id,image,brand,title,mrpPrice,originalPrice,discount,rating,initialWishlisted = false,}) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const navigation = useNavigation();

  const [addToWishlist, { loading: adding }] = useMutation(ADD_TO_WISHLIST);
  const [removeFromWishlist, { loading: removing }] = useMutation(
    REMOVE_FROM_WISHLIST,
    {
      onCompleted: (data) => {
        if (data?.removeFromWishlist?.success) {
          setIsWishlisted(false);
          Alert.alert("Removed from Wishlist");
        } else {
          Alert.alert(
            "Error",
            data?.removeFromWishlist?.message ||
              "Could not remove from wishlist"
          );
        }
      },
      onError: () => {
        Alert.alert("Error", "Could not remove from wishlist");
      },
    }
  );

  const handleWishlistToggle = async () => {
    const email = await AsyncStorage.getItem("email");
    if (!email) {
      Alert.alert("Login Required", "Please login to manage wishlist");
      return;
    }

    if (isWishlisted) {
      removeFromWishlist({ variables: { productId: id } });
    } else {
      addToWishlist({ variables: { productId: id } });
      setIsWishlisted(true);
    }
  };

  const loading = adding || removing;
  const imageSource = typeof image === "string" ? { uri: image } : image;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { id: id })}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <Text style={styles.sponsored}>Sponsored</Text>

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={handleWishlistToggle}
            disabled={loading}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            {loading ? (
              <ActivityIndicator size="small" color="red" />
            ) : (
              <AntDesign
                name={isWishlisted ? "heart" : "hearto"}
                size={22}
                color={isWishlisted ? "red" : "#555"}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Share.share({
                message: `Check out this product: ${title} for ₹${originalPrice}`,
              })
            }
            style={styles.shareIcon}
          >
            <Feather name="share-2" size={22} color="#555" />
          </TouchableOpacity>
        </View>

        <Image source={imageSource} style={styles.productImage} />

        <Text style={styles.rating}>⭐ {rating}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{mrpPrice}</Text>
          {/* <Text style={styles.originalPrice}>₹{originalPrice}</Text>
          <Text style={styles.discount}>{discount}% OFF</Text> */}
        </View>

        <View style={styles.labels}>
          <Text style={styles.hotDeal}>HOT DEAL</Text>
          <Text style={styles.delivery}>Open Box Delivery</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    fontFamily: "Poppins_400Regular",
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 6,
    padding: 10,
    width: CARD_WIDTH,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sponsored: {
    fontSize: 12,
    color: "#000",
    fontFamily: "Poppins_400Regular",
  },
  iconRow: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    flexDirection: "row",
    gap: 10,
  },
  shareIcon: {
    marginLeft: 12,
  },
  productImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    resizeMode: "cover",
    marginVertical: 8,
  },
  rating: {
    fontSize: 12,
    color: "#4CAF50",
    fontFamily: "Poppins_500Medium",
  },
  title: {
    fontSize: 14,
    color: "#222",
    fontFamily: "Poppins_500Medium",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    flexWrap: "wrap",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Poppins_700Bold",
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 13,
    color: "#888",
    textDecorationLine: "line-through",
    fontFamily: "Poppins_400Regular",
    marginRight: 6,
  },
  discount: {
    fontSize: 12,
    color: "#00A000",
    fontFamily: "Poppins_500Medium",
  },
  labels: {
    flexDirection: "row",
    marginTop: 6,
    gap: 6,
  },
  hotDeal: {
    backgroundColor: "#FF4D4D",
    color: "#fff",
    fontSize: 10,
    fontFamily: "Poppins_500Medium",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  delivery: {
    backgroundColor: "#E0F7EA",
    color: "#2E7D32",
    fontSize: 10,
    fontFamily: "Poppins_500Medium",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
