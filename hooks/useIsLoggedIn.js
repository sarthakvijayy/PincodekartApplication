import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestCartData, setGuestCartData] = useState(null);

  const checkLoginStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("email");
      setIsLoggedIn(!!token);
    } catch (error) {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchGuestCart = useCallback(async () => {
    try {
      const guestCart = await AsyncStorage.getItem("guestCart");
      setGuestCartData(guestCart ? JSON.parse(guestCart) : []);
    } catch (error) {
      setGuestCartData([]);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
    fetchGuestCart();
  }, [checkLoginStatus, fetchGuestCart]);

  return {
    isLoggedIn,
    guestCartData,
    refreshLoginStatus: checkLoginStatus,
    refreshGuestCart: fetchGuestCart,
  };
};

export default useIsLoggedIn;
