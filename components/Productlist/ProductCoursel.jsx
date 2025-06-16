import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';
import { request, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'https://pincodekart.com/api/graphql';

const RECOMMENDED_PRODUCTS_QUERY = gql`
  query RecommendedProducts($page: Int, $take: Int) {
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

const RecommendedCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommended = async () => {
    try {
      const variables = { page: 1, take: 10 };
      const data = await request(GRAPHQL_ENDPOINT, RECOMMENDED_PRODUCTS_QUERY, variables);
      const recommended = data?.getAllProducts?.products || [];
      setProducts(recommended);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommended();
  }, []);

  const resolveImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `https://pincodekart.com${path}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Might you like</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const variant = item?.variant?.[0] || {};
          const image = resolveImageUrl(variant.images?.[0] || item.image);

          return (
            <View style={styles.cardWrapper}>
              <ProductCard
                id={item.id}
                image={image}
                title={item.productName}
                price={variant.mrpPrice || item.price}
                originalPrice={item.sellingPrice}
                discount={item.discount}
                rating={item.reviewId ? 4.5 : 5}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default RecommendedCarousel;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#DFFFE1',
    marginVertical: 10,
    paddingLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
    color: '#2E7D32',
  },
  cardWrapper: {
    width: 200,
    marginRight: 12,
  },
});
