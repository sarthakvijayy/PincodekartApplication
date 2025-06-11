// screens/CategoryScreen.jsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const CategoryScreen = ({ route }) => {
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category.name}</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CategoryScreen;
