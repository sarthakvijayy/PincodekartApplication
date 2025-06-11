import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const products = [
  { image: require('../../assets/Toys/t1.png') },
  { image: require('../../assets/Toys/t2.png') },
  { image: require('../../assets/Toys/t3.png') },
];

const Toys = () => {
  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient
        colors={['#C0F298', '#96FF43']}
        style={styles.gradientBackground}
      >
        {/* Banner Image */}
        <Image 
          source={require('../../assets/Toys/ToyBanner.png')} 
          style={styles.bannerImage} 
        />

        {/* 3 Static Product Cards */}
        <View style={styles.productRow}>
          {products.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <Image source={item.image} style={styles.productImage} resizeMode="cover" />
              <Text style={styles.productTitle}>{item.title}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    // paddingVertical: 20,
    // marginBottom: 20,
  },
  gradientBackground: {
    // paddingVertical: 20,
    // borderRadius: 10,
    // marginHorizontal: 10,
    // marginBottom: 10,
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    marginHorizontal: 16,
    // borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  productCard: {
    width: 100,
    alignItems: 'center',
  },
  productImage: {
    width: 110,
    height: 120,
    // borderRadius: 10,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    textAlign: 'center',
  },
});

export default Toys;
