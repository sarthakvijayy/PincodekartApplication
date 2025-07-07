import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  LayoutAnimation,
  Alert,
  UIManager,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GET_ALL_PRODUCTS, GET_CURRENT_USER } from '../graphql/queries';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [randomViewed, setRandomViewed] = useState([]);
  const [language, setLanguage] = useState('English');
const [languageExpanded, setLanguageExpanded] = useState(false);

  
  const { data: currentUser } = useQuery(GET_CURRENT_USER);

  const { data: allProductsData, loading: productsLoading } = useQuery(GET_ALL_PRODUCTS, {
    variables: { take: 20, page: 0 },
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      const email = await AsyncStorage.getItem('email');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsLoggedIn(!!email);
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (allProductsData?.getAllProducts?.products?.length) {
      const shuffled = [...allProductsData.getAllProducts.products].sort(() => 0.5 - Math.random());
      setRandomViewed(shuffled.slice(0, 6));
    }
  }, [allProductsData]);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setIsLoggedIn(false);
        },
      },
    ]);
  };

  if (loading || productsLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0C8CE9" />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* =============== Logged OUT UI =============== */}
        {!isLoggedIn ? (
          <View style={styles.sectionCard}>
            <Text style={styles.accountTitle}>Account</Text>
            <Text style={styles.accountSub}>Log in to get exclusive offers</Text>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.loginText}>Log In / Sign Up</Text>
            </TouchableOpacity>

            {randomViewed.length > 0 && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Recently Viewed Stores</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {randomViewed.map((item) => (
                    <View key={item.id} style={styles.productCard}>
                      <Image source={{ uri: item.previewImage }} style={styles.productImage} />
                      <Text style={styles.productTitle} numberOfLines={1}>
                        {item.productName}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Account Settings */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              {[
                
                { icon: 'language-outline', label: 'Select Language' },
                { icon: 'notifications-outline', label: 'Notification Settings' },
              
              ].map(({ icon, label }, i) => (
                <TouchableOpacity key={i} style={styles.settingRow}>
                  <View style={styles.iconLabel}>
                    <Ionicons name={icon} size={20} color="#0C8CE9" />
                    <Text style={styles.settingText}>{label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                </TouchableOpacity>
              ))}
            </View>

            {/* My Activity */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>My Activity</Text>
              {[
                { icon: 'chatbox-outline', label: 'Reviews' },
                { icon: 'help-circle-outline', label: 'Questions & Answers' },
              ].map(({ icon, label }, i) => (
                <TouchableOpacity key={i} style={styles.settingRow}>
                  <View style={styles.iconLabel}>
                    <Ionicons name={icon} size={20} color="#0C8CE9" />
                    <Text style={styles.settingText}>{label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Feedback & Information</Text>
              {[
                { icon: 'document-text-outline', label: 'Terms, Policies and Licenses' },
                { icon: 'help-buoy-outline', label: 'Browse FAQs' },
              ].map(({ icon, label }, i) => (
                <TouchableOpacity key={i} style={styles.settingRow}>
                  <View style={styles.iconLabel}>
                    <Ionicons name={icon} size={20} color="#0C8CE9" />
                    <Text style={styles.settingText}>{label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.userName}>Hello {currentUser?.getCurrentUser?.firstName || 'User'}</Text>

            <View style={[styles.sectionCard, { backgroundColor: '#f5f7ff' }]}>
              
              
              <View style={styles.quickRow}>
                {[
                  { icon: 'cube', label: 'Orders' },
                  { icon: 'heart', label: 'Wishlist' },
                  { icon: 'money', label: 'Coupons' },
                  { icon: 'headphones', label: 'Help Center' },
                ].map(({ icon, label }, idx) => (
                  <TouchableOpacity key={idx} style={styles.quickItem}>
                    <FontAwesome name={icon} size={24} color="#0C8CE9" />
                    <Text style={styles.quickLabel}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recently Viewed */}
            {randomViewed.length > 0 && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Recently Viewed Stores</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {randomViewed.map((item) => (
                    <View key={item.id} style={styles.productCard}>
                      <Image source={{ uri: item.previewImage }} style={styles.productImage} />
                      <Text style={styles.productTitle} numberOfLines={1}>
                        {item.productName}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Account Settings */}
          <View style={styles.sectionCard}>
  <Text style={styles.sectionTitle}>Account Settings</Text>
  {[
    { icon: 'person-circle-outline', label: 'Edit Profile', route: 'EditProfile' },
    { icon: 'location-outline', label: 'Saved Addresses', route: 'SavedAddress' },
    { icon: 'language-outline', label: 'Select Language' },
    { icon: 'headset-outline', label: 'Help Center' },
  ].map(({ icon, label, route }, i) => (
    <TouchableOpacity
      key={i}
      style={styles.settingRow}
      onPress={() => route && navigation.navigate(route)}
    >
      <View style={styles.iconLabel}>
        <Ionicons name={icon} size={20} color="#0C8CE9" />
        <Text style={styles.settingText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#6B7280" />
    </TouchableOpacity>
  ))}
</View>

            {/* Feedback */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Feedback & Information</Text>
              {[
                { icon: 'document-text-outline', label: 'Terms, Policies and Licenses' },
                { icon: 'help-buoy-outline', label: 'Browse FAQs' },
              ].map(({ icon, label }, i) => (
                <TouchableOpacity key={i} style={styles.settingRow}>
                  <View style={styles.iconLabel}>
                    <Ionicons name={icon} size={20} color="#0C8CE9" />
                    <Text style={styles.settingText}>{label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Log Out Button */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, fontFamily: 'Poppins_500Medium' },

  logoContainer: { alignItems: 'left', marginTop: 20 },
  logo: { width: 180, height: 60 },

  sectionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#F3F4F6',
  },
  accountTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  accountSub: {
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
  },
  loginBtn: {
    backgroundColor: '#0C8CE9',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  loginText: {
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  userName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginBottom: 6,
    color: '#111827',
    marginHorizontal: 10,
  },
  userStatus: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#555',
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // marginVertical: 10,
    marginTop: 20,
  },
  quickItem: {
    alignItems: 'center',
    width: (width - 40)/2,
     marginBottom: 20,
  },
  quickLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
    color: '#0C8CE9',
   
  },
  productCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#f9fafb',
  },
  productTitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#111827',
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginBottom: 10,
    color: '#111827',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  iconLabel: { flexDirection: 'row', alignItems: 'center' },
  settingText: {
    marginLeft: 10,
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#111827',
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
  },
  logoutText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#0C8CE9',
    textAlign: 'center',
  },

});

export default ProfileScreen;
