import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return calculateDimensions(width, height);
  });

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setDimensions(calculateDimensions(width, height));
    };

    let subscription;
    if (Dimensions.addEventListener) {
      subscription = Dimensions.addEventListener('change', updateDimensions);
    }

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  return dimensions;
};

const calculateDimensions = (width, height) => {
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  const isLandscape = width > height;

  return {
    // Screen size categories
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isTablet,
    isLargeTablet,
    isLandscape,
    
    // Tab bar dimensions
    tabBarHeight: isSmallScreen ? 65 : isTablet ? (isLargeTablet ? 90 : 80) : 70,
    iconSize: isSmallScreen ? 22 : isTablet ? (isLargeTablet ? 32 : 28) : 24,
    centerIconSize: isSmallScreen ? 55 : isTablet ? (isLargeTablet ? 80 : 70) : 60,
    centerImageSize: isSmallScreen ? 30 : isTablet ? (isLargeTablet ? 45 : 40) : 35,
    fontSize: isSmallScreen ? 10 : isTablet ? (isLargeTablet ? 16 : 14) : 12,
    badgeSize: isSmallScreen ? 14 : isTablet ? (isLargeTablet ? 24 : 20) : 16,
    badgeFontSize: isSmallScreen ? 8 : isTablet ? (isLargeTablet ? 14 : 12) : 10,
    centerIconTop: isSmallScreen ? 8 : isTablet ? (isLargeTablet ? 18 : 15) : 10,
    paddingBottom: isSmallScreen ? 2 : isTablet ? (isLargeTablet ? 12 : 8) : 4,
    paddingTop: isSmallScreen ? 2 : isTablet ? (isLargeTablet ? 12 : 8) : 4,
    labelMarginTop: isSmallScreen ? 1 : isTablet ? (isLargeTablet ? 4 : 2) : 2,
    paddingHorizontal: isTablet ? 20 : 10,
    
    // Screen dimensions
    width,
    height,
  };
};

export default useResponsiveDimensions; 