import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const OrderDetailScreen = () => {
  const orderTimeline = [
    { label: 'Order Received', date: '24 Jan, Wed' },
    { label: 'Order Shipped', date: '26 Jan, Thu' },
    { label: 'On the Way', date: '28 Jan, Sat' },
    { label: 'Order Delivered', date: '30 Jan, Mon (Expected)' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} />
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>
      <Text style={styles.orderNumber}>Order No : # FN7854307733</Text>

      {/* Product Details */}
      <View style={styles.card}>
        <View style={styles.productRow}>
          <Image
            source={require('../assets/Bike/b1.png')} // Replace with actual image
            style={styles.productImage}
          />
          <View style={styles.productDetails}>
            <Text style={styles.productTitle} numberOfLines={2}>
              Cute Kids Backpack With Free Water Bottle and lunch box…..
            </Text>
            <Text style={styles.sellerText}>Selling by : <Text style={styles.seller}>Kidzee Trends</Text></Text>
            <Text style={styles.sizeText}>Free Size</Text>
            <Text style={styles.deliveryText}>Delivered by Mon, Sep 30th ‘24</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>₹360</Text>
              <Text style={styles.mrp}>MRP ₹420</Text>
              <Text style={styles.discount}>(20% OFF)</Text>
            </View>
            <Text style={styles.deliveryCharge}>Delivery ₹49</Text>
          </View>
        </View>

        {/* Estimated Delivery + Replace Order */}
        <View style={styles.deliveryRow}>
          <Text style={styles.estimateText}>
            Estimate Delivery{"\n"}
            <Text style={styles.estimateDate}>30 January 2024, 4:00 PM to 6:00 PM</Text>
          </Text>
          <TouchableOpacity style={styles.replaceBtn}>
            <Text style={styles.replaceText}>Replace Order ▼</Text>
          </TouchableOpacity>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {orderTimeline.map((item, index) => (
            <View key={index} style={styles.timelineRow}>
              <View style={styles.bullet} />
              <View>
                <Text style={styles.timelineLabel}>{item.label}</Text>
                <Text style={styles.timelineDate}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.reviewBtn}>
            <Text style={styles.reviewText}>Review Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  orderNumber: {
    color: '#9ca3af',
    marginVertical: 8,
    fontWeight: '500',
  },
  card: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  productRow: {
    flexDirection: 'row',
    gap: 12,
  },
  productImage: {
    width: 90,
    height: 110,
    resizeMode: 'contain',
  },
  productDetails: {
    flex: 1,
    gap: 4,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  sellerText: {
    fontSize: 12,
    color: '#4b5563',
  },
  seller: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  sizeText: {
    fontSize: 12,
    color: '#4b5563',
  },
  deliveryText: {
    fontSize: 12,
    color: '#4b5563',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mrp: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
    fontSize: 13,
  },
  discount: {
    color: 'green',
    fontSize: 13,
    fontWeight: '500',
  },
  deliveryCharge: {
    fontSize: 13,
    color: '#22c55e',
  },
  deliveryRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimateText: {
    fontSize: 13,
    color: '#4b5563',
  },
  estimateDate: {
    color: '#000',
    fontWeight: '600',
  },
  replaceBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  replaceText: {
    fontSize: 12,
    color: '#374151',
  },
  timeline: {
    marginTop: 20,
    paddingLeft: 10,
    gap: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginTop: 5,
  },
  timelineLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  timelineDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  reviewBtn: {
    backgroundColor: '#2563eb',
    padding: 10,
    flex: 1,
    borderRadius: 4,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#2563eb',
    padding: 10,
    flex: 1,
    borderRadius: 4,
  },
  reviewText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  cancelText: {
    color: '#2563eb',
    textAlign: 'center',
    fontWeight: '600',
  },
});
