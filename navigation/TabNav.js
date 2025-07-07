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
const { width, height } = Dimensions.get('window');

// Responsive dimensions
const getResponsiveDimensions = () => {
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;
  const isTablet = width >= 768;

  return {
    tabBarHeight: isTablet ? 80 : 70,
    iconSize: isTablet ? 28 : 24,
    centerIconSize: isTablet ? 70 : 60,
    centerImageSize: isTablet ? 40 : 35,
    fontSize: isTablet ? 14 : 12,
    badgeSize: isTablet ? 20 : 16,
    badgeFontSize: isTablet ? 12 : 10,
    centerIconTop: isTablet ? 15 : 10,
  };
};

const TabNavigator = () => {
  const { isLoggedIn: isLoggedInUser, guestCartData } = useIsLoggedIn();
  const { data: cartData } = useQuery(GET_CART);
  const dimensions = getResponsiveDimensions();

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
          height: dimensions.tabBarHeight,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 6,
          paddingBottom: width >= 768 ? 8 : 4,
          paddingTop: width >= 768 ? 8 : 4,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: dimensions.fontSize,
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
              size={dimensions.iconSize}
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
              size={dimensions.iconSize}
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
            <View style={[styles.centerIconWrapper, {
              width: dimensions.centerIconSize,
              height: dimensions.centerIconSize,
              borderRadius: dimensions.centerIconSize / 2,
              top: dimensions.centerIconTop,
            }]}>
              <Image
                source={footMidIcon}
                style={[styles.centerImage, {
                  width: dimensions.centerImageSize,
                  height: dimensions.centerImageSize,
                }]}
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
                size={dimensions.iconSize}
                color={color}
              />
              {cartItemCount > 0 && (
                <View style={[styles.badge, {
                  minWidth: dimensions.badgeSize,
                  height: dimensions.badgeSize,
                  borderRadius: dimensions.badgeSize / 2,
                }]}>
                  <Text style={[styles.badgeText, {
                    fontSize: dimensions.badgeFontSize,
                  }]}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
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
              size={dimensions.iconSize}
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
    borderWidth: 3,
    borderColor: '#F58220',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    position: 'relative',
  },
  centerImage: {
    // Size will be set dynamically
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TabNavigator;
