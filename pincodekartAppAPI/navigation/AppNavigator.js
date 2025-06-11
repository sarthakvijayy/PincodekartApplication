import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../components/Header.jsx'; // Assuming Header is the top navigation bar
import HomeScreen from '../screens/HomeScreen.jsx';
import CategoryScreen from '../screens/CategoryScreen.jsx';
import ProductDetailsScreen from '../screens/ProductDetailsScreen.jsx';
import CartScreen from '../screens/CartScreen.jsx';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* Header will be rendered above the stack navigator */}
  

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Header' component={Header} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </View>
  );
};

export default AppNavigator;
