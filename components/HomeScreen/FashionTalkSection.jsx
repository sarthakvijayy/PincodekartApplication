import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FashionTalkSection = () => {
  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient colors={['#F3DCAF', '#FFB320']} style={styles.gradientBackground}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          <Image source={require('../../assets/fashiontalks/fashiontalksbanner.png')} style={styles.bannerImage} />
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealsRow}>
          {deals.map((item, index) => (
            <View key={index} style={styles.dealCard}>
              <Image source={item.image} style={styles.dealImage} resizeMode="cover" />
              <View style={styles.dealInfo}>
                <Text style={styles.dealTitle}>{item.title}</Text>
                <Text style={styles.dealDiscount}>{item.discount}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const deals = [
  { title: 'Deal On Blazer', discount: 'UPTO 30% OFF', image: require('../../assets/deals/blazzer.png') },
  { title: 'Deal On Dresses', discount: 'UPTO 30% OFF', image: require('../../assets/deals/Shirt.png') },
  { title: 'Deal On Shirts', discount: 'UPTO 30% OFF', image: require('../../assets/deals/Shirt.png') },
  { title: 'Deal On Jeans', discount: 'UPTO 30% OFF', image: require('../../assets/deals/jeans.png') },
];

const styles = StyleSheet.create({
  sectionWrapper: {
    overflow: 'hidden',
    // marginBottom: 30,
    // paddingBottom: 10,
  },
  gradientBackground: {
    paddingVertical: 15,
    // borderRadius: 10,
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    marginHorizontal: 16,
    // borderRadius: 10,
  },
  dealsRow: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  dealCard: {
    width: 140,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginHorizontal: 6,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dealImage: {
    width: '100%',
    height: 120,
  },
  dealInfo: {
    padding: 8,
    alignItems: 'center',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dealDiscount: {
    fontSize: 14,
    color: '#184977',
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default FashionTalkSection;
