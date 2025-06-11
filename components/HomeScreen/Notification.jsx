import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const notifications = [
  {
    id: '1',
    title: 'Your order has been shipped!',
    description: 'Order #435621 has been shipped via BlueDart.',
    time: '2 hrs ago',
    type: 'order',
    section: 'Today',
  },
  {
    id: '2',
    title: 'Flat 40% OFF on Top Brands',
    description: 'Limited time deal on electronics. Grab now!',
    time: '5 hrs ago',
    type: 'offer',
    section: 'Today',
  },
  {
    id: '3',
    title: 'Order Delivered',
    description: 'Your order #435562 was delivered successfully.',
    time: 'Yesterday',
    type: 'order',
    section: 'Yesterday',
  },
  {
    id: '4',
    title: 'New Collection Alert',
    description: 'Check out the new arrivals in Fashion.',
    time: '2 days ago',
    type: 'update',
    section: 'Earlier',
  },
];

// Group notifications by section
const groupedNotifications = notifications.reduce((acc, item) => {
  if (!acc[item.section]) acc[item.section] = [];
  acc[item.section].push(item);
  return acc;
}, {});

// Notification card component
const NotificationCard = ({ item }) => {
  const iconType = {
    order: 'cube-outline',
    offer: 'pricetag-outline',
    update: 'notifications-outline',
  };

  return (
    <View style={styles.card}>
      <Ionicons
        name={iconType[item.type]}
        size={26}
        color="#2E71DC"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );
};

// Section title + cards
const NotificationSection = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data.map(item => (
      <NotificationCard key={item.id} item={item} />
    ))}
  </View>
);

// Main screen
export default function Notification() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
        
        <View style={styles.headerRow}>
        <Text style={styles.header}>Notifications</Text>
        <Ionicons name="notifications-outline" size={26} color="#2E71DC" />
        </View>

      <FlatList
        data={Object.keys(groupedNotifications)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <NotificationSection title={item} data={groupedNotifications[item]} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
    marginTop: 18,
    color: '#1E1E1E',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
    color: '#3A3A3A',
  },
  card: {
    backgroundColor: '#fcfccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  time: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 18,
  },
  
});
