import React, { useRef, useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useCart } from './CartContext';
import Header from '../components/HomeScreen/Header';
import StaticHeader from '../components/HomeScreen/StaticHeader';
import BottomNav from '../components/HomeScreen/BottomNav';
import FeatureRow from '../components/HomeScreen/FeatureRow';
import CategorySection from '../screens/CategoryHomeScreen';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';


const sections = [
  { key: 'featureRow', component: FeatureRow },
  {
    key: 'Books & Media',
    component: () => (
      <CategorySection
        categoryId="6703c845a24ddf9a40b16c37"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Kids',
    component: () => (
      <CategorySection
        categoryId="6703c958a24ddf9a40b16c3e"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Kitchens',
    component: () => (
      <CategorySection
        categoryId="6703c999a24ddf9a40b16c40"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Stationary',
    component: () => (
      <CategorySection
        categoryId="6703c9f2a24ddf9a40b16c41"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Home Decor',
    component: () => (
      <CategorySection
        categoryId="6703ca10a24ddf9a40b16c42"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Mobile',
    component: () => (
      <CategorySection
        categoryId="6703ca2ca24ddf9a40b16c43"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Kids Footwear',
    component: () => (
      <CategorySection
        categoryId="6703ca3ca24ddf9a40b16c44"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Beauty & Cosmetics',
    component: () => (
      <CategorySection
        categoryId="6703ca4da24ddf9a40b16c45"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Toys & Games',
    component: () => (
      <CategorySection
        categoryId="6703ca5ba24ddf9a40b16c46"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Fashion Jwellery',
    component: () => (
      <CategorySection
        categoryId="6703ca83a24ddf9a40b16c47"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Furniture Zone',
    component: () => (
      <CategorySection
        categoryId="6745a7dacf4c4ee3f70f1cea"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Electronics',
    component: () => (
      <CategorySection
        categoryId="6745a812cf4c4ee3f70f1ceb"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Motors',
    component: () => (
      <CategorySection
        categoryId="6745a86ccf4c4ee3f70f1ced"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Automobiles',
    component: () => (
      <CategorySection
        categoryId="6745a856cf4c4ee3f70f1cec"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Gift Items',
    component: () => (
      <CategorySection
        categoryId="6745a8abcf4c4ee3f70f1cef"
       backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Pet Supplies',
    component: () => (
      <CategorySection
        categoryId="6745a909cf4c4ee3f70f1cf2"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Men Footwears',
    component: () => (
      <CategorySection
        categoryId="6745a923cf4c4ee3f70f1cf3"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Bag Bazaar',
    component: () => (
      <CategorySection
        categoryId="67dd5d8686d19a479a72542f"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
  {
    key: 'Women Fashions',
    component: () => (
      <CategorySection
        categoryId="67dd5ec886d19a479a725436"
        backgroundColor={colors.PK_Grey6}
        hideTitle={true}
        bannerRepeatCount={3}
      />
    ),
  },
];

const HomeScreen = () => {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);

  const handleScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY < lastOffsetY.current && currentY > 150) {
      setShowStickyHeader(true);
    } else if (currentY <= 150 || currentY > lastOffsetY.current) {
      setShowStickyHeader(false);
    }
    lastOffsetY.current = currentY;
  };

  const navigation = useNavigation();
  const { cartItems } = useCart();
  const cartItemCount = cartItems.length;

  console.log('Cart items:', cartItems);


  return (
    <View style={styles.screenContainer}>
      {showStickyHeader && (
        <View style={styles.stickyHeaderContainer}>
          <StaticHeader />
        </View>
      )}

      <FlatList
        ListHeaderComponent={<Header />}
        data={sections}
        renderItem={({ item }) => {
          const Component = item.component;
          return (
            <Animated.View
              style={{
                opacity: scrollY.interpolate({
                  inputRange: [0, 300],
                  outputRange: [1, 0.8],
                  extrapolate: 'clamp',
                }),
              }}
            >
              <Component />
            </Animated.View>
          );
        }}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        initialNumToRender={1}
        maxToRenderPerBatch={4}
        windowSize={6}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* 🛒 Cart Status Banner (Persistent) */}
      {cartItemCount > 0 && (
        <View style={styles.cartBanner}>
          <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
            <Text style={styles.cartBannerText}>
              🛒 {cartItemCount} product{cartItemCount > 1 ? 's' : ''} in cart • View Cart
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomNavContainer}>
        <BottomNav />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stickyHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#fff',
    paddingVertical: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  cartBanner: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartBannerText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
