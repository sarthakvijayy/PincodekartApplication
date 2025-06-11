import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
import banner1 from '../assets/images/banner1.jpg';  // Make sure path is correct

const HomeBanner = () => {
  return (
    <View style={styles.bannerContainer}>
      <Image source={banner1} style={styles.bannerImage} />
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerTitle}>Welcome to PincodeKart</Text>
        <Text style={styles.bannerSubtitle}>Best Deals Near You!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  bannerTextContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#FFD700', // Golden
    fontSize: 16,
    marginTop: 4,
  },
});

export default HomeBanner;
