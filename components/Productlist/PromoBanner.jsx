import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const PromoBanner = () => {
  return (
    <View style={styles.bannerContainer}>
      <Image
        source={require('../../assets/banners/banner.png')}
        style={styles.banner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  banner: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    // borderRadius: 8,
    marginBottom: 10,
  },
});

export default PromoBanner;
