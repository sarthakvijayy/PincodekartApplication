import React, { useState, useCallback, useRef, useEffect } from "react";
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
import BottomNav from "../HomeScreen/BottomNav";

const { width } = Dimensions.get("window");
const itemWidth = width / 2 - 24;

const CategoryScreen = ({ route }) => {
//   const { categoryId } = route.params;
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const productSectionRef = useRef(null);

  const { data: categoryData, loading: loadingCategories } = useQuery(
    GET_ALL_CATEGORIES,
    {
      variables: { page: 0, take: 20 },
    }
  );

    console.log("t4fdtft5fd45rd4rd")

  const [fetchProducts, { data: productData, loading: loadingProducts }] =
    useLazyQuery(GET_PRODUCTS_BY_CATEGORY);

    console.log("Category Id", Id)

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
            source={{ uri: item?.categoryImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <Text style={styles.productText}>{item.categoryName}</Text>
        
        </TouchableOpacity>
      );
    },
    [navigation]
  );

//   useEffect(() => {
//     if (categoryId) {
//       setSelectedCategory(categoryId);
//       fetchProducts({ variables: { catId: categoryId, sortOrder: "asc" } });

//       const selected = categoryData?.getAllCategories?.categories.find(
//         (c) => c.id === categoryId
//       );
//       if (selected) setCategoryName(selected.categoryName);

//       setTimeout(() => {
//         const node = findNodeHandle(productSectionRef.current);
//         if (node) {
//           AccessibilityInfo.setAccessibilityFocus(node);
//         }
//       }, 500);
//     }
//   }, [categoryId, categoryData]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <CategoryHeader />

        <View ref={productSectionRef} accessible>
          <Text style={styles.sectionTitle}>
            Products in {categoryName || "selected category"}
          </Text>

          {loadingProducts ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={categoryData?.getAllCategories?.categories?.filter((cat)=> cat.parent == null) || []}
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
      </ScrollView>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
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
