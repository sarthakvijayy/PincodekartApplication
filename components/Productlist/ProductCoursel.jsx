import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';

const Products = [
    {
        id: '101',
        image: require('../../assets/deals/Shirt.png'),
        brand: 'Fabindia',
        title: 'Men Slim Fit Checked Shirt',
        price: 899,
        originalPrice: 1290,
        discount: 30,
        rating: 4.0,
    },
    {
        id: '102',
        image: require('../../assets/deals/Shirt.png'),
        brand: 'H&M',
        title: 'Men Slim Fit Checked Shirt',
        price: 1110,
        originalPrice: 1340,
        discount: 30,
        rating: 4.2,
    },
    {
        id: '103',
        image: require('../../assets/deals/Shirt.png'),
        brand: 'Fabindia',
        title: 'Men Slim Fit Checked Shirt',
        price: 999,
        originalPrice: 1290,
        discount: 30,
        rating: 4.1,
    },
];

const ProductCoursel = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Similar Products</Text>
            <FlatList
                data={Products}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <ProductCard {...item} />
                    </View>
                )}
            />

            <View style={styles.hrLine} />
            <View style={styles.container1}>
                <Text style={styles.title}>Customers Also Liked</Text>
                <FlatList
                    data={Products}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <ProductCard {...item} />
                        </View>
                    )}
                />
                <View style={styles.hrLine} />
            </View>
        </View>
    );
};

export default ProductCoursel;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        marginVertical: 10,
    },
    container1: {
        paddingVertical: 10,
        marginVertical: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '500',
        fontFamily: 'Poppins-Bold',
        marginBottom: 10,
        color: '#000',
    },
    cardWrapper: {
        width: 200,
        marginRight: 12,
    },
    hrLine: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 12,
    },
});
