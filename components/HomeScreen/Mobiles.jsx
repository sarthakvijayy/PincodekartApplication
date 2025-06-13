import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Mobiles = () => {
          const navigation = useNavigation();
        
          const handlePress = () => {
            navigation.navigate('ProductShowcase');
          };

  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient colors={['#F3DCAF', '#FFB320']} style={styles.gradientBackground}>
        {/* Top Banner */}
        <Image source={require('../../assets/Mobile/mobilesbanner.png')} style={styles.bannerImage} />

        {/* Deals Row */}
        <View style={styles.dealsRow}>
          {deals.map((item, index) => (
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

const deals = [
  { title: 'Women Fashion', discount: 'Min 30% OFF', image: require('../../assets/Laptop/Monitor.png') },
  { title: 'Books & Media', discount: 'Min 50% OFF', image: require('../../assets/Laptop/laptop.png')},
];

const styles = StyleSheet.create({
  sectionWrapper: {
    overflow: 'hidden',
  },
  gradientBackground: {
    paddingVertical: 20,
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  dealsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 16,
  },
  dealCard: {
    width: (width - 48) / 2, // Two cards side-by-side with margin
    backgroundColor: '#FF5722',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 25,
  },
  dealImage: {
    width: '100%',
    height: 100,
  },
  dealInfo: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  dealDiscount: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default Mobiles;
