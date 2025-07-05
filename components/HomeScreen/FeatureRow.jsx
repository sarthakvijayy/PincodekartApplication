import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

const features = [
  {
    title: 'Free Delivery',
    image: require('../../assets/feature/fdel.png'),
    bgColor: '#FAE0BF',
  },
  {
    title: 'Open Box Service',
    image: require('../../assets/feature/obd.png'),
    bgColor: '#FED4D4',
  },
  {
    title: 'Same Time Return',
    image: require('../../assets/feature/stdel.png'),
    bgColor: '#BAECD9',
  },
  {
    title: 'Pay on Delivery',
    image: require('../../assets/feature/cod.png'),
    bgColor: '#E5E1F8',
  },
];

const { width } = Dimensions.get('window');
const CARD_GAP = 8;
const CARD_WIDTH = (width - CARD_GAP * 5 - 20) / 4; // 20 = horizontal padding

const FeatureRow = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {features.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              {
                backgroundColor: item.bgColor,
                marginRight: index < features.length - 1 ? CARD_GAP : 0,
              },
            ]}
          >
            <Image source={item.image} style={styles.icon} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    width: 34,
    height: 34,
    marginBottom: 6,
  },
  title: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#184977',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    lineHeight: 16,
  },
});

export default FeatureRow;
