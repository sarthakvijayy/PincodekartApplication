import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Modal from 'react-native-modal';

const OtpBottomSheet = ({
  isVisible,
  onClose,
  phone,
  otp,
  setOtp,
  onVerifyOtp,
  onResendOtp,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      useNativeDriver
      hideModalContentWhileAnimating
      style={styles.bottomModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />

          <Text style={styles.modalTitle}>Enter OTP</Text>
          <Text style={styles.modalMessage}>OTP sent to +91 {phone}</Text>

          <TextInput
            style={styles.otpInput}
            placeholder="6-digit OTP"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity style={styles.modalButton} onPress={onVerifyOtp}>
            <Text style={styles.modalButtonText}>Verify</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onResendOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default OtpBottomSheet;

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 8,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#5c5cff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    marginTop: 14,
    fontSize: 13,
    color: '#5c5cff',
    textAlign: 'center',
  },
});
