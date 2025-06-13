import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const deals = [
  { title: 'Deal on Blazer', discount: 'UPTO 30% OFF', image: require('../../assets/Kitchens/k1.png') },
  { title: 'Deal on Jeans', discount: 'UPTO 30% OFF', image: require('../../assets/Kitchens/k2.png') },
  { title: 'Deal on Shirts', discount: 'UPTO 30% OFF', image: require('../../assets/Kitchens/k3.png') },
  { title: 'Deal on Dresses', discount: 'UPTO 30% OFF', image: require('../../assets/Kitchens/k1.png') },
  { title: 'Deal on Kurtis', discount: 'UPTO 30% OFF', image: require('../../assets/Kitchens/k1.png') },
];

const Kitchens = () => {
  
const navigation = useNavigation();
        
          const handlePress = () => {
            navigation.navigate('ProductShowcase');
          };

  return (
    <View style={styles.dealsSection}>
      <LinearGradient
        colors={['#FFBFF9', '#D600C0']}
        style={styles.gradientBackground}
      >
        <ScrollView>
          <Image source={require('../../assets/Kitchens/kitchenbanner.png')} style={styles.bannerImage1} />
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {deals.map((item, index) => (
            <TouchableOpacity key={index} style={styles.dealCard} onPress={handlePress}>
                          <Image source={item.image} style={styles.dealImage} resizeMode="cover" />
                          <View style={styles.dealInfo}>
                            <Text style={styles.dealTitle}>{item.title}</Text>
                            <Text style={styles.dealDiscount}>{item.discount}</Text>
                          </View>
                        </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerImage1: {
    width: width - 32,
    height: 180,
    marginHorizontal: 16,
    // borderRadius: 10,
    // marginRight: 25,
  },
  dealsSection: {
    backgroundColor: '#F3C2C2',
    paddingVertical: 20,
    // marginTop: 20,
  },
  gradientBackground: {
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  dealCard: {
    width: 140,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
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
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dealDiscount: {
    fontSize: 15,
    color: '#184977',
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default Kitchens;
