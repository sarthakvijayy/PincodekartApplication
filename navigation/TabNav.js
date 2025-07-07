import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@apollo/client';
import { GET_CART } from '../graphql/queries';
import useIsLoggedIn from '../hooks/useIsLoggedIn';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import ProductShowcaseScreen from '../components/Productlist/ProductShowcaseScreen';
import Allcat from '../components/Category/Allcat';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

import footMidIcon from '../assets/Footer/footmid.png';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const TabNavigator = () => {
  const { isLoggedIn: isLoggedInUser, guestCartData } = useIsLoggedIn();
  const { data: cartData } = useQuery(GET_CART);

  const cartItemCount = isLoggedInUser
    ? cartData?.getCart?.cartProducts?.length || 0
    : guestCartData?.length || 0;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          width: width,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          height: 70,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 6,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins_500Medium',
          marginTop: 2,
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#A0AEC0',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Trending"
        component={ProductShowcaseScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'flame' : 'flame-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Categories"
        component={Allcat}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerIconWrapper}>
              <Image
                source={footMidIcon}
                style={styles.centerImage}
                resizeMode="contain"
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={{ position: 'relative' }}>
              <Ionicons
                name={focused ? 'cart' : 'cart-outline'}
                size={24}
                color={color}
              />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartItemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  centerIconWrapper: {
    backgroundColor: '#0C8CE9',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#F58220',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    top: 10,
    position: 'relative',
  },
  centerImage: {
    width: 35,
    height: 35,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TabNavigator;
