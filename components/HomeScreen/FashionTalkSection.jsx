import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import {
  GET_PRODUCTS_BY_CATEGORY,
  GET_CATEGORY_BY_ID,
} from '../../graphql/queries';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 180;
const CATEGORY_ID = '6703c958a24ddf9a40b16c3e';

const FashionTalkSection = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const { data: catData, loading: catLoading, error: catError } = useQuery(
    GET_CATEGORY_BY_ID,
    {
      variables: { getCategoryId: CATEGORY_ID },
    }
  );

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { catId: CATEGORY_ID },
  });

  const handlePress = (id) => {
    navigation.navigate('ProductDetail', { id });
  };

  if (catLoading || productLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFB320" />
      </View>
    );
  }

  if (catError || productError) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: 'red' }}>
          {catError?.message || productError?.message}
        </Text>
      </View>
    );
  }

  const banner = catData?.getCategory?.categoryImage;
  const bannerList = [banner, banner, banner]; // Can be updated with real banners
  const products = productData?.getProductsByCat || [];

  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient
        colors={['#F3DCAF', '#FFB320']}
        style={styles.gradientBackground}
      >
        {/* 🔄 Swipable Banners */}
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={styles.bannerScroll}
        >
          {bannerList.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ))}
        </Animated.ScrollView>

        {/* ◉ Pagination Dots */}
        {/* <View style={styles.dotsRow}>
          {bannerList.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { opacity }]}
              />
            );
          })}
        </View> */}

        {/* 🛍️ Product Cards */}
        <View style={styles.productSection}>
          {/* <Text style={styles.sectionTitle}>Fashion Picks</Text> */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsRow}
          >
            {products.slice(0, 10).map((item, index) => {
              const fadeAnim = useRef(new Animated.Value(0)).current;
              const translateY = useRef(new Animated.Value(20)).current;

              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
              }).start();

              Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
              }).start();

              return (
                <Animated.View
                  key={item.id}
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                  }}
                >
                  <TouchableOpacity
                    style={styles.dealCard}
                    onPress={() => handlePress(item.id)}
                  >
                    <Image
                      source={{
                        uri:
                          item?.variant?.[0]?.images?.[0] ||
                          item.previewImage ||
                          '',
                      }}
                      style={styles.dealImage}
                      resizeMode="cover"
                    />
                    <View style={styles.dealInfo}>
                      <Text style={styles.dealTitle} numberOfLines={1}>
                        {item.productName}
                      </Text>
                      <Text style={styles.dealDiscount}>
                        {item.discount
                          ? `UPTO ${item.discount}% OFF`
                          : 'Limited Deal'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
};

export default FashionTalkSection;

const styles = StyleSheet.create({
  sectionWrapper: {
    overflow: 'hidden',
  },
  gradientBackground: {
    paddingVertical: 15,
  },
  bannerScroll: {
    paddingLeft: 16,
  },
  bannerImage: {
    width: width - 32,
    height: BANNER_HEIGHT,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  productSection: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  dealsRow: {
    paddingBottom: 10,
    gap: 20,
  },
  dealCard: {
    width: 140,
    backgroundColor: '#ffffff',
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
    height: 120,
  },
  dealInfo: {
    padding: 10,
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
    marginTop: 4,
    fontWeight: 'bold',
  },
  loader: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
