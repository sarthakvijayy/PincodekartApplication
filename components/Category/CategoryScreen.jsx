import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ScrollView,
  findNodeHandle,
  AccessibilityInfo,
} from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import {
  GET_ALL_CATEGORIES,
  GET_PRODUCTS_BY_CATEGORY,
} from "../../graphql/queries";
import CategoryHeader from "./CategoryHeader";

const { width } = Dimensions.get("window");
const itemWidth = width / 2 - 24;

const CategoryScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const productSectionRef = useRef(null);

  const { data: categoryData, loading: loadingCategories } = useQuery(
    GET_ALL_CATEGORIES,
    {
      variables: { page: 0, take: 10 },
    }
  );

  const [
    fetchProducts,
    { data: productData, loading: loadingProducts },
  ] = useLazyQuery(GET_PRODUCTS_BY_CATEGORY);

  const handleCategoryPress = (catId) => {
    setSelectedCategory(catId);
    fetchProducts({ variables: { catId, sortOrder: "asc" } });

    const selected = categoryData?.getAllCategories?.categories.find(
      (c) => c.id === catId
    );
    setCategoryName(selected?.categoryName);

    setTimeout(() => {
      const node = findNodeHandle(productSectionRef.current);
      if (node) {
        AccessibilityInfo.setAccessibilityFocus(node);
      }
    }, 500);
  };

  const renderCategory = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => handleCategoryPress(item.id)}
        disabled={loadingProducts}
        style={[
          styles.categoryButton,
          selectedCategory === item.id && styles.activeCategory,
        ]}
        accessibilityLabel={`Category ${item.categoryName}`}
      >
        <Image
          source={{ uri: item.categoriesIcon }}
          style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>{item.categoryName}</Text>
      </TouchableOpacity>
    ),
    [selectedCategory, loadingProducts]
  );

  const renderProduct = useCallback(
    ({ item }) => {
      const price = item?.variant?.[0]?.mrpPrice ?? "N/A";
      const variantName = item?.variant?.[0]?.variantName ?? "";
      const imageUrl = item?.previewImage?.trim();

      return (
        <TouchableOpacity
          style={styles.productCard}
          onPress={() =>
            navigation.navigate("ProductDetail", {
              id: item.id,
              productName: item.productName,
            })
          }
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <Text style={styles.productText}>{item.productName}</Text>
          {variantName !== "" && (
            <Text style={styles.productSubText}>{variantName}</Text>
          )}
          <Text style={styles.productPrice}>₹{price}</Text>
        </TouchableOpacity>
      );
    },
    [navigation]
  );

  <CategoryHeader />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Browse Categories</Text>

      {loadingCategories ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={categoryData?.getAllCategories?.categories || []}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No categories available.
            </Text>
          }
        />
      )}

      {selectedCategory && (
        <View ref={productSectionRef} accessible>
          <Text style={styles.sectionTitle}>
            Products in {categoryName}
          </Text>

          {loadingProducts ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={productData?.getProductsByCat || []}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.productList}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No products found in this category.
                </Text>
              }
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 12,
  },
  categoryList: {
    paddingBottom: 10,
  },
  categoryButton: {
    alignItems: "center",
    marginRight: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    width: 90,
  },
  activeCategory: {
    backgroundColor: "#cce5ff",
    borderColor: "#3399ff",
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 6,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginTop: 20,
    marginBottom: 12,
    color: "#444",
  },
  productList: {
    paddingBottom: 80,
  },
  productCard: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    borderRadius: 12,
    padding: 12,
    width: itemWidth,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  productText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#333",
    textAlign: "center",
  },
  productSubText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#777",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    textAlign: "center",
    marginTop: 4,
  },
  emptyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
});

export default CategoryScreen;
