// screens/ProductListScreen.jsx
import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import ProductCard from '../../components/Productlist/ProductCard';

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products {
      id
      title
      image
      price
      originalPrice
      discount
      rating
    }
  }
`;

const ProductListScreen = () => {
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0C8CE9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error loading products.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
          id={item.id}
            image={item.image}
            title={item.title}
            price={item.price}
            originalPrice={item.originalPrice}
            discount={item.discount}
            rating={item.rating}
          />
        )}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 12,
  },
  list: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    color: '#e53935',
    fontSize: 16,
  },
});

export default ProductListScreen;
