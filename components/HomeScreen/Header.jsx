import React from "react";

import {View,TextInput,StyleSheet,TouchableOpacity,Image,FlatList,Text,ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../../graphql/queries";

const Header = () => {
  const navigation = useNavigation();

  const { loading, data, error } = useQuery(GET_ALL_CATEGORIES, {
    variables: { page: null, take: null },
  });

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
      <Image source={{ uri: item.categoryIcon }} style={styles.categoryImage} />

      <Text style={styles.categoryText}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#184977", "#459BEC", "#73BBFF", "#DFF0FF"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
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
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <Feather
            name="bell"
            size={22}
            color="#184977"
            style={styles.iconButton}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("WishlistCard")}>
          <Feather
            name="heart"
            size={22}
            color="#184977"
            style={styles.iconButton}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
          <Ionicons
            name="bag-outline"
            size={24}
            color="#184977"
            style={styles.iconButton}
          />
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
          placeholder="Search for products, brands and more"
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
          <Text style={{ color: "red" }}>Failed to load categories</Text>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,

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

    color: "#000",

    textAlign: "center",

    fontFamily: "Poppins-Medium",
  },

  allCategoriesButton: {
    alignItems: "center",

    marginLeft: 10,
  },
});

export default Header;
