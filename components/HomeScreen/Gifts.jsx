import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const wellnessDeals = [
  { title: 'Deal Of The Day', discount: '30% OFF', image: require('../../assets/Gifts/g1.png') },
  { title: 'Deal Of The Day', discount: '15% OFF', image: require('../../assets/Gifts/g2.png') },
  { title: 'Deal Of The Day', discount: '25% OFF', image: require('../../assets/Gifts/g3.png') },
  { title: 'Deal Of The Day', discount: '30% OFF', image: require('../../assets/Gifts/g4.png') },
  { title: 'Deal Of The Day', discount: '15% OFF', image: require('../../assets/Gifts/g5.jpg') },
  { title: 'Deal Of The Day', discount: '25% OFF', image: require('../../assets/Gifts/g6.jpg') },
];

const Gifts = () => {
  
const navigation = useNavigation();
        
          const handlePress = () => {
            navigation.navigate('ProductShowcase');
          };

  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient colors={['#F3DCAF', '#BB7B00']} style={styles.gradientBackground}>
        
        {/* Banner */}
        <Image 
          source={require('../../assets/Gifts/Gbanner.png')} 
          style={styles.bannerImage} 
        />

        {/* Grid of 6 Products */}
        <View style={styles.dealsGrid}>
          {wellnessDeals.map((item, index) => (
            <TouchableOpacity key={index} style={styles.dealCard} onPress={handlePress}>
                          <Image source={item.image} style={styles.dealImage} resizeMode="cover" />
                          <View style={styles.dealInfo}>
                            <Text style={styles.dealTitle}>{item.title}</Text>
                            <Text style={styles.dealDiscount}>{item.discount}</Text>
                          </View>
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
    paddingVertical: 20,
    // borderRadius: 10,
    // marginHorizontal: 10,
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  dealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dealCard: {
    width: (width - 50) / 3, // 3 cards per row
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dealImage: {
    width: '100%',
    height: 110,
  },
  dealInfo: {
    padding: 8,
    alignItems: 'center',
  },
  dealTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dealDiscount: {
    fontSize: 14,
    color: '#184977',
    marginTop: 3,
    fontWeight: 'bold',
  },
});

export default Gifts;
