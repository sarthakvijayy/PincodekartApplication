// services/authApi.js
import axios from 'axios';

const BASE_URL = 'https://pincodekart.com/api';

export const sendOtp = async (mobileNumber, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/sendOtp`, {
      mobileNumber,
      otp,
    });

    return response.data;
  } catch (error) {
    console.error('OTP Send Error:', error);
    return { success: false, message: 'Server Error' };
  }
};
