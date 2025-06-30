import React from "react";

import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../../graphql/queries";
import { GET_WISHLIST_QUERY, GET_CART } from "../../graphql/queries";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";

const Header = () => {
  const navigation = useNavigation();
  const { isLoggedIn: isLoggedInUser, guestCartData } =
    useIsLoggedIn();

  const { loading, data, error } = useQuery(GET_ALL_CATEGORIES, {
    variables: { page: 0, take: 10 },
  });

  const {
    loading: wishlistLoading,
    data: wishlistData,
    error: wishlistError,
  } = useQuery(GET_WISHLIST_QUERY);

  const {
    loading: cartLoading,
    data: cartData,
    error: cartError,
  } = useQuery(GET_CART);

  const categories = data?.getAllCategories?.categories || [];

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryItem}
      onPress={() =>
        navigation.navigate("CategoryScreen", {
          categoryId: item.id,
          catName: item.categoryName,
        })
      }
    >
      <Image
        source={{ uri: item.categoryIcon }}
        style={styles.categoryImage}
      />

      <Text style={styles.categoryText}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

  const notificationCount = data?.notifications?.length || 2;
  const wishlistCount =
    wishlistData?.getWishList?.wishlistProducts.length || 0;
  const cartCount = isLoggedInUser
    ? cartData?.getCart?.cartProducts?.length || 0
    : guestCartData?.length || 0;

  return (
    <ImageBackground
      source={require("../../assets/Home/homeBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Logo */}

      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Floating Icons */}

      <View style={styles.floatingIcons}>
        {/* Wishlist */}
        {isLoggedInUser && (
          <TouchableOpacity
            onPress={() => navigation.navigate("WishlistCard")}
          >
            <View style={styles.iconWithBadge}>
              <Feather
                name="heart"
                size={22}
                color="#184977"
                style={styles.iconButton}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  <Text style={styles.badgeText}>
                    {wishlistCount}
                  </Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Cart */}
        <TouchableOpacity
          onPress={() => navigation.navigate("CartScreen")}
        >
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

      {/* Search Bar */}

      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#666"
          style={{ marginLeft: 10 }}
        />

        <TextInput
          placeholder="Search for products."
          placeholderTextColor="#666"
          style={styles.searchInput}
        />

        <TouchableOpacity>
          <Ionicons
            name="mic-outline"
            size={22}
            color="#666"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Feather
            name="camera"
            size={22}
            color="#666"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {/* Categories */}

      <View style={styles.categoriesWrapper}>
        {loading ? (
          <ActivityIndicator size="small" color="#184977" />
        ) : error ? (
          <Text style={{ color: "red" }}>
            Failed to load categories
          </Text>
        ) : (
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCategory}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    height: 500,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },

  logoContainer: {
    alignItems: "flex-start",
  },

  logo: {
    width: 190,

    height: 70,
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

  searchContainer: {
    backgroundColor: "#fff",

    borderRadius: 10,

    flexDirection: "row",

    alignItems: "center",

    marginTop: 20,

    paddingHorizontal: 5,
  },

  searchInput: {
    flex: 1,

    height: 45,

    paddingHorizontal: 10,

    fontSize: 16,

    fontFamily: "Poppins-Regular",
  },

  categoriesWrapper: {
    marginTop: 10,

    flexDirection: "row",

    alignItems: "center",
  },

  categoryItem: {
    alignItems: "center",

    marginRight: 15,
  },

  categoryImage: {
    width: 50,

    height: 60,

    marginBottom: 5,

    resizeMode: "contain",
  },

  categoryText: {
    fontSize: 13,

    color: "#fff",

    textAlign: "center",

    fontFamily: "Poppins-Medium",
  },

  allCategoriesButton: {
    alignItems: "center",

    marginLeft: 10,
  },
});

export default Header;
