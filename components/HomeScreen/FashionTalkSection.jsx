import React from 'react';
import {View,Text,Image,ScrollView,StyleSheet,Dimensions,TouchableOpacity,ActivityIndicator,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_CATEGORY, GET_CATEGORY_BY_ID } from '../../graphql/queries';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = (width - 32) * 0.45;
const CARD_WIDTH = 160;
const CATEGORY_ID = '6703c958a24ddf9a40b16c3e';

const FashionTalkSection = () => {
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
    navigation.navigate('ProductDetail', { id });
  };

  if (catLoading || productLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFB320" />
      </View>
    );
  }

  const banner = catData?.getCategory?.categoryImage;
  const bannerList = [banner, banner, banner];
  const products = productData?.getProductsByCat || [];

  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient
        colors={['#fffbe5', '#ffeabf', '#ffe1a8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Section Title */}
        <View style={styles.titleRow}>
          <Ionicons name="sparkles-outline" size={20} color="#E76F51" />
          <Text style={styles.sectionTitle}>Fashion Picks For You</Text>
        </View>

        {/* Banner Scroll */}
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

        {/* Product Horizontal Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsRow}
        >
          {products.slice(0, 6).map((item) => (
            <TouchableOpacity key={item.id} style={styles.dealCard} onPress={() => handlePress(item.id)}>
              <Image
                source={{ uri: item?.variant?.[0]?.images?.[0] || item.previewImage }}
                style={styles.dealImage}
              />
              <View style={styles.dealInfo}>
                <Text style={styles.dealTitle} numberOfLines={2}>
                  {item.productName}
                </Text>
                <Text style={styles.dealPrice}>₹{item.price || '999'}</Text>
                {item.discount && (
                  <Text style={styles.dealDiscount}>Save {item.discount}%</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default FashionTalkSection;

const styles = StyleSheet.create({
  sectionWrapper: {
    marginBottom: 24,
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  gradientBackground: {
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#2b2b2b',
  },
  bannerScroll: {
    paddingLeft: 4,
    marginBottom: 18,
  },
  bannerImage: {
    width: width - 64,
    height: BANNER_HEIGHT,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#ccc',
  },
  dealsRow: {
    paddingLeft: 4,
    gap: 12,
  },
  dealCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  dealImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f2f2f2',
  },
  dealInfo: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  dealTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#333',
    textAlign: 'center',
  },
  dealPrice: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#E76F51',
    marginTop: 4,
  },
  dealDiscount: {
    fontSize: 11,
    color: '#2A9D8F',
    fontFamily: 'Poppins_500Medium',
    marginTop: 2,
  },
  loader: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
