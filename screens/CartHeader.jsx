import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@apollo/client';
import { GET_WISHLIST_QUERY, GET_CART } from '../graphql/queries';
import FilterModal from '.././components/Productlist/FilterModal';

const CartHeader = () => {
  const navigation = useNavigation();

  // ✅ Move hooks INSIDE the component function
  const { loading: wishlistLoading, data: wishlistData } = useQuery(GET_WISHLIST_QUERY);
  const { loading: cartLoading, data: cartData } = useQuery(GET_CART);

  const wishlistCount = wishlistData?.getWishList?.wishlistProducts?.length || 0;
  const cartCount = cartData?.getCart?.cartProducts?.length || 0;

  // You can replace this with actual notification logic
  const notificationCount = 2;

  return (
    <LinearGradient
      colors={['#184977', '#459BEC', '#73BBFF', '#DFF0FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.headerContainer}
    >
      {/* Top Row */}
       <View style={styles.topRow}>
      <TouchableOpacity  onPress={() => navigation.goBack()}>
        <Feather style={styles.title} name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
    

        <Text style={styles.title}>Your Cart</Text>

        <View style={styles.floatingIcons}>

        
        
        </View>
      </View>

      
      
    </LinearGradient>

    
  );
  
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 30,
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginLeft: -20,
    marginRight: -20,
    marginTop: -30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    marginLeft: 10,
    marginTop: 18,
  },
  floatingIcons: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    right: 15,
    gap: 15,
  },
  iconButton: {
    backgroundColor: "#DFF0FF",
    padding: 8,
    borderRadius: 20,
    elevation: 4,
  },
  iconWithBadge: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchBar: {
    marginTop: 35,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    height: 45,
    width: 360,
    marginLeft: 30,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default CartHeader;
