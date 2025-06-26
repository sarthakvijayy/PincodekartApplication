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
const BANNER_HEIGHT = 180;
const CATEGORY_ID = '6745a812cf4c4ee3f70f1ceb';

const Kitchens = () => {
  const navigation = useNavigation();

  const { data: catData, loading: catLoading, error: catError } = useQuery(
    GET_CATEGORY_BY_ID,
    {
      variables: { getCategoryId: CATEGORY_ID },
    }
  );

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { catId: CATEGORY_ID },
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
  const bannerList = [banner, banner, banner]; // Placeholder if only one image
  const products = productData?.getProductsByCat || [];

  return (
    <View style={styles.dealsSection}>
      <LinearGradient
        colors={['#FFBFF9', '#D600C0']}
        style={styles.gradientBackground}
      >
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

        {/* Product Scroll Section */}
        <View style={styles.productSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardScrollContainer}
           
          >
            {products.slice(0, 10).map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === products.slice(0, 10).length - 1;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.dealCard,
                    // {
                    //   marginLeft: isFirst ? 16 : 8,
                    //   marginRight: isLast ? 16 : 0,
                    // },
                  ]}
                  onPress={() => handlePress(item.id)}
                >
                  <Image
                    source={{
                      uri:
                        item?.variant?.[0]?.images?.[0] || item.previewImage || '',
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
              );
            })}
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Kitchens;

const styles = StyleSheet.create({
  dealsSection: {
    backgroundColor: '#D600C0',
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
  productSection: {
    marginTop: 20,
   marginHorizontal: 20,
  },
  cardScrollContainer: {
    paddingBottom: 10,
    gap: 20
  },
  dealCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // backgroundColor: "red",
    // paddingHorizontal: 4
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
