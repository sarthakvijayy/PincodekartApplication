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

const CATEGORY_ID = "67dd645386d19a479a725459";

const Cycles = () => {
  const navigation = useNavigation();

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
    navigation.navigate('ProductDetailScreen', { id });
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
  const bannerList = [banner, banner, banner]; // You can later replace with different images
  const products = productData?.getProductsByCat || [];

  return (
    <View style={styles.dealsSection}>
      <LinearGradient colors={['#8AFEB1', '#06EE55']} style={styles.gradientBackground}>
        
        {/* Swipable Banner Images */}
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

        {/* Products Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardScrollContainer}
          snapToInterval={160 + 16}
          decelerationRate="fast"
        >
          {products.slice(0, 5).map((item) => (
            <TouchableOpacity key={item.id} style={styles.dealCard} onPress={() => handlePress(item.id)}>
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
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default Cycles;

const styles = StyleSheet.create({

  gradientBackground: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  bannerScroll: {
    paddingLeft: 12,
  },
  bannerImage: {
    width: width - 32,
    height: BANNER_HEIGHT,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardScrollContainer: {
    paddingLeft: 12,
    paddingTop: 20,
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



































// '#8AFEB1', '#06EE55'