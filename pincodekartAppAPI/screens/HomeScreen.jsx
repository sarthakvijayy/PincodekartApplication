import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import HomeBanner from '../components/HomeBanner';
import CategoryGrid from '../components/CategoryGrid';
import IconCarousel from '../components/IconCarousel';
import TopBrands from '../components/TopBrands';
import TopSelling from '../components/TopSelling';
import FooterMenu from '../components/FooterMenu';


const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HomeBanner />
        <IconCarousel />
        <CategoryGrid />
        <TopBrands />
        <TopSelling />
        <colors />
        <FooterMenu />
      </ScrollView>
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
});

export default HomeScreen;
