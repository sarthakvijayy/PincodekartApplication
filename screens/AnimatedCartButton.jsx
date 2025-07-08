// Enhancing ProductDetailScreen with animation and UX upgrade for "Add to Cart"
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const AnimatedCartButton = ({ onAddToCart, onGoToBag, added }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (added) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [added]);

  return (
    <View style={styles.cartContainer}>
      {!added ? (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={onAddToCart}
          activeOpacity={0.8}
        >
          <AntDesign name="shoppingcart" size={20} color="#000" />
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <TouchableOpacity
            style={styles.goToBagButton}
            onPress={onGoToBag}
            activeOpacity={0.8}
          >
            <AntDesign name="checkcircle" size={20} color="#fff" />
            <Text style={styles.goToBagText}>Go to Bag</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default AnimatedCartButton;

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    marginRight: 8,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
  },
  cartText: {
    marginLeft: 8,
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#000",
  },
  goToBagButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0C8CE9",
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
  },
  goToBagText: {
    marginLeft: 8,
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#fff",
  },
});
