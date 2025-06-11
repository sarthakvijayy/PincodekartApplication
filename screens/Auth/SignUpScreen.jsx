// screens/Auth/SignUpScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Entypo } from '@expo/vector-icons';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { sendOtp } from '../../services/authApi'; // Axios OTP API


const client = new ApolloClient({
  uri: 'https://pincodekart.com/api/graphql',
  cache: new InMemoryCache(),
});

const SignUpScreen = () => {
  const [focusedField, setFocusedField] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });
  if (!fontsLoaded) return null;

  const REGISTER_USER = gql`
    mutation RegisterUser(
      $email: String,
      $password: String,
      $firstName: String,
      $lastName: String,
      $mobileNo: String
    ) {
      registerUser(
        email: $email,
        password: $password,
        firstName: $firstName,
        lastName: $lastName,
        mobileNo: $mobileNo
      ) {
        id
        firstName
        lastName
        mobileNo
        email
      }
    }
  `;

  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      setAlertMessage('Please enter a valid 10-digit mobile number');
      setShowModal(true);
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await sendOtp(mobile, randomOtp);
      setGeneratedOtp(randomOtp);
      setOtpSent(true);
      setAlertMessage('OTP sent successfully!');
      setShowModal(true);
    } catch (error) {
      setAlertMessage(error.message || 'Failed to send OTP');
      setShowModal(true);
    }
  };

  const handleSubmit = async () => {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !mobile ||
      !otp ||
      !password ||
      !confirmPassword
    ) {
      setAlertMessage('Please fill in all fields.');
      setShowModal(true);
      return;
    }

    if (!termsAccepted) {
      setAlertMessage('Please accept Terms & Conditions to proceed.');
      setShowModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match.');
      setShowModal(true);
      return;
    }

    if (otp !== generatedOtp) {
      setAlertMessage('Invalid OTP.');
      setShowModal(true);
      return;
    }

    try {
      const { data } = await client.mutate({
        mutation: REGISTER_USER,
        variables: {
          email,
          password,
          firstName,
          lastName,
          mobileNo: mobile,
        },
      });
      console.log(data);
      setAlertMessage('Your account has been successfully created!');
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setAlertMessage('There was an error registering your account.');
      setShowModal(true);
    }
  };

  return (
    <ApolloProvider client={client}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={require('../../assets/logo/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.row}>
            <TextInput
              placeholder="First Name"
              style={[styles.input, focusedField === 'firstName' && styles.inputFocused]}
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField('')}
            />
            <TextInput
              placeholder="Last Name"
              style={[styles.input, focusedField === 'lastName' && styles.inputFocused]}
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField('')}
            />
          </View>

          <TextInput
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            style={[styles.inputFull, focusedField === 'mobile' && styles.inputFocused]}
            value={mobile}
            onChangeText={setMobile}
            onFocus={() => setFocusedField('mobile')}
            onBlur={() => setFocusedField('')}
          />

          <TouchableOpacity style={styles.otpButton} onPress={handleSendOtp}>
            <Text style={styles.otpText}>{otpSent ? 'Resend OTP' : 'Send OTP'}</Text>
          </TouchableOpacity>

          {otpSent && (
            <TextInput
              placeholder="Enter OTP"
              keyboardType="numeric"
              style={[styles.inputFull, focusedField === 'otp' && styles.inputFocused]}
              value={otp}
              onChangeText={setOtp}
              onFocus={() => setFocusedField('otp')}
              onBlur={() => setFocusedField('')}
            />
          )}

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={[styles.inputFull, focusedField === 'username' && styles.inputFocused]}
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField('')}
          />

          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={[styles.inputFull, focusedField === 'email' && styles.inputFocused]}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[styles.inputFull, focusedField === 'password' && styles.inputFocused]}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
          />

          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.inputFull, focusedField === 'confirmPassword' && styles.inputFocused]}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField('')}
          />

          <Pressable style={styles.termsRow} onPress={() => setTermsAccepted(!termsAccepted)}>
            <Entypo
              name={termsAccepted ? 'check' : 'circle'}
              size={20}
              color={termsAccepted ? '#F8941D' : '#aaa'}
            />
            <Text style={styles.termsText}>Accept Terms & Conditions</Text>
          </Pressable>

          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: termsAccepted ? '#F8941D' : '#ccc' },
            ]}
            onPress={handleSubmit}
          >
            <TouchableOpacity  onPress={()=> navigation.navigate('HomeScreen')}>
              <Text style={styles.submitText} >Create Account</Text></TouchableOpacity>
          </Pressable>

          <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Alert</Text>
              <Text style={styles.modalMessage}>{alertMessage}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </ApolloProvider>
  );
};





const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 50,
  },
  logo: {
    width: 200,
    height: 80,
    marginTop: 40,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  inputFull: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  inputFocused: {
    borderColor: '#F8941D',
  },
  otpButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  otpText: {
    fontFamily: 'Inter_500Medium',
    color: '#F8941D',
    fontSize: 14,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  termsText: {
    marginLeft: 10,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#F8941D',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
});

export default SignUpScreen;
