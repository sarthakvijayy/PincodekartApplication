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
import {
  GET_PRODUCTS_BY_CATEGORY,
  GET_CATEGORY_BY_ID,
} from '../../graphql/queries';

const { width } = Dimensions.get('window');
const CATEGORY_ID = '6745a8abcf4c4ee3f70f1cef';

const Sports = () => {
  const navigation = useNavigation();

  const { data: catData, loading: catLoading } = useQuery(GET_CATEGORY_BY_ID, {
    variables: { getCategoryId: CATEGORY_ID },
  });

  const { data: productData, loading: productLoading } = useQuery(
    GET_PRODUCTS_BY_CATEGORY,
    {
      variables: { catId: CATEGORY_ID },
    }
  );

  const handlePress = (id) => {
navigation.navigate('ProductDetail', { id : id });  };

  if (catLoading || productLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFB320" />
      </View>
    );
  }

  const banner = catData?.getCategory?.categoryImage;
  const products = productData?.getProductsByCat || [];

  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient colors={['#F3DCAF', '#FFB320']} style={styles.gradientBackground}>

        {/* Swipable Banner Images */}
        {banner && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScroll}
          >
            {[1, 2, 3].map((_, index) => (
              <Image
                key={index}
                source={{ uri: banner }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Deal Cards */}
        <View style={styles.dealsContainer}>
          {products.slice(0, 4).map((item) => (
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
                  {item.discount ? `Min ${item.discount}% OFF` : 'Hot Deal'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

export default Sports;

const styles = StyleSheet.create({
  sectionWrapper: {
    overflow: 'hidden',
    marginBottom: 0,
  },
  gradientBackground: {
    paddingVertical: 20,
  },
  bannerScroll: {
    marginBottom: 20,
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  dealsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dealCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dealImage: {
    width: '100%',
    height: 100,
  },
  dealInfo: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  dealDiscount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  loader: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});






// '#F3DCAF', '#FFB320'