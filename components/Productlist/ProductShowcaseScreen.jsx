import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ProductHeader from '../../components/Productlist/ProductHeader';
import PromoBanner from '../../components/Productlist/PromoBanner';
import ProductCard from '../../components/Productlist/ProductCard';
import RecommendedCarousel from '../../components/Productlist/RecommendedCoursol';
import BottomNav from '../HomeScreen/BottomNav';
import { useNavigation } from '@react-navigation/native';
import { request, gql } from 'graphql-request';
import StaticHeader from '../HomeScreen/StaticHeader';

const GRAPHQL_ENDPOINT = 'https://pincodekart.com/api/graphql';
const IMAGE_BASE_URL = ''; 

const PRODUCTS_QUERY = gql`
  query Products($page: Int, $take: Int) {
    getAllProducts(page: $page, take: $take) {
      products {
        id
        productName
        brandId
        price
        sellingPrice
        discount
        image
        reviewId
        variant {
          images
          variantName
          mrpPrice
        }
      }
    }
  }
`;

const ProductShowcaseScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const variables = { page: 0, take: 100 };
      const data = await request(GRAPHQL_ENDPOINT, PRODUCTS_QUERY, variables);
      const fetchedProducts = data?.getAllProducts?.products || [];
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductPress = (item) => {
    const variant = item?.variant?.[0] || {};
    const image =
      variant.images?.[0]
        ? `${IMAGE_BASE_URL}${variant.images[0]}`
        : item.image
        ? `${IMAGE_BASE_URL}${item.image}`
        : null;

    navigation.navigate('ProductDetail', {
      product: {
        ...item,
        variantName: variant.variantName,
        mrpPrice: variant.mrpPrice || item.price,
        image,
      },
    });
  };

  const renderProductCard = ({ item }) => {
    const variant = item?.variant?.[0];
    let image = null;

    if (variant?.images?.length > 0) {
      image = `${IMAGE_BASE_URL}${variant.images[0]}`;
    } else if (item.image) {
      image = `${IMAGE_BASE_URL}${item.image}`;
    }

    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity onPress={() => handleProductPress(item)}>
          <ProductCard
            id={item.id}
            image={image}
            title={item.productName}
            mrpPrice={variant?.mrpPrice || item.price}
            originalPrice={item.sellingPrice}
            discount={item.discount}
            rating={item.reviewId ? 5.0 : 0}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <StaticHeader />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 120 }} />
      ) : (
        <>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            ListHeaderComponent={
              <>
                <View style={{ marginTop: 120 }}>
                  <PromoBanner />
                  <Text style={styles.sectionTitle}>Featured Products</Text>
                </View>
              </>
            }
            renderItem={renderProductCard}
            columnWrapperStyle={styles.rowStyle}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<RecommendedCarousel />}
          />
          <BottomNav />
        </>
      )}
    </View>
  );
};

export default ProductShowcaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    elevation: 4, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  listContent: {
    paddingTop: 20,   
    paddingBottom: 80,
  },
  rowStyle: {
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  cardWrapper: {
    width: '48%',
  },
  sectionTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    color: '#333',
  },
});
