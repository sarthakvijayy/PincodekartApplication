import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const features = [
  {
    title: 'Free Delivery',
    image: require('../../assets/feature/freedelivery.png'),
  },
  {
    title: 'Open Box Services',
    image: require('../../assets/feature/openbox.png'),
  },
  {
    title: 'Same Day Delivery',
    image: require('../../assets/feature/sametime.png'),
  },
];

const { width } = Dimensions.get('window');

const FeatureRow = () => {
  return (
    <LinearGradient
      colors={['#184977', '#459BEC', '#73BBFF', '#DFF0FF']}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrapper}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {features.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.icon} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
  },
  
  card: {
    width: width / 3.3,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0C8CE9',
    textAlign: 'center',
  },
});

export default FeatureRow;
