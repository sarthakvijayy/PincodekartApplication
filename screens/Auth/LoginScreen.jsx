import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../../components/HomeScreen/BottomNav';

const client = new ApolloClient({
  uri: 'https://pincodekart.com/api/graphql',
  cache: new InMemoryCache(),
});

const LOGIN_USER = gql`
  query Userlogin($email: String, $password: String) {
    userlogin(email: $email, password: $password) {
      id
      email
    }
  }
`;

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F58220" />
      </View>
    );
  }

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setAlertMessage('Please fill in all fields.');
      setShowModal(true);
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const { data } = await client.query({
        query: LOGIN_USER,
        variables: { email, password },
      });

      if (data?.userlogin?.id) {
        await AsyncStorage.setItem('email', `${data?.userlogin?.email}`);
        setAlertMessage(`Welcome back, ${data.userlogin.email}`);
        setShowModal(true);

        
        setTimeout(() => {
          setShowModal(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          });
        }, 3000);
      } else {
        setAlertMessage('Invalid credentials. Please try again.');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlertMessage('Something went wrong. Please try again later.');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Image
          source={require('../../assets/logo/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Your E-Mail"
            placeholderTextColor="#c0c0c0"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#c0c0c0"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.signUpText}>
            Don't have an account?{' '}
            <Text style={styles.bold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password? Click Here</Text>
        </TouchableOpacity>

        {/* <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Alert</Text>
            <Text style={styles.modalMessage}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    alignSelf: 'center',
    marginBottom: 40,
  },
  inputBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#c0c0c0',
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
    paddingVertical: 8,
  },
  loginButton: {
    backgroundColor: '#F58220',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  signUpText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 10,
  },
  bold: {
    fontFamily: 'Inter_700Bold',
  },
  forgotPassword: {
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#333',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#F58220',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
});
