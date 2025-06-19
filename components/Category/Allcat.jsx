import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import {
  GET_ALL_CATEGORIES,
  GET_PRODUCTS_BY_CATEGORY,
} from "../../graphql/queries";
import CategoryHeader from "./CategoryHeader";
import BottomNav from "../HomeScreen/BottomNav";
import ProductCard from "../Productlist/ProductCard";

const { width } = Dimensions.get("window");
const itemWidth = width / 2 - 24;

const Allcat = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [fetchProductsByCat, { loading: loadingProducts }] =
    useLazyQuery(GET_PRODUCTS_BY_CATEGORY);

  const {
    data: catData,
    loading: loadingCats,
    error: catError,
  } = useQuery(GET_ALL_CATEGORIES, {
    variables: { page: null, take: null },
  });

  useEffect(() => {
    if (catData?.getAllCategories?.categories) {
      const topLevelCategories = catData.getAllCategories.categories.filter(
        (cat) => cat.parent === null
      );
      setCategories(topLevelCategories);
    }
  }, [catData]);

  const handleCategoryPress = (cat) => {
    setSelectedCat(cat);
    fetchProductsByCat({ variables: { catId: cat.id, sortOrder: "asc" } })
      .then((res) => setProducts(res.data.getProductsByCat || []))
      .catch(() => setProducts([]));
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <Image
        source={{ uri: item.categoryIcon }}
        style={styles.categoryImage}
      />
      <Text style={styles.categoryText} numberOfLines={1}>
        {item.categoryName}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => {
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
    }
    

  if (loadingCats)
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (catError)
    return (
      <View>
        <Text>Error loading categories</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <CategoryHeader />

      {!selectedCat ? (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[styles.gridContainer, { paddingBottom: 100 }]}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              setSelectedCat(null);
              setProducts([]);
            }}
          >
            <Text style={styles.backText}>← Back to categories</Text>
          </TouchableOpacity>
          {loadingProducts ? (
            <ActivityIndicator style={{ marginTop: 20 }} size="large" />
          ) : products.length ? (
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={[styles.prodList, { paddingBottom: 100 }]}
            />
          ) : (
            <Text style={styles.emptyText}>
              No products in {selectedCat.categoryName}
            </Text>
          )}
        </>
      )}

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    padding: 16,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  backText: {
    fontSize: 16,
    margin: 16,
    color: "#2A55E5",
    fontWeight: "600",
  },
  prodList: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    width: itemWidth,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  noImage: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  productText: {
    fontSize: 14,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});

export default Allcat;
