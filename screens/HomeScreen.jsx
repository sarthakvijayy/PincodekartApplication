import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Header from '../components/HomeScreen/Header';
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

// Use functional references, not JSX
const sections = [
  { key: 'banner', component: BannerCarousel },
  { key: 'feature', component: FeatureRow },
  { key: 'deals', component: DealsSection }, //Done
  { key: 'fashion', component: FashionTalkSection },//Done
  { key: 'dealsOfDay', component: DealsOfDaySection }, //Done
  { key: 'laptops', component: Laptops },//done
  { key: 'womenFoot', component: WomenFoot }, //done
  { key: 'fruits', component: FruitsAndVeg }, //done
  { key: 'kids', component: Kids }, //done
  { key: 'wellness', component: Wellness },// done
  { key: 'mobiles', component: Mobiles }, //Done
  { key: 'kitchen', component: Kitchens }, //Done
  { key: 'decor', component: HomeDecor }, //Done
  { key: 'stationary', component: Stationary }, //Done
  { key: 'medicines', component: Medicines }, //Done
  { key: 'sports', component: Sports }, //Done
  { key: 'kidsFootwear', component: KidsFootwear }, //Done
  { key: 'cosmetics', component: Cosmatics }, //Done
  { key: 'toys', component: Toys }, //Done
  { key: 'jewellery', component: Jewellery }, //Done
  { key: 'furniture', component: Furniture }, //Done
  { key: 'carAccesories', component: CarAccesories }, //Done
  { key: 'cars', component: Cars }, //Done
  { key: 'nursery', component: Nursery },  //Done
  { key: 'gifts', component: Gifts }, //Done
  { key: 'bikes', component: Bikes }, //Done
  { key: 'cycles', component: Cycles }, //Done
  { key: 'pet', component: Pet },
];

const HomeScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <FlatList
        ListHeaderComponent={<Header />}
        data={sections}
        renderItem={({ item }) => {
          const Component = item.component;
          return <Component />;
        }}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={10}
        updateCellsBatchingPeriod={50}
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
