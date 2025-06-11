import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/HomeScreen/BottomNav';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState();
  const [addressExpanded, setAddressExpanded] = useState(false);
  const [languageExpanded, setLanguageExpanded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['Hindi', 'English', 'Marathi', 'Gujarati'];
  const recentlyViewed = [
    { id: 1, title: 'Shirts', image: require('../assets/deals/Shirt.png'), rating: 4 },
    { id: 2, title: 'Mobiles', image: require('../assets/deals/Shirt.png'), rating: 5 },
    { id: 3, title: 'Home', image: require('../assets/deals/Shirt.png'), rating: 3 },
    { id: 4, title: 'Shoes', image: require('../assets/deals/Shirt.png'), rating: 4.5 },
  ];

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    return (
      <View style={{ flexDirection: 'row' }}>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesome key={i} name="star" size={14} color="#facc15" />
        ))}
        {halfStar && <FontAwesome name="star-half" size={14} color="#facc15" />}
      </View>
    );
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(true);
      setUserName('Sarthak');
    };
    checkLoginStatus();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.userSection}
            onPress={() => navigation.navigate(isLoggedIn ? 'EditProfile' : 'LoginScreen')}
          >
            <Ionicons name="person-circle" size={36} color="#ccc" />
            {isLoggedIn ? (
              <Text style={styles.userName}>{userName}</Text>
            ) : (
              <Text style={styles.userName}>Hello Guest</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>Hello {isLoggedIn ? userName : 'Guest'}</Text>

        {/* Quick Actions */}
        {isLoggedIn && (
          <View style={styles.quickActions}>
            {['Your Orders', 'Wishlist', 'Offers', 'Help Center'].map((item, index) => {
              const handleNavigation = () => {
                switch (item) {
                  case 'Your Orders':
                    navigation.navigate('OrderList');
                    break;
                  case 'Wishlist':
                    navigation.navigate('WishlistCard');
                    break;
                  case 'Offers':
                    navigation.navigate('Offers');
                    break;
                  case 'Help Center':
                    navigation.navigate('HelpCenter');
                    break;
                  default:
                    break;
                }
              };

              return (
                <TouchableOpacity key={index} style={styles.actionCard} onPress={handleNavigation}>
                  <Text style={styles.cardText}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Recently Viewed */}
        {isLoggedIn && (
          <>
            <Text style={styles.sectionTitle}>Recently Viewed Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
              {recentlyViewed.map((item) => (
                <View key={item.id} style={styles.productCard}>
                  <Image source={item.image} style={styles.productImage} />
                  <Text style={styles.productTitle}>{item.title}</Text>
                  {renderRating(item.rating)}
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* Account Settings */}
        {isLoggedIn && (
          <>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.settingText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} />
            </TouchableOpacity>
          </>
        )}

        {/* Saved Address */}
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setAddressExpanded(!addressExpanded)}
          >
            <Text style={styles.settingText}>Saved Address</Text>
            <Ionicons name={addressExpanded ? 'chevron-up' : 'chevron-down'} size={20} />
          </TouchableOpacity>
        )}
        {addressExpanded && isLoggedIn && (
          <View style={styles.expandContent}>
            <Text style={styles.address}>123, Sector 8, Udaipur Rajasthan</Text>
            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => navigation.navigate('SelectAddress')}
            >
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Language Selector */}
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setLanguageExpanded(!languageExpanded)}
          >
            <Text style={styles.settingText}>Select Language</Text>
            <Ionicons name={languageExpanded ? 'chevron-up' : 'chevron-down'} size={20} />
          </TouchableOpacity>
        )}
        {languageExpanded && isLoggedIn && (
          <View style={styles.expandContent}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={styles.radioRow}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Ionicons
                  name={selectedLanguage === lang ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color="#2A55E5"
                />
                <Text style={styles.languageText}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Information */}
        {isLoggedIn && (
          <>
            <Text style={styles.sectionTitle}>Information</Text>
            <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Terms')}>
              <Text style={styles.settingText}>Terms, Policies & Licenses</Text>
              <Ionicons name="chevron-forward" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('FAQs')}>
              <Text style={styles.settingText}>Ask FAQs</Text>
              <Ionicons name="chevron-forward" size={20} />
            </TouchableOpacity>
          </>
        )}

        {/* Log Out */}
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              setIsLoggedIn(false);
              setUserName('');
            }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        )}

        {/* Login / Sign Up if not logged in */}
        {!isLoggedIn && (
          <View style={styles.authSection}>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate('SignUpScreen')}
            >
              <Text style={styles.authButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNav />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginTop: 16,
  },
  userName: {
    marginLeft: 6,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  heading: { fontSize: 22, fontFamily: 'Poppins_700Medium', marginBottom: 15, marginTop: 15 },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: width / 2 - 24,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: { fontFamily: 'Poppins_500Medium', fontSize: 14 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 20,
    marginBottom: 10,
  },
  carousel: { marginBottom: 10 },
  productCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  productImage: { width: 80, height: 80, borderRadius: 6, marginBottom: 6 },
  productTitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#cbd5e1',
  },
  settingText: { fontFamily: 'Poppins_600Medium', fontSize: 16 },
  expandContent: { paddingLeft: 10, marginVertical: 6 },
  address: { fontSize: 14, fontFamily: 'Poppins_400Regular', marginBottom: 6 },
  addAddressBtn: {
    borderWidth: 1,
    borderColor: '#2A55E5',
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addAddressText: { color: '#2A55E5', fontFamily: 'Poppins_500Medium' },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageText: {
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#2A55E5',
  },
  logoutText: {
    color: '#2A55E5',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },
  authSection: {
    marginTop: 20,
  },
  authButton: {
    backgroundColor: '#F58220',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderColor: '#ccc',
    paddingBottom: 8,
    paddingTop: 4,
    height: 60,
  },
});

export default ProfileScreen;
