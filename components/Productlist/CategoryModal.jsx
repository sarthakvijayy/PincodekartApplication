import React, { useState } from 'react';
import {View,Text,TextInput,StyleSheet,ScrollView,TouchableOpacity,Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const categoryGrid = [
  { name: 'Tops', image: require('../../assets/deals/Shirt.png') },
  { name: 'Bottoms', image: require('../../assets/deals/Shirt.png') },
  { name: 'Outwear', image: require('../../assets/deals/Shirt.png') },
  { name: 'Ethenic Wear', image: require('../../assets/deals/Shirt.png') },
  { name: 'Suit & Formal', image: require('../../assets/deals/Shirt.png') },
  { name: 'Sleepwear', image: require('../../assets/deals/Shirt.png') },
  { name: 'Swimwear', image: require('../../assets/deals/Shirt.png') },
  { name: 'View All', image: require('../../assets/deals/Shirt.png') },
];

const filters = ['Sort By', 'Filter', 'Size', 'Brand', 'Color', 'Price'];

const ProductHeader = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      {/* Header */}
      <LinearGradient
        colors={['#2A55E5', '#5C84EE', '#BEDFFF']}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <Ionicons name="arrow-back" size={22} color="#fff" onPress={() => navigation.goBack()} />

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for product, brands and more"
              placeholderTextColor="#888"
            />
          </View>

          <Ionicons name="bag-outline" size={22} color="#fff" />
        </View>
      </LinearGradient>

      {/* Categories Bar */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.categoryItem} onPress={openModal}>
            <Text style={styles.categoryText}>Categories</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="#333" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Filters Bar */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter, index) => (
            <TouchableOpacity key={index} style={styles.filterItem}>
              <Text style={styles.filterText}>{filter}</Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#333" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal Grid View */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        swipeDirection="down"
        onSwipeComplete={closeModal}
        backdropOpacity={0.5}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Categories</Text>
          <View style={styles.gridContainer}>
            {categoryGrid.map((item, index) => (
              <View key={index} style={styles.gridItem}>
                <Image source={item.image} style={styles.gridImage} />
                <Text style={styles.gridLabel}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProductHeader;

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 12,
    flexDirection: 'row',
    backgroundColor: '#F5F6FA',
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  categoryBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B6B6B6',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  filterText: {
    fontSize: 16,
    color: '#333',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '22%',
    alignItems: 'center',
    marginVertical: 10,
  },
  gridImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
