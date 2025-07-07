import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ProductCard from '../../components/Productlist/ProductCard';
import PromoBanner from '../../components/Productlist/PromoBanner';
import RecommendedCarousel from '../../components/Productlist/RecommendedCoursol';
import BottomNav from '../HomeScreen/BottomNav';
import { useNavigation } from '@react-navigation/native';
import { request, gql } from 'graphql-request';
import StaticHeader from '../HomeScreen/StaticHeader';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from '../../components/Productlist/FilterModal';
import CategoryModal from '../../components/Productlist/CategoryModal';

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

const CATEGORIES = ['Shirts', 'T-shirts', 'Jeans', 'Kurtas', 'Sweatshirts', 'Jackets'];
const FILTERS = ['Sort By', 'Filter', 'Size', 'Brand', 'Color', 'Price'];

const ProductShowcaseScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('T-shirts');

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const variables = { page: 0, take: 100 };
      const data = await request(GRAPHQL_ENDPOINT, PRODUCTS_QUERY, variables);
      setProducts(data?.getAllProducts?.products || []);
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
      {/* Sticky Static Header */}
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
                <View style={{ marginTop: 100 }}>
                  {/* Category Tabs */}
                  <FlatList
                    data={CATEGORIES}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabBar}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.categoryTab,
                          selectedCategory === item && styles.activeTab,
                        ]}
                        onPress={() => {
                          setSelectedCategory(item);
                          setShowCategoryModal(true);
                        }}
                      >
                        <Text
                          style={[
                            styles.tabText,
                            selectedCategory === item && styles.activeTabText,
                          ]}
                        >
                          {item}
                        </Text>
                        <Ionicons
                          name="chevron-down"
                          size={12}
                          color={selectedCategory === item ? '#fff' : '#555'}
                          style={{ marginLeft: 4 }}
                        />
                      </TouchableOpacity>
                    )}
                  />

                  {/* Filter Tabs */}
                  <FlatList
                    data={FILTERS}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterBar}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.filterItem}
                        onPress={() => setShowFilterModal(true)}
                      >
                        <Text style={styles.filterLabel}>{item}</Text>
                        <Ionicons name="chevron-down" size={14} color="#555" />
                      </TouchableOpacity>
                    )}
                  />

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

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={(filters) => {
          setShowFilterModal(false);
          if (filters) {
            console.log('Applied Filters:', filters);
          }
        }}
      />

      {/* Category Modal */}
      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />
    </View>
  );
};

export default ProductShowcaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  listContent: {
    paddingTop: 10,
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  activeTab: {
    backgroundColor: '#5C84EE',
  },
  tabText: {
    color: '#333',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: 10,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginRight: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginRight: 6,
    color: '#333',
  },
});
