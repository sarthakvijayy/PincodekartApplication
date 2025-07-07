import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
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

import ProductCard from "../Productlist/ProductCard";
import FilterModal from "../Productlist/FilterModal";

const { width } = Dimensions.get("window");
const itemWidth = width / 2 - 24;

const CategoryScreen = ({ route }) => {
  const { categoryId } = route.params;
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const productSectionRef = useRef(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({});

  const { data: categoryData, loading: loadingCategories } = useQuery(
    GET_ALL_CATEGORIES,
    {
      variables: { page: 0, take: 20 },
    }
  );

  const [fetchProducts, { data: productData, loading: loadingProducts }] =
    useLazyQuery(GET_PRODUCTS_BY_CATEGORY);

  const renderProduct = useCallback(
    ({ item }) => {
      const imageUrl = item?.previewImage?.trim();

      return (
        <ProductCard
          id={item.id}
          image={imageUrl}
          brand={item.brandName || "Pincodekart"}
          title={item.productName}
          mrpPrice={item?.variant?.[0]?.mrpPrice}
          originalPrice={
            item?.variant?.[0]?.originalPrice || item?.variant?.[0]?.mrpPrice
          }
          discount={item?.variant?.[0]?.discount || 0}
          rating={item.avgRating || "4.0"}
          initialWishlisted={item.isWishlisted || false}
        />
      );
    },
    [navigation]
  );

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
      fetchProducts({ variables: { catId: categoryId, sortOrder: "asc" } });

      if (categoryData?.getAllCategories?.categories) {
        const selected = categoryData.getAllCategories.categories.find(
          (c) => c.id === categoryId
        );
        if (selected) setCategoryName(selected.categoryName);
      }

      setTimeout(() => {
        const node = findNodeHandle(productSectionRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 500);
    }
  }, [categoryId, categoryData]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <CategoryHeader />

        {/* Filter Button */}
      <View style={styles.filterWrapper}>
  <TouchableOpacity
    style={[
      styles.radioButton,
      showFilterModal && styles.radioButtonActive,
    ]}
    onPress={() => setShowFilterModal(true)}
  >
    <View style={styles.radioCircle} />
    <Text style={styles.radioLabel}>Filter</Text>
  </TouchableOpacity>
</View>


        {/* Filter Modal */}
        <FilterModal
          visible={showFilterModal}
          onClose={(appliedFilters) => {
            setShowFilterModal(false);
            if (appliedFilters) {
              setFilters(appliedFilters);
              console.log("Selected Filters:", appliedFilters);
              // Future: Use filters to fetch filtered data
            }
          }}
        />

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
      </ScrollView>

      
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
    fontFamily: "Poppins_500Medium",
    marginTop: 20,
    marginBottom: 12,
    color: "#444",
  },
  productList: {
    paddingBottom: 80,
    flexDirection: 'row',
  },
  emptyText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
  filterWrapper: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
  marginBottom: 6,
},

radioButton: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#ccc",
  alignSelf: "flex-start",
},

radioButtonActive: {
  borderColor: "#0C8CE9",
},

radioCircle: {
  height: 10,
  width: 10,
  borderRadius: 7,
  borderWidth: 2,
  borderColor: "#ccc",
  marginRight: 8,
  backgroundColor: "#fff",
},

radioLabel: {
  fontSize: 14,
  fontFamily: "Poppins_500Medium",
  color: "#0C8CE9",
},

});

export default CategoryScreen;
