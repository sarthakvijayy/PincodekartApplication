import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Animated,
  StatusBar,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCT } from "../../graphql/queries";
import { AntDesign } from "@expo/vector-icons";
import ProductHeader from "./ProductHeader";
import ReviewSection from "./ReviewSection";
import ProductCoursel from "./ProductCoursel";
import BottomNav from "../HomeScreen/BottomNav";
import { ADD_TO_CART } from "../../graphql/mutations";
import ImageViewing from "react-native-image-viewing";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
import StaticHeader from "../HomeScreen/StaticHeader";

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params;

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { getProductId: id },
  });

  const [addCart] = useMutation(ADD_TO_CART);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isScrolledEnough, setIsScrolledEnough] = useState(false);
  const [isImageViewerVisible, setImageViewerVisible] =
    useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const alertAnim = useState(new Animated.Value(-100))[0];
  const {
    isLoggedIn: isLoggedInUser,
    guestCartData,
    refreshGuestCart,
  } = useIsLoggedIn();

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);

    Animated.timing(alertAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(alertAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setAlertMessage("");
      });
    }, 4000);
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolledEnough(scrollY > 400);
  };

  if (loading)
    return (
      <ActivityIndicator size="large" style={{ marginTop: 50 }} />
    );
  if (error)
    return <Text>Error loading product: {error.message}</Text>;

  const product = data?.getProduct;
  if (!product) {
    return (
      <View style={styles.center}>
        <Text>No product found.</Text>
      </View>
    );
  }

  const colorVariants = product.variant || [];
  const selectedColorVariant =
    colorVariants[selectedColorIndex] || {};
  const sizeVariants = selectedColorVariant.size || [];
  const selectedSizeVariant =
    sizeVariants.length > 0
      ? sizeVariants[selectedSizeIndex] || sizeVariants[0]
      : selectedColorVariant;

  const images =
    selectedSizeVariant?.images?.length > 0
      ? selectedSizeVariant.images
      : selectedColorVariant?.images || [];

  const handleAddToCart = async () => {
    const cartItem = {
      productId: id,
      quantity: 1,
      variantName: selectedColorVariant.variantName,
      size:
        typeof selectedSizeVariant === "object"
          ? selectedSizeVariant.size?.[0]
          : selectedSizeVariant,
      price: parseFloat(selectedColorVariant?.mrpPrice) || 0,
      image:
        selectedSizeVariant?.images?.[0] ||
        selectedColorVariant?.images?.[0] ||
        product?.previewImage,
      productName: product?.productName,
    };

    try {
      const token = await AsyncStorage.getItem("email"); // or check isLoggedIn

      if (token) {
        // ✅ User is logged in → send to server
        await addCart({ variables: cartItem });
        showAlert("Product added to cart successfully", "success");
      } else {
        const existingCart = await AsyncStorage.getItem("guestCart");
        let updatedCart = [];

        if (existingCart) {
          updatedCart = JSON.parse(existingCart);

          const index = updatedCart.findIndex(
            (item) => item.productId === cartItem.productId
          );

          if (index !== -1) {
            updatedCart[index].quantity += 1;
          } else {
            updatedCart.push(cartItem);
          }
        } else {
          updatedCart.push(cartItem);
        }

        await AsyncStorage.setItem(
          "guestCart",
          JSON.stringify(updatedCart)
        );
        refreshGuestCart(); // this is not working
        showAlert("Added to cart (as guest)", "success");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      showAlert("Failed to add product to cart", "error");
    }
  };

  const handleBuyNow = () => {
    const orderPayload = {
      productId: id,
      productName: product.productName,
      variantName: selectedColorVariant.variantName,
      size:
        typeof selectedSizeVariant === "object"
          ? selectedSizeVariant.size?.[0] ||
            selectedSizeVariant.variantName
          : selectedSizeVariant,
      price: parseFloat(selectedColorVariant?.mrpPrice) || 0,
      quantity: 1,
      image:
        selectedSizeVariant?.images?.[0] ||
        selectedColorVariant?.images?.[0] ||
        product?.previewImage,
    };

    navigation.navigate("MyOrderScreen", {
      fromBuyNow: true,
      item: orderPayload,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Top Alert */}
      {alertMessage !== "" && (
        <Animated.View
          style={[
            styles.alertContainer,
            {
              borderLeftColor:
                alertType === "success" ? "#4CAF50" : "#f44336",
              transform: [{ translateY: alertAnim }],
            },
          ]}
        >
          <AntDesign
            name={
              alertType === "success" ? "checkcircle" : "closecircleo"
            }
            size={20}
            color={alertType === "success" ? "#4CAF50" : "#f44336"}
          />
          <Text style={styles.alertText}>{alertMessage}</Text>
        </Animated.View>
      )}

      <View style={styles.fixedHeader}>
        <StaticHeader />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 200, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <FlatList
          data={images}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedImageIndex(index);
                setImageViewerVisible(true);
              }}
            >
              <Image
                source={{ uri: item }}
                style={styles.bannerImage}
              />
            </TouchableOpacity>
          )}
        />

        <ImageViewing
          images={images.map((img) => ({ uri: img }))}
          imageIndex={selectedImageIndex}
          visible={isImageViewerVisible}
          onRequestClose={() => setImageViewerVisible(false)}
        />

        <View style={styles.sliderDots}>
          {images.map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.brand}>
            {product.previewName || "Brand Name"}
          </Text>
          <Text style={styles.title}>{product.productName}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹
              {selectedSizeVariant?.mrpPrice ||
                selectedColorVariant?.mrpPrice ||
                "N/A"}
            </Text>
          </View>

          <View style={styles.variantContainer}>
            <Text style={styles.sectionTitle}>Select Variant</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {colorVariants.map((variant, index) => (
                <TouchableOpacity
                  key={variant.skuId || `color-${index}`}
                  onPress={() => {
                    setSelectedColorIndex(index);
                    setSelectedSizeIndex(0);
                  }}
                  style={[
                    styles.variantBox,
                    index === selectedColorIndex &&
                      styles.variantBoxSelected,
                  ]}
                >
                  <Text style={styles.variantText}>
                    {variant.variantName || `Color ${index + 1}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {sizeVariants.length > 0 && (
            <View style={styles.variantContainer}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {sizeVariants.map((variant, index) => {
                  const isSelected = index === selectedSizeIndex;
                  const key =
                    typeof variant === "object"
                      ? variant.skuId ||
                        `size-${variant.size || index}`
                      : `size-${variant}-${index}`;
                  const displaySize =
                    typeof variant === "object"
                      ? variant.variantName || variant.size || index
                      : variant;

                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setSelectedSizeIndex(index)}
                      style={[
                        styles.variantBox,
                        isSelected && styles.variantBoxSelected,
                      ]}
                    >
                      <Text style={styles.variantText}>
                        {displaySize}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={styles.sectionText}>
              {product.description}
            </Text>
          </View>

          {isScrolledEnough && (
            <View style={styles.scrollButtons}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={handleAddToCart}
              >
                <AntDesign
                  name="shoppingcart"
                  size={20}
                  color="#000"
                />
                <Text style={styles.cartText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={handleBuyNow}
              >
                <Text style={styles.buyText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          )}

          <ReviewSection />
          <ProductCoursel />
        </View>
      </ScrollView>

      {!isScrolledEnough && (
        <View style={styles.fixedButtons}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={handleAddToCart}
          >
            <AntDesign name="shoppingcart" size={20} color="#000" />
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuyNow}
          >
            <Text style={styles.buyText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomNav />
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  alertContainer: {
    position: "absolute",
    top: -29,
    left: 0,
    right: 0,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 10,
  },
  alertText: {
    color: "#276029",
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: width,
    height: 500,
    resizeMode: "cover",
  },
  sliderDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  detailsContainer: {
    padding: 16,
  },
  brand: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  title: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: "#222",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: "#000",
  },
  variantContainer: {
    marginVertical: 12,
  },
  variantBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 6,
  },
  variantBoxSelected: {
    borderColor: "#0C8CE9",
    backgroundColor: "#DFF0FF",
  },
  variantText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#333",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    marginBottom: 8,
    color: "#222",
  },
  sectionText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  fixedButtons: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    zIndex: 10,
  },
  scrollButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingBottom: 16,
  },
  cartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 6,
    justifyContent: "center",
  },
  cartText: {
    marginLeft: 8,
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#000",
  },
  buyButton: {
    flex: 1,
    backgroundColor: "#0C8CE9",
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buyText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  alertContainer: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    marginTop: StatusBar.currentHeight || 30,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 999,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 5,
  },
  alertText: {
    fontSize: 14,
    marginLeft: 10,
    fontFamily: "Poppins-Medium",
    color: "#333",
    flexShrink: 1,
  },
});
