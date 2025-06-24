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
import { GET_CATEGORY_BY_ID, GET_PRODUCTS_BY_CATEGORY } from '../../graphql/queries';

const { width } = Dimensions.get('window');
const CATEGORY_ID = '6703ca4da24ddf9a40b16c45'; // ⚠️ Update with actual Kids category ID

const Kids = () => {
  const navigation = useNavigation();

  const {
    data: catData,
    loading: catLoading,
    error: catError,
  } = useQuery(GET_CATEGORY_BY_ID, {
    variables: { getCategoryId: CATEGORY_ID },
    fetchPolicy: 'network-only',
  });

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { catId: CATEGORY_ID },
    fetchPolicy: 'network-only',
  });

  const handlePress = (id) => {
    navigation.navigate('ProductDetail', { 
      id : id,
     });
  };

  if (catLoading || productLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFAF14" />
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

  const bannerImage = catData?.getCategory?.categoryImage;
  const bannerList = bannerImage ? [bannerImage, bannerImage] : [];

  const products = productData?.getProductsByCat?.slice(0, 4) || [];




  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient colors={['#FED68A', '#FFAF14']} style={styles.gradientBackground}>

        {/* Banner Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerWrapper}
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

        

        {/* Four Products in Row */}
        <View style={styles.dealsRow}>
          {products.map((item) => {
            const imageUri = item?.variant?.[0]?.images?.[0] || item.previewImage;
            return (
              <TouchableOpacity key={item.id} style={styles.dealCard} onPress={() => handlePress(item.id)}>
                <Image source={{ uri: imageUri }} style={styles.dealImage} resizeMode="cover" />
                <View style={styles.dealInfo}>
                  <Text style={styles.dealTitle} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.dealDiscount}>
                    {item.discount ? `Flat ${item.discount}% OFF` : 'Top Deal'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

export default Kids;

const styles = StyleSheet.create({
 
  gradientBackground: {
    paddingVertical: 20,
  },
  bannerWrapper: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    marginRight: 16,
    borderRadius: 10,
  },
  dealsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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
