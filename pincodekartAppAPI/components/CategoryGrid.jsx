import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const categories = [
  { id: 1, name: 'Fruits' },
  { id: 2, name: 'Vegetables' },
  { id: 3, name: 'Snacks' },
];

const CategoryGrid = () => {
  return (
    <View style={styles.grid}>
      {categories.map((category) => (
        <TouchableOpacity key={category.id} style={styles.card}>
          <Text style={styles.name}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
});

export default CategoryGrid;
