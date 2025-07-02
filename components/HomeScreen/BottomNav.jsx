import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import footMidIcon from "../../assets/Footer/footmid.png";
import { useQuery } from "@apollo/client";
import { GET_CART } from "../../graphql/queries";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
const { width } = Dimensions.get("window");
const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isLoggedIn: isLoggedInUser, guestCartData } =
    useIsLoggedIn();
  const { data: cartData } = useQuery(GET_CART);
  const tabs = [
    {
      name: "Home",
      icon: "home-outline",
      activeIcon: "home",
      route: "HomeScreen",
    },
    {
      name: "Trending",
      icon: "flame-outline",
      activeIcon: "flame",
      route: "ProductShowcase",
    },
    { name: "", isCenter: true, route: "Allcat" },
    {
      name: "Cart",
      icon: "cart-outline",
      activeIcon: "cart",
      route: "CartScreen",
    },
    {
      name: "Profile",
      icon: "person-outline",
      activeIcon: "person",
      route: "Profile",
    },
  ];
  const cartItemCount = isLoggedInUser
    ? cartData?.getCart?.cartProducts?.length || 0
    : guestCartData?.length || 0;
  return (
    <SafeAreaView style={styles.wrapper} edges={["bottom"]}>
      <View style={styles.container}>
        {tabs.map((tab, index) => {
          const isActive = route.name === tab.route;
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                tab.route && navigation.navigate(tab.route)
              }
              activeOpacity={0.7}
              style={[
                styles.tabItem,
                tab.isCenter && styles.centerTab,
                { flex: tab.isCenter ? 0.7 : 1 },
              ]}
            >
              <View
                style={
                  tab.isCenter
                    ? styles.centerIconWrapper
                    : styles.defaultIconWrapper
                }
              >
                {tab.isCenter ? (
                  <Image
                    source={footMidIcon}
                    style={styles.centerImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={{ position: "relative" }}>
                    <Ionicons
                      name={isActive ? tab.activeIcon : tab.icon}
                      size={24}
                      color={isActive ? "#2563EB" : "#A0AEC0"}
                    />
                    {tab.route === "CartScreen" && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {cartItemCount}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
              {!tab.isCenter && (
                <Text
                  style={[
                    styles.label,
                    isActive && styles.activeLabel,
                  ]}
                >
                  {tab.name}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 10,
    width: width,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 100,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  container: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: "#A0AEC0",
    marginTop: 2,
  },
  activeLabel: {
    color: "#2563EB",
  },
  centerTab: {
    top: -1,
  },
  defaultIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerIconWrapper: {
    backgroundColor: "#0C8CE9",
    padding: 8,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#F58220",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  centerImage: {
    paddingTop: 10,
    width: 50,
    height: 50,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
export default BottomNav;
