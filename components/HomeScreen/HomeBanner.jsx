import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  View,
  Animated,
} from "react-native";

const { width } = Dimensions.get("window");

const banners = [
  require("../../assets/banners/banner.png"),
  require("../../assets/banners/banner.png"),
  require("../../assets/banners/banner.png"),
  require("../../assets/banners/banner.png"),
];

const HomeBanner = () => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.bannerCarousel}
      >
        {banners.map((item, index) => (
          <Image
            key={index}
            source={item}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  bannerCarousel: {
    marginTop: 10,
  },
  bannerImage: {
    width: width,
    height: 180,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#2D9CDB",
    width: 10,
    height: 10,
  },
});

export default HomeBanner;
