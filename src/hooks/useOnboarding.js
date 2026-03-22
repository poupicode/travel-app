import { useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import { onboardingData } from '../data/onboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const useOnboarding = (navigation) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const scrollToIndex = (index) => {
    if (flatListRef.current) {
      try {
        flatListRef.current.scrollToIndex({ animated: true, index });
      } catch (error) {
        console.log('Scroll error:', error);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollToIndex(nextIndex);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollToIndex(prevIndex);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const getItemLayout = (data, index) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  return {
    currentIndex,
    flatListRef,
    handleNext,
    handleBack,
    onViewableItemsChanged,
    viewabilityConfig,
    getItemLayout,
    totalSlides: onboardingData.length,
  };
};

export default useOnboarding;
