import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ReviewPage = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerTitle}>All Shop</Text>
      </View>

      {/* Rating Summary */}
      <View style={styles.summaryBox}>
        {/* Left: Overall Rating */}
        <View style={styles.leftBox}>
          <Text style={styles.ratingText}>4.0</Text>
          <Text style={styles.totalRating}>1127 Rating & 264 Reviews</Text>

          {/* Bars */}
          {renderBar('Excellent', 587, '#4ade80')}
          {renderBar('Very Good', 357, '#60a5fa')}
          {renderBar('Good', 123, '#facc15')}
          {renderBar('Average', 24, '#fb923c')}
          {renderBar('Poor', 7, '#ef4444')}
        </View>

        {/* Right: After Service Rating */}
        <View style={styles.rightBox}>
          <Text style={styles.serviceTitle}>After Service Rating</Text>
          {renderStarsRow('Delivery Partner', 4)}
          {renderStarsRow('Very Good', 3.5)}
          {renderStarsRow('Good', 5)}
          {renderStarsRow('Average', 3)}
          {renderStarsRow('Poor', 5)}
        </View>
      </View>

      {/* Review Summary */}
      <View style={styles.reviewSummary}>
        <View style={styles.starsRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesome key={i} name="star" size={18} color="#facc15" />
          ))}
        </View>
        <Text style={styles.reviewText}>3,756 ratings & 264 reviews</Text>
        <TouchableOpacity style={styles.rateBtn}>
          <Text style={styles.rateBtnText}>Rate Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ⭐️ Render Rating Bar
const renderBar = (label, count, color) => {
  const widthPercent = Math.min(count / 600 * 100, 100); // capped at 100%
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${widthPercent}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barCount}>{count}</Text>
    </View>
  );
};

// ⭐️ Render Star Row
const renderStarsRow = (label, value) => {
  const fullStars = Math.floor(value);
  const halfStar = value % 1 >= 0.5;

  return (
    <View style={styles.starsRowContainer}>
      <Text style={styles.starLabel}>{label}</Text>
      <View style={styles.starIcons}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <FontAwesome key={i} name="star" size={14} color="#facc15" />
        ))}
        {halfStar && <FontAwesome name="star-half-full" size={14} color="#facc15" />}
      </View>
      <Text style={styles.starValue}>{value.toFixed(1)}</Text>
    </View>
  );
};

export default ReviewPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  leftBox: {
    flex: 1,
  },
  ratingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  totalRating: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  barLabel: {
    width: 60,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  barCount: {
    width: 30,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Poppins_400Regular',
  },
  rightBox: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 6,
  },
  starsRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starLabel: {
    width: 90,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  starIcons: {
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  starValue: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 4,
  },
  reviewSummary: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 13,
    color: '#4b5563',
    fontFamily: 'Poppins_400Regular',
  },
  rateBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  rateBtnText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
});
