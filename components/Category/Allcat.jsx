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
import { Ionicons } from "@expo/vector-icons";
import {
  GET_ALL_CATEGORIES,
  GET_PRODUCTS_BY_CATEGORY,
} from "../../graphql/queries";
import BottomNav from "../HomeScreen/BottomNav";


const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 3 - 30;

const Allcat = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [subCats, setSubCats] = useState([]);
  const [products, setProducts] = useState([]);

  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES, {
    variables: { page: null, take: null },
  });

  const [fetchProducts, { loading: prodLoading }] = useLazyQuery(
    GET_PRODUCTS_BY_CATEGORY
  );

  useEffect(() => {
    if (data?.getAllCategories?.categories) {
      const all = data.getAllCategories.categories;
      const mainCats = all.filter((c) => c.parent === null);
      setCategories(mainCats);
      if (mainCats.length) {
        selectCategory(mainCats[0].id, all);
      }
    }
  }, [data]);

  const selectCategory = (catId, allCats = null) => {
    console.log("CatId" , catId)
    setSelectedCatId(catId);
    const all = allCats || data.getAllCategories.categories;
    setSubCats(all.filter((c) => c.parent === catId));

    fetchProducts({ variables: { catId } })
      .then((res) => setProducts(res.data.getProductsByCat || []))
      .catch(() => setProducts([]));

      
  };



  const renderMainCat = ({ item }) => (
    <TouchableOpacity
      onPress={() => selectCategory(item.id)}
      style={[
        styles.mainCategory,
        item.id === selectedCatId && styles.mainCategorySelected,
      ]}
    >
      <Image source={{ uri: item.categoryIcon }} style={styles.mainIcon} />
      <Text
        style={[
          styles.mainText,
          item.id === selectedCatId && { color: "#0C8CE9" },
        ]}
      >
        {item.categoryName}
      </Text>
    </TouchableOpacity>
  );

  const renderSubCat = ({ item }) => (
    <TouchableOpacity style={styles.subCategoryItem}
      onPress={() =>
        navigation.navigate("CategoryScreen", {
          categoryId: item.id,
          catName: item.categoryName,
        })
      }
    >
      <Image
        source={{ uri: item.categoryIcon }}
        style={styles.subCategoryIcon}
      />
      <Text style={styles.subCategoryText} numberOfLines={2} ellipsizeMode="tail">
        {item.categoryName}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => {
    const img = item.previewImage?.trim();
 
  };

  

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <Text>Error loading categories</Text>;


  

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>All Categories</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.left}>
          <FlatList
            data={categories}
            renderItem={renderMainCat}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.right}>
          <Text style={styles.sectionTitle}>Subcategories</Text>
          <FlatList
            data={subCats}
            key={selectedCatId}
            renderItem={renderSubCat}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.rowWrap}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />

          
        </View>
      </View>

      <BottomNav />
    </View>
  );
};

export default Allcat;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "700", marginLeft: 10 },

  body: { flex: 1, flexDirection: "row" },

  left: {
    width: 100,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },
  mainCategory: {
    padding: 12,
    alignItems: "center",
  },
  mainCategorySelected: {
    backgroundColor: "#e8f0ff",
    borderLeftWidth: 4,
    borderColor: "#0C8CE9",
  },
  mainIcon: { width: 40, height: 40, borderRadius: 20 },
  mainText: { marginTop: 6, fontSize: 12, color: "#444", textAlign: "center" },

  right: { flex: 1, },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
    color: "#333",
  },
  subCategoryItem: {
    width: ITEM_WIDTH,
    marginBottom: 24,
    alignItems: "center",
  },
  subCategoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  subCategoryText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 80,
    flexWrap: 'wrap',
    minHeight: 36,
    alignSelf: 'center',
  },

  rowWrap: { justifyContent: "space-between" },

  noData: { textAlign: "center", marginVertical: 12, color: "#777" },
});
