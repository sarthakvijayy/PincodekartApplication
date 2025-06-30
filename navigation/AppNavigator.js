import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
// import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen.jsx';
import LoginScreen from '../screens/Auth/LoginScreen';
import ProductCards from '../components/Productlist/ProductHeader.jsx';
import ProductShowcaseScreen from '../components/Productlist/ProductShowcaseScreen.jsx';
import CategoryModal from '../components/Productlist/CategoryModal.jsx';
import ProductDetailScreen from '../components/Productlist/ProductDetailScreen.jsx';
import BottomNav from '../components/HomeScreen/BottomNav.jsx';
import MyOrdersScreen from '../screens/MyOrdersScreen.jsx';
import ProfileScreen from '../screens/ProfileScreen.jsx';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Allcat from '../components/Category/Allcat.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WishlistCard from '../components/HomeScreen/WishlistCard.jsx';
import Notification from '../components/HomeScreen/Notification.jsx';
import CategoryScreen from '../components/Category/CategoryScreen.jsx';
import { CartProvider } from '../screens/CartContext.jsx';
import AddressScreen from '../screens/AddressScreen.jsx';
import MyOrderScreen from '../screens/MyOrdersScreen.jsx';
import OrderSummaryScreen from '../screens/OrderSummaryScreen.jsx';
import MyOrdersProfile from '../screens/MyOrdersProfile.jsx';
import OrderDetailScreen from '../screens/OrderDetailScreen.jsx';
import OrderList from '../screens/OrderList.jsx';
import EditProfile from '../screens/ProfileScreen/EditProfile.jsx';
import SignUpScreen from '../screens/Auth/SignUpScreen.jsx';
import SavedAddress from '../screens/ProfileScreen/SavedAddress.jsx';
import OrderConfirmedScreen from '../screens/OrderConfirmedScreen.jsx';
import OtpVerificationPhoneScreen from '../screens/Auth/OtpVerificationPhoneScreen.jsx';

const httpLink = createHttpLink({
  uri: 'https://pincodekart.com/api/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const email = await AsyncStorage.getItem('email');
  return {
    
    headers: {
      ...headers,
      email: email ,
    },
  };
  
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ProductCards" component={ProductCards} />
        <Stack.Screen name="ProductShowcase" component={ProductShowcaseScreen} />
        <Stack.Screen name="CategoryModal" component={CategoryModal} options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="BottomNav" component={BottomNav} />
        <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Allcat" component={Allcat} />
        <Stack.Screen name='WishlistCard' component={WishlistCard} />
        <Stack.Screen name='Notification' component={Notification} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="AddressScreen" component={AddressScreen} />
        <Stack.Screen name="MyOrderScreen" component={MyOrderScreen} />
        <Stack.Screen name="OrderSummaryScreen" component={OrderSummaryScreen} />
        <Stack.Screen name="MyOrdersProfile" component={MyOrdersProfile} />
        <Stack.Screen name='OrderDetailScreen' component={OrderDetailScreen} />
        <Stack.Screen name='OrderList' component={OrderList} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
        <Stack.Screen name='SavedAddress' component={SavedAddress} />
        <Stack.Screen name='OrderConfirmedScreen' component={OrderConfirmedScreen} />
        <Stack.Screen name='OtpVerificationPhoneScreen' component={OtpVerificationPhoneScreen} />
      </Stack.Navigator>
      </CartProvider>
    </ApolloProvider>
  );
};

export default AppNavigator;
