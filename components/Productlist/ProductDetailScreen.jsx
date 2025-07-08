// ✅ Fully Working ProductDetailScreen with Meesho-style 'Go to Bag' animation
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
import ProductCoursel from "./ProductCoursel";
import ReviewSection from "./ReviewSection";
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
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const goToBagAnim = useState(new Animated.Value(0))[0];
  const alertAnim = useState(new Animated.Value(-100))[0];
  const { isLoggedIn: isLoggedInUser, refreshGuestCart } = useIsLoggedIn();

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
      }).start(() => setAlertMessage(""));
    }, 3000);
  };

  const triggerGoToBagAnim = () => {
    Animated.sequence([
      Animated.timing(goToBagAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(goToBagAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScroll = (e) => setIsScrolledEnough(e.nativeEvent.contentOffset.y > 400);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (error) return <Text>Error loading product: {error.message}</Text>;

  const product = data?.getProduct;
  if (!product) return <View style={styles.center}><Text>No product found.</Text></View>;

  const colorVariants = product.variant || [];
  const selectedColorVariant = colorVariants[selectedColorIndex] || {};
  const sizeVariants = selectedColorVariant.size || [];
  const selectedSizeVariant = sizeVariants.length > 0 ? sizeVariants[selectedSizeIndex] || sizeVariants[0] : selectedColorVariant;
  const images = selectedSizeVariant?.images?.length > 0 ? selectedSizeVariant.images : selectedColorVariant?.images || [];

  const handleAddToCart = async () => {
    const cartItem = {
      productId: id,
      quantity: 1,
      variantName: selectedColorVariant.variantName,
      size: typeof selectedSizeVariant === "object" ? selectedSizeVariant.size?.[0] : selectedSizeVariant,
      price: parseFloat(selectedColorVariant?.mrpPrice) || 0,
      image: selectedSizeVariant?.images?.[0] || selectedColorVariant?.images?.[0] || product?.previewImage,
      productName: product?.productName,
    };

    try {
      const token = await AsyncStorage.getItem("email");
      if (token) {
        await addCart({ variables: cartItem });
        showAlert("Product added to cart", "success");
      } else {
        const existingCart = await AsyncStorage.getItem("guestCart");
        let updatedCart = existingCart ? JSON.parse(existingCart) : [];
        const index = updatedCart.findIndex(item => item.productId === cartItem.productId);
        if (index !== -1) updatedCart[index].quantity += 1;
        else updatedCart.push(cartItem);
        await AsyncStorage.setItem("guestCart", JSON.stringify(updatedCart));
        refreshGuestCart();
        showAlert("Added to cart (guest)", "success");
      }
      triggerGoToBagAnim();
    } catch (err) {
      console.error("Add to cart error:", err);
      showAlert("Failed to add product", "error");
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedInUser) return navigation.navigate("LoginScreen");
    const buyButton = {
      productId: id,
      quantity: 1,
      variantName: selectedColorVariant.variantName,
      size: typeof selectedSizeVariant === "object" ? selectedSizeVariant.size?.[0] : selectedSizeVariant,
      price: parseFloat(selectedColorVariant?.mrpPrice) || 0,
      image: selectedSizeVariant?.images?.[0] || selectedColorVariant?.images?.[0] || product?.previewImage,
      productName: product?.productName,
    };
    await AsyncStorage.setItem("buynow", JSON.stringify(buyButton));
    navigation.navigate("MyOrdersScreen", { isbuynow: true });
  };

  const goToBagTranslate = goToBagAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      {alertMessage !== "" && (
        <Animated.View style={[styles.alertContainer, { borderLeftColor: alertType === "success" ? "#4CAF50" : "#f44336", transform: [{ translateY: alertAnim }] }]}>          <AntDesign name={alertType === "success" ? "checkcircle" : "closecircleo"} size={20} color={alertType === "success" ? "#4CAF50" : "#f44336"} />
          <Text style={styles.alertText}>{alertMessage}</Text>
        </Animated.View>
      )}

      <View style={styles.fixedHeader}><StaticHeader /></View>

      <ScrollView contentContainerStyle={{ paddingBottom: 200, paddingTop: 60 }} onScroll={handleScroll} scrollEventThrottle={16}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          keyExtractor={(_, i) => i.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => { setSelectedImageIndex(index); setImageViewerVisible(true); }}>
              <Image source={{ uri: item }} style={{ width, height: 500, resizeMode: "cover" }} />
            </TouchableOpacity>
          )}
        />

        <ImageViewing
          images={images.map(uri => ({ uri }))}
          imageIndex={selectedImageIndex}
          visible={isImageViewerVisible}
          onRequestClose={() => setImageViewerVisible(false)}
        />

        <ReviewSection />
        <ProductCoursel />
      </ScrollView>

      {/* Animated 'Go to Bag' */}
      <Animated.View style={[styles.goToBag, { transform: [{ translateY: goToBagTranslate }] }]}>  
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <Text style={styles.goToBagText}>Go to Bag</Text>
        </TouchableOpacity>
      </Animated.View>

      {!isScrolledEnough && (
        <View style={styles.fixedButtons}>
          <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
            <AntDesign name="shoppingcart" size={20} color="#000" />
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
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
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  alertContainer: {
    position: "absolute",
    top: StatusBar.currentHeight || 30,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
    elevation: 6,
    borderLeftWidth: 5,
  },
  alertText: { fontSize: 14, marginLeft: 10, fontFamily: "Poppins-Medium", color: "#333", flexShrink: 1 },
  fixedHeader: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "#fff", elevation: 4 },
  fixedButtons: { position: "absolute", bottom: 70, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#ccc", zIndex: 10 },
  cartButton: { flex: 1, flexDirection: "row", alignItems: "center", borderColor: "#aaa", borderWidth: 1, padding: 12, marginRight: 8, borderRadius: 6, justifyContent: "center" },
  cartText: { marginLeft: 8, fontFamily: "Poppins-Medium", fontSize: 16, color: "#000" },
  buyButton: { flex: 1, backgroundColor: "#0C8CE9", padding: 12, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  buyText: { fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#fff" },
  goToBag: { position: "absolute", bottom: 130, left: 0, right: 0, alignItems: "center", zIndex: 20 },
  goToBagText: { backgroundColor: "#0C8CE9", color: "#fff", paddingVertical: 10, paddingHorizontal: 40, borderRadius: 20, fontSize: 16, fontFamily: "Poppins-SemiBold" },
});
