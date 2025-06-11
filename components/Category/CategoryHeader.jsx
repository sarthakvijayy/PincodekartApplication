import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';

const CategoryHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>All Shop</Text>

        <View style={styles.iconRow}>
          <TouchableOpacity>
            <Feather name="bell" size={22} color="#FFB800" />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="heart" size={22} color="#F44336" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="bag-handle-outline" size={24} color="#0D47A1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Feather name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search for product, brands and more"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
        <Ionicons name="mic-outline" size={18} color="#888" />
        <Feather name="camera" size={18} color="#888" style={{ marginLeft: 10 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingBottom: 15,
    // marginTop: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    lineHeight: '100',
    fontWeight: '600',
    flex: 1,
    marginLeft: 10,
    color: '#000',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  searchBar: {
    marginTop: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#000',
  },
});

export default CategoryHeader;
