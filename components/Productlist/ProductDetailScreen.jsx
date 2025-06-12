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

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ route }) => {
  const { id } = route.params;

  // ✅ All hooks at the top
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { getProductId: id },
  });

  const [addCart] = useMutation(ADD_TO_CART);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isScrolledEnough, setIsScrolledEnough] = useState(false);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolledEnough(scrollY > 400);
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (error) return <Text>Error loading product: {error.message}</Text>;

  const product = data?.getProduct;
  if (!product) {
    return (
      <View style={styles.center}>
        <Text>No product found.</Text>
      </View>
    );
  }

  const colorVariants = product.variant || [];
  const selectedColorVariant = colorVariants[selectedColorIndex] || {};
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
    const payload = {
      productId: id,
      quantity: 1,
      variantName: selectedColorVariant.variantName,
      size:
        typeof selectedSizeVariant === "object"
          ? selectedSizeVariant.size[0]
          : selectedSizeVariant,
      price: parseFloat(selectedColorVariant?.mrpPrice) || 0,
    };

    try {
      await addCart({
        variables: payload,
        context: {
          headers: {
            email: "akshya@gmail.com",
          },
        },
      });
      alert("Item Added successfully!!");
    } catch (error) {
      console.log("Error in add to cart", error);
      alert("Failed to add to cart");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <ProductHeader />

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
              <Image source={{ uri: item }} style={styles.bannerImage} />
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {colorVariants.map((variant, index) => (
                <TouchableOpacity
                  key={variant.skuId || `color-${index}`}
                  onPress={() => {
                    setSelectedColorIndex(index);
                    setSelectedSizeIndex(0);
                  }}
                  style={[
                    styles.variantBox,
                    index === selectedColorIndex && styles.variantBoxSelected,
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {sizeVariants.map((variant, index) => {
                  const isSelected = index === selectedSizeIndex;
                  const key =
                    typeof variant === "object"
                      ? variant.skuId || `size-${variant.size || index}`
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
                      <Text style={styles.variantText}>{displaySize}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={styles.sectionText}>{product.description}</Text>
          </View>

          {isScrolledEnough && (
            <View style={styles.scrollButtons}>
              <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
                <AntDesign name="shoppingcart" size={20} color="#000" />
                <Text style={styles.cartText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buyButton}>
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
          <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
            <AntDesign name="shoppingcart" size={20} color="#000" />
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton}>
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
    height: 360,
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
    borderColor: "#2A55E5",
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
    bottom: 60,
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
    backgroundColor: "#2A55E5",
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
});
