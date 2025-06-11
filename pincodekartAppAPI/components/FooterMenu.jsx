// components/FooterMenu.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';


const FooterMenu = ({ navigation }) => (
  <View style={styles.footer}>
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Text style={styles.footerLink}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
      <Text style={styles.footerLink}>Cart</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <Text style={styles.footerLink}>Profile</Text>
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#6c757d',
  },
  footerLink: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default FooterMenu;
