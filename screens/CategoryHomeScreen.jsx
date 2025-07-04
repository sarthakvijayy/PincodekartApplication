import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_CATEGORY, GET_CATEGORY_BY_ID } from '../graphql/queries';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 180;

const CategoryHomeScreen = ({
  categoryId,
  gradientColors = ['#FFF', '#EEE'],
  hideTitle = false,
  bannerRepeatCount = 3,
}) => {
  const navigation = useNavigation();

  const { data: catData, loading: catLoading, error: catError } = useQuery(
    GET_CATEGORY_BY_ID,
    {
      variables: { getCategoryId: categoryId },
    }
  );

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { catId: categoryId },
  });

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
        <Text style={{ color: 'red' }}>
          {catError?.message || productError?.message}
        </Text>
      </View>
    );
  }

  const banner = catData?.getCategory?.categoryImage;
  const products = productData?.getProductsByCat?.slice(0, 10) || [];

  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient colors={gradientColors} style={styles.gradientBackground}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerScroll}
        >
          {Array.from({ length: bannerRepeatCount }).map((_, index) => (
            <Image
              key={index}
              source={{ uri: banner }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.productSection}>
          {!hideTitle && (
            <Text style={styles.sectionTitle}>
              {catData?.getCategory?.categoryName || 'Deals'}
            </Text>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardScrollContainer}
            snapToInterval={160 + 16}
            decelerationRate="fast"
          >
            {products.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.dealCard}
                onPress={() => handlePress(item.id)}
              >
                <Image
                  source={{
                    uri: item?.variant?.[0]?.images?.[0] || item.previewImage,
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
                      : 'Special Deal'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
};

export default CategoryHomeScreen;

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
    height: BANNER_HEIGHT,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
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
