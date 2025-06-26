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
import { GET_PRODUCTS_BY_CATEGORY, GET_CATEGORY_BY_ID } from '../../graphql/queries';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 180;
const CATEGORY_ID = "6703ca3ca24ddf9a40b16c44"; 

const DealsSection = () => {
  const navigation = useNavigation();

  // Fetch category for banner
  const { data: catData, loading: catLoading, error: catError } = useQuery(GET_CATEGORY_BY_ID, {
    variables: { getCategoryId: CATEGORY_ID },
    fetchPolicy: 'network-only',
  });

  // Fetch products in category
  const { data: productData, loading: productLoading, error: productError } = useQuery(
    GET_PRODUCTS_BY_CATEGORY,
    {
      variables: { catId: CATEGORY_ID },
      fetchPolicy: 'network-only',
    }
  );

  const handlePress = (id) => {
    navigation.navigate('ProductDetail', { 
      id : id, });
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

  const bannerImage = catData?.getCategory?.categoryImage;
  const bannerList = bannerImage ? [bannerImage, bannerImage] : []; // Placeholder duplication
  const products = productData?.getProductsByCat || [];

  if (!bannerImage && products.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: '#333' }}>No data found for this category.</Text>
      </View>
    );
  }

  return (
    <View style={styles.dealsSection}>
      <LinearGradient colors={['#F3C2C2', '#FF3C3C']} style={styles.gradientBackground}>
        {/* Swipable Banners */}
        {bannerList.length > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
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
          </ScrollView>
        )}

        {/* Product Scroll */}
        <View style={styles.productSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardScrollContainer}
          snapToInterval={160 + 16}
          decelerationRate="fast"
        >
          {products.slice(0, 5).map((item) => {
            const imageUri = item?.variant?.[0]?.images?.[0] || item?.previewImage;
            return (
              <TouchableOpacity key={item.id} style={styles.dealCard} onPress={() => handlePress(item.id)}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.dealImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.dealImage, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>No Image</Text>
                  </View>
                )}
                <View style={styles.dealInfo}>
                  <Text style={styles.dealTitle} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.dealDiscount}>
                    {item.discount ? `UPTO ${item.discount}% OFF` : 'Special Deal'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
};

export default DealsSection;

const styles = StyleSheet.create({
  dealsSection: {
    backgroundColor: '#F3C2C2',
    // paddingBottom: 20,
  },
  gradientBackground: {
    paddingTop: 10,
    paddingBottom: 20,
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
  cardScrollContainer: {
    paddingBottom: 10,
      gap: 10
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
