import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const SearchBar = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Search for products"
          placeholderTextColor="#888"
        />
        <TouchableOpacity>
          <Ionicons name="mic-outline" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <Feather name="camera" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 10,
    color: '#000',
  },
});

export default SearchBar;
