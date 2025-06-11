import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';


const IconCarousel = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {iconData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.iconContainer}>
            <Image source={item.icon} style={styles.iconImage} />
            <Text style={styles.iconText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  iconImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  iconText: {
    fontSize: 14,
    color: '#000',
  },
});

export default IconCarousel;
