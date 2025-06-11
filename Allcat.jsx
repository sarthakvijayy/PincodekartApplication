import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CategoryScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={styles.headerIcons}>
          <Feather name="bell" size={24} color="#C58E00" style={styles.icon} />
          <Feather name="heart" size={24} color="red" style={styles.icon} />
          <Ionicons name="bag-outline" size={24} color="#2D6CDF" />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#888" />
          <TextInput
            placeholder="Search for product, brands and more"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
          <Feather name="mic" size={18} color="#888" />
        </View>
        <TouchableOpacity style={styles.cameraIcon}>
          <Feather name="camera" size={18} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Category Sections */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Popular Section */}
        <View style={styles.categorySection}>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Popular</Text>
          </View>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Popular</Text>
          </View>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Popular</Text>
          </View>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Popular</Text>
          </View>

          
        </View>

        {/* Books & Media Section */}
        <View style={styles.categorySection}>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Books & Media</Text>
          </View>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Books & Media</Text>
          </View>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Books & Media</Text>
          </View>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Books & Media</Text>
          </View>
        </View>

        {/* Sports Section */}
        <View style={styles.categorySection}>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Sports</Text>
          </View>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Sports</Text>
          </View>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Sports</Text>
          </View>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Sports</Text>
          </View>

          
        </View>

        {/* Women Footwear Section */}
        <View style={styles.categorySection}>
          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Women Footwear</Text>
          </View>

          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Women Footwear</Text>
          </View>

          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Women Footwear</Text>
          </View>

          <View style={styles.leftBox}>
            <Image source={require('./assets/CategoryPage/HotProducts/h1.jpg')} style={styles.leftImage} />
            <Text style={styles.popularText}>Women Footwear</Text>
          </View>

          
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E1E',
    marginLeft: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  cameraIcon: {
    marginLeft: 10,
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 10,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
  },
  leftBox: {
    width: 100,
    backgroundColor: '#F5F8FF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  leftImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  popularText: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 16,
    color: '#3A63D1',
    textAlign: 'center',
  },
  rightBox: {
    flex: 1,
  },
  hotProductsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  hotScroll: {
    gap: 16,
  },
  hotItem: {
    alignItems: 'center',
    width: 90,
  },
  hotImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 6,
  },
  hotLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});