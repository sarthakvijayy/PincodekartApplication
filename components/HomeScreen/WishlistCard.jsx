import React, { useEffect, useState, useCallback } from 'react';
import {View,FlatList,StyleSheet,Text,ActivityIndicator,Alert,Dimensions,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import ProductCard from '../../components/Productlist/ProductCard';
import BottomNav from '../HomeScreen/BottomNav';
import { GET_WISHLIST_QUERY, GET_PRODUCT } from '../../graphql/queries';
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../../graphql/mutations';

const WishlistCard = () => {
  const navigation = useNavigation();
  const [wishlistDetails, setWishlistDetails] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  const { data: wishlistData, loading: wishlistLoading, error: wishlistError, refetch } = useQuery(GET_WISHLIST_QUERY);
  const [fetchProductDetails] = useLazyQuery(GET_PRODUCT, { fetchPolicy: 'network-only' });

  const [addToWishlist] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: () => refetch(),
    onError: () => Alert.alert('Error', 'Failed to add to wishlist'),
  });

  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: () => refetch(),
    onError: () => Alert.alert('Error', 'Failed to remove from wishlist'),
  });

  const fetchAllProductDetails = useCallback(async (ids) => {
    try {
      const promises = ids.map(id =>
        fetchProductDetails({ variables: { getProductId: id } }).then(res => res.data?.getProduct)
      );
      const products = await Promise.all(promises);
      setWishlistDetails(products.filter(Boolean));
    } catch (err) {
      console.error('Error fetching product details:', err);
      setWishlistDetails([]);
    }
  }, [fetchProductDetails]);

  useEffect(() => {
    if (wishlistData?.getWishList?.wishlistProducts?.length > 0) {
      const ids = wishlistData.getWishList.wishlistProducts.map(p => p.productId);
      setWishlistIds(ids);
      fetchAllProductDetails(ids);
    } else {
      setWishlistIds([]);
      setWishlistDetails([]);
    }
  }, [wishlistData, fetchAllProductDetails]);

  const toggleWishlist = async (productId, currentlyWishlisted) => {
    try {
      const email = await AsyncStorage.getItem('email');
      if (!email) return Alert.alert('Error', 'User email not found.');
      currentlyWishlisted
        ? await removeFromWishlist({ variables: { email, productId } })
        : await addToWishlist({ variables: { email, productId } });
    } catch (error) {
      console.error('Wishlist mutation error:', error);
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  const renderProductCard = ({ item }) => {
    const imageUrl =
      item.variant?.[0]?.images?.[0] || item.image || item.previewImage || '';
    const isWishlisted = wishlistIds.includes(item.id);

    return (
      <ProductCard
  id={item.id}
  image={imageUrl}
  brand={item.brandId}
  title={item.productName}
  mrpPrice={item.variant?.[0]?.mrpPrice || 0}
  originalPrice={item.variant?.[0]?.sellingPrice || 0}
  discount={item.discount}
  rating={item.rating || 0}
  isWishlisted={isWishlisted}
  onWishlistToggle={() => toggleWishlist(item.id, isWishlisted)}
/>

    );
  };

  if (wishlistLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (wishlistError) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Failed to load wishlist.</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>Tap to retry</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {wishlistDetails.length === 0 ? (
        <Text style={styles.noItemsText}>No liked products found 💔</Text>
      ) : (
        <FlatList
          data={wishlistDetails}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Liked Products ❤️</Text>
          }
          renderItem={renderProductCard}
          columnWrapperStyle={styles.rowStyle}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNav navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    position: 'relative',
  },
  listContent: {
    paddingBottom: 80, // Space for bottom nav
    paddingTop: 10,
  },
  rowStyle: {
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  noItemsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 150,
    fontFamily: 'Poppins-Regular',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderColor: '#ccc',
    paddingBottom: 8,
    paddingTop: 4,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  retryText: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Medium',
  },
});

export default WishlistCard;
