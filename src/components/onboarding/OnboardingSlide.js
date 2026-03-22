import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingButtons from './OnboardingButtons';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const OnboardingSlide = ({ item, index, totalSlides, onNext, onBack }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.slide}>
      <ImageBackground
        source={{ uri: item.image }}
        style={s.imageBackground}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)', '#000']}
        locations={[0, 0.3, 0.6, 0.85]}
        style={s.gradientOverlay}
      />

      <View style={s.bottomContainer}>
        <View style={s.contentContainer}>
          <View style={s.pageIndicator}>
            <Text style={s.pageText}>{item.page}</Text>
          </View>

          <Text style={s.title}>{item.title}</Text>
          <Text style={s.subtitle}>{item.subtitle}</Text>

          <OnboardingButtons
            showBack={index > 0}
            isLast={index === totalSlides - 1}
            onNext={onNext}
            onBack={onBack}
          />
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  pageIndicator: {
    backgroundColor: colors.overlayLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  pageText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: '300',
  },
});

export default OnboardingSlide;
