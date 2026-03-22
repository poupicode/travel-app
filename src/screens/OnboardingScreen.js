import React from 'react';
import { View, FlatList } from 'react-native';
import useOnboarding from '../hooks/useOnboarding';
import OnboardingSlide from '../components/onboarding/OnboardingSlide';
import { onboardingData } from '../data/onboarding';
import { useTheme } from '../context/ThemeContext';

const OnboardingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const {
    flatListRef,
    handleNext,
    handleBack,
    onViewableItemsChanged,
    viewabilityConfig,
    getItemLayout,
    totalSlides,
  } = useOnboarding(navigation);

  const renderItem = ({ item, index }) => (
    <OnboardingSlide
      item={item}
      index={index}
      totalSlides={totalSlides}
      onNext={handleNext}
      onBack={handleBack}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEnabled
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

export default OnboardingScreen;
