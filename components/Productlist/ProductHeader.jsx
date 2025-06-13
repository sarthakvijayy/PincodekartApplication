import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_CART } from "../../graphql/queries";
import Modal from "react-native-modal";

const { width } = Dimensions.get("window");

const ProductHeader = ({
  categories = [],
  filters = [],
  productsByCategory = {},
}) => {
  const navigation = useNavigation();
  const [isCategoryModalVisible, setCategoryModalVisible] =
    useState(false);
  const [isFilterModalVisible, setFilterModalVisible] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

   const {loading: cartLoading, data: cartData , error: cartError}
    = useQuery(GET_CART);

  const openCategoryModal = (category) => {
    setSelectedCategory(category);
    setCategoryModalVisible(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalVisible(false);
    setSelectedCategory("");
  };

  const openFilterModal = (filter) => {
    setSelectedFilter(filter);
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
    setSelectedFilter("");
  };

    const cartCount = cartData?.getCart?.cartProducts?.length || 0;


  return (
    <>
      {/* Header */}
      <LinearGradient
        colors={["#2A55E5", "#5C84EE", "#BEDFFF"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <Ionicons
            name="arrow-back"
            size={22}
            color="#fff"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={18}
              color="#888"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, brands and more"
              placeholderTextColor="#888"
            />
          </View>
             <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
                   <View style={styles.iconWithBadge}>
                     <Ionicons
                       name="bag-outline"
                       size={24}
                       color="#184977"
                       style={styles.iconButton}
                     />
                     <View style={styles.badge}>
                       <Text style={styles.badgeText}>
                         <Text style={styles.badgeText}>{cartCount}</Text>
                       </Text>
                     </View>
                   </View>
                 </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Category Modal */}
      <Modal
        isVisible={isCategoryModalVisible}
        onBackdropPress={closeCategoryModal}
        swipeDirection="down"
        onSwipeComplete={closeCategoryModal}
        backdropOpacity={0.4}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.dragIndicator} />
          <Text style={styles.modalTitle}>{selectedCategory}</Text>

          {productsByCategory[selectedCategory]?.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {productsByCategory[selectedCategory].map((item) => (
                <View key={item.id} style={styles.productCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.price}>
                      ₹{item.price}{" "}
                      <Text style={styles.originalPrice}>
                        ₹{item.originalPrice}
                      </Text>{" "}
                      <Text style={styles.discount}>
                        {item.discount}% off
                      </Text>
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>
              No products available in this category.
            </Text>
          )}
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isVisible={isFilterModalVisible}
        onBackdropPress={closeFilterModal}
        swipeDirection="down"
        onSwipeComplete={closeFilterModal}
        backdropOpacity={0.4}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.dragIndicator} />
          <Text style={styles.modalTitle}>{selectedFilter}</Text>
          <Text style={styles.emptyText}>
            Filter options coming soon...
          </Text>
        </View>
      </Modal>
    </>
  );
};

export default ProductHeader;

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 80,
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F5F6FA",
    borderRadius: 15,
    alignItems: "center",
    paddingHorizontal: 12,
    height: 42,
    marginHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333",
  },
  categoryBar: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingLeft: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#F1F1F1",
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#555",
    marginRight: 4,
  },
  activeChip: {
    backgroundColor: "#D7E3FF",
  },
  activeCategoryText: {
    color: "#2A55E5",
    fontWeight: "600",
  },
  filterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingLeft: 10,
    // borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B6B6B6",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 18,
  },
  filterText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#333",
    marginRight: 4,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "60%",
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 12,
  },
  productCard: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 10,
  },
  productImage: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: 6,
    marginRight: 12,
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
  },
  brand: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  title: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#555",
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#000",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  discount: {
    color: "green",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  emptyText: {
    marginTop: 20,
    fontFamily: "Poppins_400Regular",
    color: "#888",
    textAlign: "center",
  },
  floatingIcons: {
    flexDirection: "row",

    position: "absolute",

    top: 60,

    right: 15,

    gap: 15,
  },

  iconButton: {
    backgroundColor: "#DFF0FF",

    padding: 8,

    borderRadius: 20,

    elevation: 4,
  },
  iconWithBadge: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

});
