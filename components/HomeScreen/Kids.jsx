import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const kidsDeals = [
  { title: 'Kids T-shirt', discount: 'Flat 20% OFF', image: require('../../assets/kids/k1.png') },
  { title: 'Kids Shorts', discount: 'Flat 25% OFF', image: require('../../assets/kids/k2.png') },
  { title: 'Kids Shoes', discount: 'Flat 30% OFF', image: require('../../assets/kids/k3.png') },
  { title: 'Kids Jacket', discount: 'Flat 35% OFF', image: require('../../assets/kids/k4.png') },
];

const Kids = () => {
  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient colors={['#FED68A', '#FFAF14']} style={styles.gradientBackground}>
        
        {/* Banner */}
        <Image 
          source={require('../../assets/kids/kidsbanner.png')} 
          style={styles.bannerImage} 
        />

        {/* Four Deal Cards in Single Row */}
        <View style={styles.dealsRow}>
          {kidsDeals.map((item, index) => (
            <View key={index} style={styles.dealCard}>
              <Image source={item.image} style={styles.dealImage} resizeMode="cover" />
              <View style={styles.dealInfo}>
                <Text style={styles.dealTitle}>{item.title}</Text>
                <Text style={styles.dealDiscount}>{item.discount}</Text>
              </View>
            </View>
          ))}
        </View>

      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    
  },
  gradientBackground: {
    paddingVertical: 20,
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    marginHorizontal: 16,
    // borderRadius: 10,
    marginBottom: 20,
  },
  dealsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dealCard: {
    width: (width - 60) / 4,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dealImage: {
    width: '100%',
    height: 90,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dealInfo: {
    padding: 5,
    alignItems: 'center',
  },
  dealTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dealDiscount: {
    fontSize: 13,
    color: '#184977',
    marginTop: 2,
    fontWeight: 'bold',
  },
});

export default Kids;
