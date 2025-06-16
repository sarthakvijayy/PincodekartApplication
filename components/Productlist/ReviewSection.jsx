import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@apollo/client';
import { GET_ALL_REVIEWS } from '../../graphql/queries';

const ReviewSection = () => {
  const [showAll, setShowAll] = useState(false);
  

  const { loading, error, data } = useQuery(GET_ALL_REVIEWS, {
  
    
  });

  const reviews = data?.getAllReviews || [];

  const photoUrls = reviews
    .map((r) =>
      typeof r.image === 'string' && r.image.trim().length > 0 ? r.image.trim() : null
    )
    .filter(Boolean);

  const renderStars = (count) =>
    [...Array(5)].map((_, i) => (
      <AntDesign
        key={i}
        name={i < count ? 'star' : 'staro'}
        size={16}
        color={i < count ? '#FFA500' : '#ccc'}
        style={{ marginRight: 2 }}
      />
    ));

  const renderReview = (review) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        {renderStars(review.rating)}
        <Text style={styles.reviewRating}> {review.rating.toFixed(1)}</Text>
      </View>

      <Text style={styles.reviewText}>{review.review}</Text>
      <Text style={styles.reviewMeta}>Posted on: {new Date(review.createdAt).toDateString()}</Text>

      <View style={styles.reviewFooter}>
        <Text style={styles.reviewAuthor}>User ID: {review.userId}</Text>
      </View>

      <View style={styles.likesRow}>
        <FontAwesome name="thumbs-up" size={16} color="#888" />
        <Text style={styles.likeText}> 0</Text>
        <FontAwesome name="thumbs-down" size={16} color="#888" style={{ marginLeft: 16 }} />
        <Text style={styles.likeText}> 0</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ marginVertical: 24 }}>
        <ActivityIndicator size="large" color="#1565c0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ marginVertical: 24 }}>
        <Text style={{ color: 'red', fontFamily: 'Poppins-Regular' }}>
          Failed to load reviews: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Review & Ratings</Text>
        <TouchableOpacity style={styles.rateBtn}>
          <Text style={styles.rateBtnText}>Rate Product</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.starsRow}>
        {renderStars(5)}
        <Text style={styles.ratingSummaryText}>  {reviews.length} reviews</Text>
      </View>

      {photoUrls.length > 0 && (
        <>
          <Text style={styles.photosTitle}>Customer Photos</Text>
          <FlatList
            horizontal
            data={photoUrls}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) =>
              item ? (
                <Image
                  source={{ uri: item }}
                  style={styles.photo}
                  resizeMode="cover"
                  onError={(e) => console.warn('Image load error:', e.nativeEvent.error)}
                />
              ) : null
            }
          />
        </>
      )}

      {/* Reviews List */}
      {(showAll ? reviews : reviews.slice(0, 2)).map(renderReview)}

      <View style={styles.hrLine} />

      <TouchableOpacity onPress={() => setShowAll(!showAll)}>
        <Text style={styles.expandText}>
          {showAll ? 'Hide Reviews' : `See All Reviews`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  rateBtn: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rateBtnText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingSummaryText: {
    fontSize: 13,
    color: '#1565c0',
    fontFamily: 'Poppins-Regular',
  },
  photosTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginTop: 12,
    marginBottom: 4,
  },
  photo: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  reviewCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewRating: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: 'Poppins-Medium',
  },
  reviewText: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    marginBottom: 6,
  },
  reviewMeta: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  reviewAuthor: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  likeText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
  hrLine: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  expandText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#1565c0',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default ReviewSection;
