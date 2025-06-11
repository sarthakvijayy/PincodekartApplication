import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const CategoryHeader = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#184977', '#459BEC', '#73BBFF', '#DFF0FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.headerContainer}
    >
      {/* Top Row */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>All Shop</Text>

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Feather name="bell" size={22} color="#FFEB3B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("WishlistCard")}>
            <AntDesign name="heart" size={22} color="#F44336" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
            <Ionicons name="bag-handle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Feather name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search for products, brands and more"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
        <Ionicons name="mic-outline" size={18} color="#888" />
        <Feather name="camera" size={18} color="#888" style={{ marginLeft: 10 }} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 40,
    marginLeft: -20,
    marginRight: -20,
    marginTop: -20,
    
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    marginLeft: 10,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  searchBar: {
    marginTop: 35,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 45,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default CategoryHeader;
