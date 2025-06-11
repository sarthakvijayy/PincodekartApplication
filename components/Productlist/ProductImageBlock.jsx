// components/Productlist/ProductImageBlock.jsx
import React from 'react';
import { View, Image } from 'react-native';

const ProductImageBlock = ({ image }) => (
  <View><Image source={image} style={{ width: 100, height: 100 }} /></View>
);

export default ProductImageBlock;
