import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Header from '../components/HomeScreen/Header';
import StaticHeader from '../components/HomeScreen/StaticHeader';
import BottomNav from '../components/HomeScreen/BottomNav';
import BannerCarousel from '../components/HomeScreen/BannerCarousel';
import FeatureRow from '../components/HomeScreen/FeatureRow';
import DealsSection from '../components/HomeScreen/DealsSection';
import FashionTalkSection from '../components/HomeScreen/FashionTalkSection';
import DealsOfDaySection from '../components/HomeScreen/DealsOfTheDay';
import Laptops from '../components/HomeScreen/Laptops&Monitors';
import WomenFoot from '../components/HomeScreen/WomenFoot';
import FruitsAndVeg from '../components/HomeScreen/FruitsAndVeg';
import Kids from '../components/HomeScreen/Kids';
import Wellness from '../components/HomeScreen/Wellness';
import Mobiles from '../components/HomeScreen/Mobiles';
import Kitchens from '../components/HomeScreen/Kitchens';
import HomeDecor from '../components/HomeScreen/HomeDecor';
import Stationary from '../components/HomeScreen/Stationary';
import Medicines from '../components/HomeScreen/Medicines';
import Sports from '../components/HomeScreen/Sports';
import KidsFootwear from '../components/HomeScreen/KidsFootwear';
import Cosmatics from '../components/HomeScreen/Cosmatics';
import Toys from '../components/HomeScreen/Toys';
import Jewellery from '../components/HomeScreen/Jewellery';
import Furniture from '../components/HomeScreen/Furniture';
import CarAccesories from '../components/HomeScreen/CarAccesories';
import Cars from '../components/HomeScreen/Cars';
import Nursery from '../components/HomeScreen/Nursery';
import Gifts from '../components/HomeScreen/Gifts';
import Bikes from '../components/HomeScreen/Bike';
import Cycles from '../components/HomeScreen/Cycles';
import Pet from '../components/HomeScreen/Pet';

const sections = [
  { key: 'banner', component: BannerCarousel },
  { key: 'feature', component: FeatureRow },
  { key: 'deals', component: DealsSection },
  { key: 'fashion', component: FashionTalkSection },
  { key: 'dealsOfDay', component: DealsOfDaySection },
  { key: 'laptops', component: Laptops },
  { key: 'womenFoot', component: WomenFoot },
  { key: 'fruits', component: FruitsAndVeg },
  { key: 'kids', component: Kids },
  { key: 'wellness', component: Wellness },
  { key: 'mobiles', component: Mobiles },
  { key: 'kitchen', component: Kitchens },
  { key: 'decor', component: HomeDecor },
  { key: 'stationary', component: Stationary },
  { key: 'medicines', component: Medicines },
  { key: 'sports', component: Sports },
  { key: 'kidsFootwear', component: KidsFootwear },
  { key: 'cosmetics', component: Cosmatics },
  { key: 'toys', component: Toys },
  { key: 'jewellery', component: Jewellery },
  { key: 'furniture', component: Furniture },
  { key: 'carAccesories', component: CarAccesories },
  { key: 'cars', component: Cars },
  { key: 'nursery', component: Nursery },
  { key: 'gifts', component: Gifts },
  { key: 'bikes', component: Bikes },
  { key: 'cycles', component: Cycles },
  { key: 'pet', component: Pet },
];

const HomeScreen = () => {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const lastOffset = useRef(0);

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    // Instant reaction
    if (currentOffset > 100) {
      setShowStickyHeader(currentOffset < lastOffset.current); // Scroll up = show
    } else {
      setShowStickyHeader(false); // Show full header at top
    }

    lastOffset.current = currentOffset;
  };

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
          return <Component />;
        }}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={7} // ✅ Faster scroll detection
        onScroll={handleScroll}
        initialNumToRender={1} // ✅ Render faster
        maxToRenderPerBatch={4}
        windowSize={6}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

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
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
