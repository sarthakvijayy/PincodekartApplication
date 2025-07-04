// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   ImageBackground,
//   Keyboard,
// } from "react-native";
// import Modal from "react-native-modal";
// import { useNavigation } from "@react-navigation/native";
// import {
//   useFonts,
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_700Bold,
// } from "@expo-google-fonts/inter";
// import LottieView from "lottie-react-native";
// import { sendOtp } from "../../services/authApi";

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [generatedOtp, setGeneratedOtp] = useState("");
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [showAlertModal, setShowAlertModal] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const [fontsLoaded] = useFonts({
//     Inter_400Regular,
//     Inter_500Medium,
//     Inter_700Bold,
//   });

//   const generate6DigitOtp = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };

//   const handleContinue = async () => {
//     if (!phone || phone.length !== 10) {
//       setAlertMessage("Please enter a valid 10-digit mobile number");
//       setShowAlertModal(true);
//       return;
//     }

//     const otpCode = generate6DigitOtp();
//     setGeneratedOtp(otpCode);
//     setIsLoading(true);

//     try {
//       const response = await sendOtp(phone, otpCode);
//       console.log("OTP SENT:", otpCode);
//       console.log("API Response:", response);

      
//       setShowOtpModal(true);
//       setAlertMessage("OTP sent successfully!");
//       setShowAlertModal(true);
//     } catch (error) {
//       setAlertMessage("Error sending OTP. Please try again.");
//       setShowAlertModal(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOtp = () => {
//     if (otp === generatedOtp) {
//       setShowOtpModal(false);
//       navigation.navigate("HomeScreen", { phone });
//     } else {
//       setAlertMessage("Incorrect OTP entered.");
//       setShowAlertModal(true);
//     }
//   };

//   if (!fontsLoaded) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#F58220" />
//       </View>
//     );
//   }

//   return (
      
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//       style={styles.container}
//     >
//       <ImageBackground
//           source={require("../../assets/shop_images/shop_img2.png")}
//           style={styles.container}
//           resizeMode="cover"
//         >
//       <View style={styles.content}>
        

//         <Image
//           source={require("../../assets/logo/logo.png")}
//           style={styles.logo}
//           resizeMode="contain"
//         />

//         <Text style={styles.title}>Apni Dukaan Apne Ghar</Text>
//         <Text style={styles.subText}>Log In or Sign Up</Text>

//         <View style={styles.inputWrapper}>
//           <Text style={styles.countryCode}>+91</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter mobile number"
//             placeholderTextColor="#999"
//             keyboardType="phone-pad"
//             maxLength={10}
//             value={phone}
//             onChangeText={setPhone}
//           />
//         </View>

//         <TouchableOpacity
//           style={[styles.continueBtn, isLoading && styles.disabled]}
//           onPress={handleContinue}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.continueText}>Continue</Text>
//           )}
//         </TouchableOpacity>
        
//       </View>
      

//       {/* Footer */}
//      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//   <KeyboardAvoidingView
//     style={{ flex: 1 }}
//     behavior={Platform.OS === "ios" ? "padding" : undefined}
//     keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
//   >
//     <View style={{ flex: 1 }}>
//       {/* Your form or screen content here */}

//       {/* Bottom terms section */}
//       <View style={styles.bottomSection}>
//         <Text style={styles.terms}>
//           By continuing, you agree to our{" "}
//           <Text style={styles.link}>Terms of service</Text> &{" "}
//           <Text style={styles.link}>Privacy policy</Text>
//         </Text>
//       </View>
//     </View>
//   </KeyboardAvoidingView>
// </TouchableWithoutFeedback>


      

//       {/* Alert Modal */}
//       <Modal
//         isVisible={showAlertModal}
//         onBackdropPress={() => setShowAlertModal(false)}
//         useNativeDriver
//       >
//         {/* <View style={styles.modalBox}>
//           <Text style={styles.modalTitle}>Alert</Text>
//           <Text style={styles.modalMessage}>{alertMessage}</Text>
//           <TouchableOpacity
//             style={styles.modalButton}
//             onPress={() => setShowAlertModal(false)}
//           >
//             <Text style={styles.modalButtonText}>OK</Text>
//           </TouchableOpacity>
//         </View> */}
//       </Modal>
      

//       {/* OTP Bottom Sheet */}
//       <Modal
//         isVisible={showOtpModal}
//         onBackdropPress={() => setShowOtpModal(false)}
//         swipeDirection="down"
//         onSwipeComplete={() => setShowOtpModal(false)}
//         useNativeDriver
//         style={styles.bottomModal}
//       >
//         <View style={styles.bottomSheet}>
//           <View style={styles.sheetHeader} />

//           <Text style={styles.modalTitle}>Enter OTP sent to +91 {phone}</Text>
//           <TouchableOpacity onPress={() => setShowOtpModal(false)}>
//             <Text style={styles.resendOtp}>Change Number</Text>
//           </TouchableOpacity>

//           <TextInput
//             style={styles.otpInput}
//             placeholder="------"
//             placeholderTextColor="#ccc"
//             keyboardType="number-pad"
//             maxLength={6}
//             value={otp}
//             onChangeText={setOtp}
//           />

//           <Text style={styles.resendOtp}>Resend OTP</Text>

//           <TouchableOpacity
//             style={[styles.modalButton, { marginTop: 20 }]}
//             onPress={handleVerifyOtp}
//           >
//             <Text style={styles.modalButtonText}>Verify</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//       </ImageBackground>
//     </KeyboardAvoidingView>
    

//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1,
//      backgroundColor: "#fff",
//     },
//   content: { 
//   marginTop: 60,
//   alignItems: "center",
//   paddingHorizontal: 20, 
//   backgroundColor: "rgba(255, 255, 255, 0.80)", 
//   borderRadius: 20,
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 4 },
//   shadowOpacity: 0.2,
//   shadowRadius: 8,
//   elevation: 8,
//   marginHorizontal: 20,
//   marginTop: '50%',
//   paddingBottom: 20, 
// },
//   logo: {
//     width: 170,
//     height: 90,
//     marginBottom: 30
//   },
//   title: {
//     fontSize: 22,
//     fontFamily: "Inter_700Bold",
//     color: "#000"
//    },
//   subText: {
//     fontSize: 14,
//     color: "#555",
//     fontFamily: "Inter_400Regular",
//     marginTop: 4,
//     marginBottom: 30,
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderColor: "#0c0c0c",
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     height: 50,
//     width: "100%",
//     marginBottom: 20,
//   },
//   countryCode: {
//     fontSize: 16,
//     fontFamily: "Inter_500Medium",
//     color: "#000",
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     fontFamily: "Inter_500Medium",
//     color: "#000",
//   },
//   continueBtn: {
//     backgroundColor: "#0679E3",
//     width: "100%",
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   continueText: {
//     color: "#fff",
//     fontSize: 16,
//     fontFamily: "Inter_700Bold",
//   },
//   disabled: { 
//     backgroundColor: "#ccc"
//   },
//   loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
// bottomSection: {
//   position: "absolute",
//   bottom: 20,
//   left: 20,
//   right: 20,
//   alignItems: "center",
//   zIndex: 10, 
// },

//   terms: {
//     textAlign: "center",
//     fontSize: 12,
//     color: "#000",
//     fontFamily: "Inter_400Regular",
//   },
//   link: { color: "#5c5cff", fontFamily: "Inter_500Medium" },
//   modalBox: {
//     backgroundColor: "#fff",
//     padding: 24,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontFamily: "Inter_700Bold",
//     marginBottom: 10,
//     color: "#000",
//     textAlign: "center",
//   },
//   modalMessage: {
//     fontSize: 14,
//     fontFamily: "Inter_400Regular",
//     color: "#555",
//     textAlign: "center",
//   },
//   modalButton: {
//     backgroundColor: "#5c5cff",
//     paddingVertical: 10,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   modalButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontFamily: "Inter_500Medium",
//   },
//   otpInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 12,
//     marginTop: 20,
//     width: "100%",
//     textAlign: "center",
//     fontSize: 22,
//     fontFamily: "Inter_500Medium",
//     letterSpacing: 14,
//   },
//   resendOtp: {
//     marginTop: 10,
//     fontSize: 13,
//     color: "#5c5cff",
//     fontFamily: "Inter_500Medium",
//   },
//   animationWrapper: {
//     width: "100%",
//     height: 200,
//     marginTop: -20,
//     marginBottom: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   lottie: { width: 200, height: 200 },
//   bottomModal: {
//     justifyContent: "flex-end",
//     margin: 0,
//   },
//   bottomSheet: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     alignItems: "center",
//   },
//   sheetHeader: {
//     width: 60,
//     height: 5,
//     backgroundColor: "#ccc",
//     borderRadius: 3,
//     marginBottom: 16,
//   },
// });





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

        // Navigate to HomeScreen after 3 seconds
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

        <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
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
        </Modal>
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

