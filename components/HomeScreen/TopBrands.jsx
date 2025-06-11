import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const brandData = [
  {
    id: '1',
    name: 'Nestle',
    image: require('../../assets/images/banner1.jpg'), // Replace with correct brand image later
  },
  {
    id: '2',
    name: 'Amul',
    image: require('../../assets/images/banner1.jpg'),
  },
  {
    id: '3',
    name: 'Haldiram',
    image: require('../../assets/images/banner1.jpg'),
  },
  {
    id: '4',
    name: 'Dabur',
    image: require('../../assets/images/banner1.jpg'),
  },
];

const TopBrands = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Brands</Text>
      <FlatList
        data={brandData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginRight: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    width: 100,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    textAlign: 'center',
  },
});

export default TopBrands;
