import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const topSellingData = [
  {
    id: '1',
    name: 'Fresh Mangoes',
    image: require('../../assets/images/mango.png'),
    price: '₹120/kg',
  },
  {
    id: '2',
    name: 'Organic Apples',
    image: require('../../assets/images/banner1.jpg'),
    price: '₹150/kg',
  },
  {
    id: '3',
    name: 'Bananas',
    image: require('../../assets/images/mango.png'),
    price: '₹40/dozen',
  },
];

const TopSelling = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Selling</Text>
      <FlatList
        data={topSellingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 12,
    padding: 10,
    width: 140,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#28a745', // Green for price
    marginTop: 4,
  },
});

export default TopSelling;
