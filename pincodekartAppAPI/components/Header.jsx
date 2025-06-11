import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';


const Header = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Roboto_400Regular,
  });

  const [showTopBar, setShowTopBar] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollY = new Animated.Value(0);

  // Hide top bar on scroll
  useEffect(() => {
    scrollY.addListener(({ value }) => {
      setShowTopBar(value <= 30);
    });
    return () => scrollY.removeAllListeners();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      {/* 🔝 Sticky Header */}
      <View style={styles.fixedHeader}>
        {showTopBar && (
          <View style={styles.topBar}>
            <View style={styles.topButtonWrapper}>
              <TouchableOpacity style={styles.topButton}>
                <Text style={styles.topButtonText}>Become a Mfg/Whs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.topButton, { backgroundColor: '#6f42c1' }]}>
                <Text style={styles.topButtonText}>Start Online Shop</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.container}>
          {/* ☰ Menu Toggle */}
          <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
            <Feather name="menu" size={26} color="#000" />
          </TouchableOpacity>

          {/* Logo */}
          <Image source={require('../assets/logo/logo.png')} style={styles.logo} resizeMode="contain" />

          {/* 👤 User & Cart */}
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.userDropdown} onPress={toggleDropdown}>
              <Feather name="user" size={24} color="#000" />
              <Feather name="chevron-down" size={18} color="#000" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {/* ⬇️ Dropdown Options */}
            {isDropdownOpen && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.dropdownItem}>
                  <Text style={styles.dropdownText}>LogIn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem}>
                  <Text style={styles.dropdownText}>SignUp</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 🛒 Cart */}
            <TouchableOpacity style={styles.cartIcon}>
              <Ionicons name="cart-outline" size={24} color="#000" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartCount}>0</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 📋 Side Menu */}
      {isMenuOpen && (
        <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
        <View style={styles.sideMenu}>
          <Image source={require('../assets/logo/logo.png')} style={styles.logo1} />
          <Text style={styles.menuItem}> <Feather name="user" size={20} color="#000" /> Login & Sign Up</Text>
          <Text style={styles.menuItem}> <Feather name="grid" size={20} color="#000" /> All Categories</Text>
          <Text style={styles.menuItem}><Feather name="shopping-bag" size={20} color="#000" /> My Orders</Text>
          <Text style={styles.menuItem}><Feather name="shopping-cart" size={20} color="#000" /> My Cart</Text>
          <Text style={styles.menuItem}><Feather name="heart" size={20} color="#000" /> Wishlist</Text>
          <Text style={styles.menuItem}><Feather name="user-check" size={20} color="#000" /> My Account</Text>
          <Text style={styles.menuItem}><Feather name="bell" size={20} color="#000" /> Notifications</Text>
          <View style={styles.hr} />
          <Text style={styles.menuItem}><Feather name="mail" size={20} color="#000" /> Become a Mfg/Whs</Text>
          <Text style={styles.menuItem}><Feather name="globe" size={20} color="#000" /> Choose Language</Text>
          <Text style={styles.menuItem}><Feather name="settings" size={20} color="#000" /> Setting</Text>
          <View style={styles.hr} />
          <Text style={styles.menuItem}><Feather name="life-buoy" size={20} color="#000" /> Help Center</Text>
          <Text style={styles.menuItem}><Feather name="file-text" size={20} color="#000" /> Terms & Conditions</Text>
          <Text style={styles.menuItem}><Feather name="log-out" size={20} color="#000" /> Log Out</Text>
        </View>
        </TouchableWithoutFeedback>
      )}

      {/* 🔃 Scrollable Content */}
      <Animated.ScrollView
        scrollEventThrottle={16}
        decelerationRate={Platform.OS === 'ios' ? 'normal' : 0.95}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingTop: showTopBar ? 100 : 60 }}
      >
        {/* Dummy Content */}
        <View style={{ height: 1200, backgroundColor: '#f9f9f9' }} />
      </Animated.ScrollView>
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  fixedHeader: {
    position: 'absolute',
    top: 20,
    width: '100%',
    zIndex: 99,
    backgroundColor: '#fff',
  },
  topBar: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  topButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  topButton: {
    backgroundColor: 'orange',
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 10,
  },
  topButtonText: {
    color: '#fff',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  toggleButton: {
    padding: 4,
  },
  logo: {
    width: 160,
    height: 70,
    marginRight: 100,
  },
  logo1: {
    width: '100%',
    height: 70,
    backgroundColor: '#00000026',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  cartIcon: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -8,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCount: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    width: 150,
    zIndex: 99,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  sideMenu: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: 250,
    backgroundColor: '#fff',
    zIndex: 100,
    padding: 20,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuItem: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    paddingVertical: 10,
    color: '#333',
  },
  hr: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,       
    marginVertical: 10,           }
  
});

export default Header;
