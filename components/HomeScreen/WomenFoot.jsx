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
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { GET_CATEGORY_BY_ID, GET_PRODUCTS_BY_CATEGORY } from '../../graphql/queries';

const { width } = Dimensions.get('window');
const CATEGORY_ID = '6703ca10a24ddf9a40b16c42';

const WomenFoot = () => {
  const navigation = useNavigation();
  const scrollRef = useRef(null);

  const { data: catData, loading: catLoading, error: catError } = useQuery(GET_CATEGORY_BY_ID, {
    variables: { getCategoryId: CATEGORY_ID },
  });

  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { catId: CATEGORY_ID },
  });

  const handlePress = (id) => {
    navigation.navigate('ProductDetailScreen', { id });
  };

  if (catLoading || productLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0B41FF" />
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

  const banner = catData?.getCategory?.categoryImage;
  const products = productData?.getProductsByCat || [];

  // Optional: If you want to use multiple static banners (e.g. in a carousel), duplicate the banner
  const banners = [banner, banner, banner]; // Replace with different URLs if available

  return (
    <View style={styles.dealsSection}>
      <LinearGradient colors={['#BFCDFF', '#0B41FF']} style={styles.gradientBackground}>
        {/* Banner Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          style={{ marginBottom: 20 }}
        >
          {banners.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Product Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
          {products.slice(0, 5).map((item) => (
            <TouchableOpacity key={item.id} style={styles.dealCard} onPress={() => handlePress(item.id)}>
              <Image
                source={{ uri: item?.variant?.[0]?.images?.[0] || item.previewImage }}
                style={styles.dealImage}
                resizeMode="cover"
              />
              <View style={styles.dealInfo}>
                <Text style={styles.dealTitle} numberOfLines={1}>{item.productName}</Text>
                <Text style={styles.dealDiscount}>{item.discount ? `UPTO ${item.discount}% OFF` : 'Hot Deal'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default WomenFoot;

const styles = StyleSheet.create({
  dealsSection: {
    // backgroundColor: '#BFCDFF',
    // paddingVertical: 20,
  },
  gradientBackground: {
    paddingVertical: 20,
    marginHorizontal: 0,
    // borderRadius: 10,
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  cardsContainer: {
    paddingLeft: 15,
    paddingTop: 5,
    paddingRight: 4,
  },
  dealCard: {
    width: 140,
    marginRight: 16,
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
