import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions , TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const products = [
  { image: require('../../assets/vegetables/veg1.png') },
  { image: require('../../assets/vegetables/chips.png') },
  { image: require('../../assets/vegetables/colddrinks.png') },
];

const FruitsAndVeg = () => {
   const navigation = useNavigation();
    
      const handlePress = () => {
        navigation.navigate('ProductShowcase');
      };
  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient
        colors={['#C4F9E0', '#B2FFFE']}
        style={styles.gradientBackground}
      >
        {/* Banner Image */}
        <Image 
          source={require('../../assets/vegetables/VegetableBanner.png')} 
          style={styles.bannerImage} 
        />

        {/* 3 Static Product Cards */}
        <View style={styles.productRow}>
          {products.map((item, index) => (
            <TouchableOpacity key={index} style={styles.productCard} onPress={handlePress}>
              <Image source={item.image} style={styles.productImage} resizeMode="cover" />
              <Text style={styles.productTitle}>{item.title}</Text>
            </TouchableOpacity>
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

export default FruitsAndVeg;
