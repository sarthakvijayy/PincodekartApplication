import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Image, Dimensions, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ALL_HOME_PAGE_SLIDERS } from '../../graphql/queries';

const { width } = Dimensions.get('window');

const HomeBanner = () => {
  const scrollViewRef = useRef(null);
  const currentIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, loading, error } = useQuery(GET_ALL_HOME_PAGE_SLIDERS);

  const banners = data?.getAllHomePageSlider || [];

  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % banners.length;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    currentIndexRef.current = newIndex;
    setCurrentIndex(newIndex);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0C8CE9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load banners.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((item, index) => (
          <View key={item.id || index} style={styles.bannerWrapper}>
            <Image
              source={{ uri: item.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.pagination}>
              {banners.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    currentIndex === i && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeBanner;

const styles = StyleSheet.create({
  container: {},
  loaderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#888',
  },
  bannerWrapper: {
    width,
    height: 190,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2D9CDB',
    width: 10,
    height: 8,
  },
});
