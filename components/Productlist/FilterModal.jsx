import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

const filters = {
  Price: ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'],
  Rating: ['4★ & above', '3★ & above'],
  Gender: ['Men', 'Women', 'Unisex'],
  Types: ['Casual', 'Formal', 'Party Wear'],
  Other: ['New Arrivals', 'Best Sellers'],
};

const FilterModal = ({ visible, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(filters)[0]);
  const [selectedOptions, setSelectedOptions] = useState({});

  const toggleOption = (category, option) => {
    const current = selectedOptions[category] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];

    setSelectedOptions(prev => ({
      ...prev,
      [category]: updated,
    }));
  };

  const clearAll = () => setSelectedOptions({});

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose(); // just close modal
    }
  };

  const handleDone = () => {
    if (typeof onClose === 'function') {
      onClose(selectedOptions); // send selected filters to parent and close
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.contentRow}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
              {Object.keys(filters).map((cat, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.tabButton,
                    selectedCategory === cat && styles.activeTab,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedCategory === cat && styles.activeTabText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Options */}
            <View style={styles.optionsPane}>
              <ScrollView contentContainerStyle={styles.optionsWrapper}>
                {filters[selectedCategory].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionPill,
                      (selectedOptions[selectedCategory] || []).includes(option) &&
                        styles.optionSelected,
                    ]}
                    onPress={() => toggleOption(selectedCategory, option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.productCount}>100 Products</Text>
            <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
              <Text style={styles.clearText}>Clear Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_500Medium',
  },
  closeText: {
    fontSize: 18,
    color: '#555',
  },
  contentRow: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 110,
    backgroundColor: '#F5F7FA',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  tabButton: {
    padding: 12,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins_400Regular',
  },
  activeTabText: {
    color: '#2A55E5',
    fontWeight: '600',
  },
  optionsPane: {
    flex: 1,
    padding: 12,
  },
  optionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionPill: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 6,
  },
  optionSelected: {
    backgroundColor: '#E3EBFD',
    borderColor: '#2A55E5',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  productCount: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
  },
  clearText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins_500Medium',
  },
  doneButton: {
    backgroundColor: '#2A55E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  doneText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Poppins_500Medium',
  },
});
