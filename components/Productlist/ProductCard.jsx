import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AntDesign, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from "../../graphql/mutations";

const ProductCard = ({
  id,
  image,
  brand,
  title,
  mrpPrice,
  originalPrice,
  discount,
  rating,
  initialWishlisted = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // Card scale animation
  const scale = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const [addToWishlist, { loading: adding }] = useMutation(ADD_TO_WISHLIST);
  const [removeFromWishlist, { loading: removing }] = useMutation(
    REMOVE_FROM_WISHLIST,
    {
      onCompleted: (data) => {
        if (data?.removeFromWishlist?.success) {
          setIsWishlisted(false);
        }
      },
    }
  );

  const handleWishlistToggle = async () => {
    const email = await AsyncStorage.getItem("email");
    if (!email) return;

    if (isWishlisted) {
      removeFromWishlist({ variables: { productId: id } });
    } else {
      addToWishlist({ variables: { productId: id } });
      setIsWishlisted(true);
    }
  };

  const parsePrice = (price) =>
    typeof price === "number" ? price : parseFloat(price) || null;

  const displayPrice = parsePrice(originalPrice) || parsePrice(mrpPrice);
  const displayMrp = parsePrice(mrpPrice);

  const imageSource =
    typeof image === "string" && image.trim() !== ""
      ? { uri: image }
      : require("../../assets/images/dairy.png");

  const loading = adding || removing;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { id })}
      activeOpacity={0.9}
      style={[styles.cardContainer, { width: width / 2 - 16 }]}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Top Right Icons */}
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={handleWishlistToggle} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="red" />
            ) : (
              <AntDesign
                name={isWishlisted ? "heart" : "hearto"}
                size={20}
                color={isWishlisted ? "red" : "#555"}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Share.share({
                message: `Check this out: ${title} for ₹${displayPrice || "N/A"}`,
              })
            }
          >
            <Feather name="share-2" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Image with lazy loading */}
        <View style={styles.imageWrapper}>
          {!imageLoaded && (
            <ActivityIndicator size="small" color="#ccc" style={styles.loader} />
          )}
          <Image
            source={imageSource}
            style={[
              styles.productImage,
              { opacity: imageLoaded ? 1 : 0.3 },
            ]}
            onLoad={() => setImageLoaded(true)}
          />
        </View>

        {/* Rating */}
        {rating && <Text style={styles.rating}>⭐ {rating}</Text>}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{displayPrice ? displayPrice.toFixed(0) : "N/A"}
          </Text>
          {displayMrp &&
            displayPrice &&
            displayMrp > displayPrice && (
              <Text style={styles.strikePrice}>₹{displayMrp.toFixed(0)}</Text>
            )}
        </View>

        {/* Discount */}
        {discount && (
          <Text style={styles.discount}>UPTO {discount}% OFF</Text>
        )}

        {/* Tags */}
        <View style={styles.labels}>
          <Text style={styles.hotDeal}>HOT DEAL</Text>
          <Text style={styles.delivery}>Open Box Delivery</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ProductCard;


const styles = StyleSheet.create({
  cardContainer: {
    margin: 6,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    minHeight: 280,
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconRow: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  productImage: {
    width: 170,
    height: 180,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
    resizeMode: "contain",
  },
  rating: {
    fontSize: 12,
    color: "#4CAF50",
    fontFamily: "Poppins_500Medium",
    marginTop: 6,
  },
  title: {
    fontSize: 13,
    color: "#222",
    fontFamily: "Poppins_500Medium",
    marginTop: 6,
    height: 36,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Poppins_700Bold",
  },
  strikePrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    fontFamily: "Poppins_400Regular",
  },
  discount: {
    fontSize: 11,
    color: "#FF4D4D",
    fontWeight: "600",
    marginTop: 4,
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
    loader: {
    position: "absolute",
    top: "40%",
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
