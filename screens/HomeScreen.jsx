import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Header from '../components/HomeScreen/Header';
import BottomNav from '../components/HomeScreen/BottomNav';

// Import all sections in an array
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
  <BannerCarousel key="banner" />,
  <FeatureRow key="feature" />,
  <DealsSection key="deals" />,
  <FashionTalkSection key="fashion" />,
  <DealsOfDaySection key="dealsOfDay" />,
  <Laptops key="laptops" />,
  <WomenFoot key="womenFoot" />,
  <FruitsAndVeg key="fruits" />,
  <Kids key="kids" />,
  <Wellness key="wellness" />,
  <Mobiles key="mobiles" />,
  <Kitchens key="kitchen" />,
  <HomeDecor key="decor" />,
  <Stationary key="stationary" />,
  <Medicines key="medicines" />,
  <Sports key="sports" />,
  <KidsFootwear key="kidsFootwear" />,
  <Cosmatics key="cosmetics" />,
  <Toys key="toys" />,
  <Jewellery key="jewellery" />,
  <Furniture key="furniture" />,
  <CarAccesories key="carAccesories" />,
  <Cars key="cars" />,
  <Nursery key="nursery" />,
  <Gifts key="gifts" />,
  <Bikes key="bikes" />,
  <Cycles key="cycles" />,
  <Pet key="pet" />,
];

const HomeScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <FlatList
        ListHeaderComponent={<Header />}
        data={sections}
        renderItem={({ item }) => item}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        updateCellsBatchingPeriod={50}
      />
      <BottomNav />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
