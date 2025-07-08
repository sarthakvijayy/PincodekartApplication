import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet, Dimensions, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

// Enhanced responsive dimensions with proper breakpoints
const getResponsiveDimensions = (width, height, insets) => {
  const isSmallPhone = width < 375;
  const isMediumPhone = width >= 375 && width < 414;
  const isLargePhone = width >= 414 && width < 768;
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  const isLandscape = width > height;
  
  // Base dimensions for different device types
  let baseDimensions = {
    tabBarHeight: 60,
    iconSize: 22,
    centerIconSize: 50,
    centerImageSize: 30,
    fontSize: 10,
    badgeSize: 14,
    badgeFontSize: 8,
    centerIconTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  };

  // Adjust for phone sizes
  if (isSmallPhone) {
    baseDimensions = {
      ...baseDimensions,
      tabBarHeight: 55,
      iconSize: 20,
      centerIconSize: 45,
      centerImageSize: 25,
      fontSize: 9,
      badgeSize: 12,
      badgeFontSize: 7,
    };
  } else if (isMediumPhone) {
    baseDimensions = {
      ...baseDimensions,
      tabBarHeight: 60,
      iconSize: 22,
      centerIconSize: 50,
      centerImageSize: 28,
      fontSize: 10,
      badgeSize: 14,
      badgeFontSize: 8,
    };
  } else if (isLargePhone) {
    baseDimensions = {
      ...baseDimensions,
      tabBarHeight: 65,
      iconSize: 24,
      centerIconSize: 55,
      centerImageSize: 32,
      fontSize: 11,
      badgeSize: 16,
      badgeFontSize: 9,
    };
  }

  // Adjust for tablets
  if (isTablet) {
    baseDimensions = {
      ...baseDimensions,
      tabBarHeight: isLargeTablet ? 90 : 80,
      iconSize: isLargeTablet ? 32 : 28,
      centerIconSize: isLargeTablet ? 80 : 70,
      centerImageSize: isLargeTablet ? 45 : 40,
      fontSize: isLargeTablet ? 16 : 14,
      badgeSize: isLargeTablet ? 24 : 20,
      badgeFontSize: isLargeTablet ? 14 : 12,
      centerIconTop: isLargeTablet ? 20 : 15,
      paddingVertical: isLargeTablet ? 12 : 8,
      paddingHorizontal: isLargeTablet ? 16 : 12,
    };
  }

  // Adjust for landscape orientation
  if (isLandscape && !isTablet) {
    baseDimensions = {
      ...baseDimensions,
      tabBarHeight: Math.max(baseDimensions.tabBarHeight - 10, 50),
      iconSize: Math.max(baseDimensions.iconSize - 2, 18),
      centerIconSize: Math.max(baseDimensions.centerIconSize - 5, 40),
      centerImageSize: Math.max(baseDimensions.centerImageSize - 3, 22),
      fontSize: Math.max(baseDimensions.fontSize - 1, 8),
      paddingVertical: 2,
    };
  }

  // Platform-specific adjustments
  if (Platform.OS === 'ios') {
    baseDimensions.tabBarHeight += insets.bottom;
    baseDimensions.paddingBottom = insets.bottom > 0 ? insets.bottom : baseDimensions.paddingVertical;
  } else {
    // Android adjustments
    baseDimensions.tabBarHeight += 8;
    baseDimensions.paddingBottom = baseDimensions.paddingVertical;
  }

  return baseDimensions;
};

const TabNavigator = () => {
  const { isLoggedIn: isLoggedInUser, guestCartData } = useIsLoggedIn();
  const { data: cartData } = useQuery(GET_CART);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  const dimensions = getResponsiveDimensions(width, height, insets);

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
          left: 0,
          right: 0,
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
          paddingBottom: dimensions.paddingBottom,
          paddingTop: dimensions.paddingVertical,
          paddingHorizontal: dimensions.paddingHorizontal,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: dimensions.fontSize,
          fontFamily: 'Poppins_500Medium',
          marginTop: 2,
          lineHeight: dimensions.fontSize * 1.2,
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarItemStyle: {
          paddingVertical: 2,
        },
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
                  right: -dimensions.badgeSize / 2,
                  top: -dimensions.badgeSize / 3,
                }]}>
                  <Text style={[styles.badgeText, {
                    fontSize: dimensions.badgeFontSize,
                    lineHeight: dimensions.badgeSize,
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
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TabNavigator;
