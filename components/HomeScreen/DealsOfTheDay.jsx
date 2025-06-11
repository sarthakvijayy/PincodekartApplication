import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const deals = [
  { title: 'Deal Of The Day', discount: '30% OFF', image: require('../../assets/DOD/dod1.png') },
  { title: 'Deal Of The Day', discount: '15% OFF', image: require('../../assets/DOD/dod2.png') },
  { title: 'Deal Of The Day', discount: '25% OFF', image: require('../../assets/DOD/dod3.png') },
  { title: 'Deal Of The Day', discount: '25% OFF', image: require('../../assets/DOD/dod3.png') },
];

const categories = [
  { title: 'Women Fashion', discount: 'Min 30% OFF', image: require('../../assets/DOD/dod4.png') },
  { title: 'Books & Media', discount: 'Min 50% OFF', image: require('../../assets/DOD/dod5.png') },
  { title: 'Sports', discount: 'Min 60% OFF', image: require('../../assets/DOD/dod6.png') },
  { title: 'Men Fashion', discount: 'Min 30% OFF', image: require('../../assets/DOD/dod7.png') },
];

const DealsOfDaySection = () => {
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      
      {/* Top Deals Section */}
      <LinearGradient colors={['#C8F2D4', '#D8C8F2']} style={styles.gradientContainer}>
        <Image source={require('../../assets/DOD/dodbanner.png')} style={styles.bannerImage} resizeMode="cover" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealsRow}>
          {deals.map((item, index) => (
            <View key={index} style={styles.dealCard}>
              <Image source={item.image} style={styles.dealImage} resizeMode="contain" />
              <Text style={styles.dealTitle}>{item.title}</Text>
              <Text style={styles.dealDiscount}>{item.discount}</Text>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Middle Banner with Shop Now */}
      <View style={styles.styleBannerContainer}>
        <Image source={require('../../assets/DOD/dodbanner2.png')} style={styles.styleBannerImage} resizeMode="cover" />
      </View>

      {/* Categories Grid */}
      <LinearGradient colors={['#C4D0F9', '#2E5CFF']} style={styles.gridContainer}>
        <View style={styles.gridWrapper}>
          {categories.map((item, index) => (
            <View key={index} style={styles.categoryCard}>
              <Image source={item.image} style={styles.categoryImage} resizeMode="cover" />
              
              {/* Discount badge */}
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>{item.discount}</Text>
                <Text style={styles.categoryTitle}>{item.title}</Text>
              </View>

              {/* Title */}
              {/* <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{item.title}</Text>
              </View> */}
            </View>
          ))}
        </View>
      </LinearGradient>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    paddingBottom: 20,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    width: width,
    height: 180,
  },
  dealsRow: {
    flexDirection: 'row',
    marginTop: 15,
    paddingHorizontal: 16,
  },
  dealCard: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    width: 120,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  dealImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
  dealDiscount: {
    fontSize: 13,
    color: '#184977',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  styleBannerContainer: {
    // marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#C4D0F9',
  },
  styleBannerImage: {
    width: width - 32,
    height: 180,
    // borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  shopNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gridContainer: {
    paddingVertical: 24,
    paddingBottom: 7,
    marginTop: -10,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    width: (width / 2) - 24,
    overflow: 'hidden',
    elevation: 4,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: 180,
  },
  discountBadge: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: '#2A55E5CC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 11,
    zIndex: 1,
    width: 153.88636779785156,
    height: 49.90909194946289,
    top: 120,
    left: 18,
    borderRadius: 3.83,

  },
  discountBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    left: 18,
  },
  categoryInfo: {
    padding: 10,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default DealsOfDaySection;
