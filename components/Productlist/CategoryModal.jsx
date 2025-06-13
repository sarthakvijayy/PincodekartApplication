import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
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

const CategoryModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      backdropOpacity={0.5}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Categories</Text>
        <View style={styles.gridContainer}>
          {categoryGrid.map((item, index) => (
            <TouchableOpacity key={index} style={styles.gridItem}>
              <Image source={item.image} style={styles.gridImage} />
              <Text style={styles.gridLabel}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;

const styles = StyleSheet.create({
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
