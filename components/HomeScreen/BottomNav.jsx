import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import footMidIcon from '../../assets/Footer/footmid.png';

const { width } = Dimensions.get('window');

const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'Home', icon: 'home', route: 'HomeScreen' },
    { name: 'New Arrival', icon: 'fire', route: 'ProductShowcase' },
    { name: '', isCenter: true, route: 'Allcat' },
    { name: 'Orders', icon: 'shopping-bag', route: 'OrderList' },
    { name: 'Profile', icon: 'user', route: 'Profile' },
  ];

  return (
    <SafeAreaView style={styles.wrapper} edges={['bottom']}>
      <View style={styles.container}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>  tab.route && navigation.navigate(tab.route)}
            activeOpacity={0.7}
            style={[
              styles.tabItem,
              tab.isCenter && styles.centerTab,
              { flex: tab.isCenter ? 0.7 : 1 },
            ]}
          >
            <View style={tab.isCenter ? styles.centerIconWrapper : styles.defaultIconWrapper}>
              {tab.isCenter ? (
                <Image source={footMidIcon} style={styles.centerImage} resizeMode="contain" />
              ) : (
                <FontAwesome
                  name={tab.icon}
                  size={22}
                  color={route.name === tab.route ? '#2563EB' : '#A0AEC0'}
                />
              )}
            </View>
            {!tab.isCenter && (
              <Text style={[styles.label, route.name === tab.route && styles.activeLabel]}>
                {tab.name}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 10,
    width: width,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 100,
    gap: 10,
  },
  container: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#A0AEC0',
    marginTop: 2,
  },
  activeLabel: {
    color: '#2563EB',
  },
  centerTab: {
    top: -12,
  },
  defaultIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIconWrapper: {
    backgroundColor: '#2A55E5',
    padding: 8,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#F58220',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  centerImage: {
    paddingTop: 15,
    width: 48,
    height: 48,
  },
});

export default BottomNav;
