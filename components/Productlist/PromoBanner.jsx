import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ALL_HOME_PAGE_SLIDERS } from '../../graphql/queries';

const PromoBanner = () => {
  const { data, loading, error } = useQuery(GET_ALL_HOME_PAGE_SLIDERS);

  // Let's pick the 1st promo banner, or filter based on some content tag if needed
  const promoBanner = data?.getAllHomePageSlider?.[0];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0C8CE9" />
      </View>
    );
  }

  if (error || !promoBanner) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load promo banner.</Text>
      </View>
    );
  }

  return (
    <View style={styles.bannerContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (promoBanner?.url) {
            // Optional: Add logic to open promoBanner.url in WebBrowser or Linking.openURL
            console.log("Banner URL:", promoBanner.url);
          }
        }}
      >
        <Image
          source={{ uri: promoBanner.image }}
          style={styles.banner}
          resizeMode="cover"
        />
      </TouchableOpacity>
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
    borderRadius: 8,
  },
  loadingContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#999',
  },
});

export default PromoBanner;
