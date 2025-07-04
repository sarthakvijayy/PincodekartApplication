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
import { GET_PRODUCTS_BY_CATEGORY, GET_CATEGORY_BY_ID } from '../../graphql/queries';

const { width } = Dimensions.get('window');
const CATEGORY_ID = '6703c999a24ddf9a40b16c40';

const DealsOfDaySection = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const { data: catData, loading: catLoading, error: catError } = useQuery(GET_CATEGORY_BY_ID, {
    variables: { getCategoryId: CATEGORY_ID },
  });

  const { data: productData, loading: productLoading, error: productError } = useQuery(
    GET_PRODUCTS_BY_CATEGORY,
    {
      variables: { catId: CATEGORY_ID },
    }
  );

  const handlePress = (id) => {
    navigation.navigate('ProductDetail', { id });
  };

  if (catLoading || productLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF3C3C" />
      </View>
    );
  }

  if (catError || productError) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: 'red' }}>{catError?.message || productError?.message}</Text>
      </View>
    );
  }

  const bannerImage = catData?.getCategory?.categoryImage;
  const products = productData?.getProductsByCat?.slice(0, 5) || [];

  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient colors={['#F3C2C2', '#FF3C3C']} style={styles.gradientBackground}>
        
        {/* 🔄 Swipable Banner (No dots or title) */}
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          style={styles.bannerScroll}
        >
          {[1, 2, 3].map((_, index) => (
            <Image
              key={index}
              source={{ uri: bannerImage }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ))}
        </Animated.ScrollView>

        {/* 🛍️ Animated Product Cards */}
        <View style={styles.productSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardScrollContainer}
            snapToInterval={160 + 16}
            decelerationRate="fast"
          >
            {products.map((item, index) => {
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
                  style={{ opacity: fadeAnim, transform: [{ translateY }] }}
                >
                  <TouchableOpacity style={styles.dealCard} onPress={() => handlePress(item.id)}>
                    <Image
                      source={{ uri: item?.variant?.[0]?.images?.[0] || item.previewImage }}
                      style={styles.dealImage}
                      resizeMode="cover"
                    />
                    <View style={styles.dealInfo}>
                      <Text style={styles.dealTitle} numberOfLines={1}>
                        {item.productName}
                      </Text>
                      <Text style={styles.dealDiscount}>
                        {item.discount ? `UPTO ${item.discount}% OFF` : 'Special Deal'}
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

export default DealsOfDaySection;

const styles = StyleSheet.create({
  sectionWrapper: {
    overflow: 'hidden',
    marginBottom: 0,
  },
  gradientBackground: {
    paddingVertical: 15,
  },
  bannerScroll: {
    paddingLeft: 16,
  },
  bannerImage: {
    width: width - 32,
    height: (width - 32) * 0.5,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardScrollContainer: {
    paddingBottom: 10,
    gap: 10,
  },
  productSection: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  dealCard: {
    width: 140,
    marginRight: 12,
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
