import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const OnboardingButtons = ({ showBack, isLast, onNext, onBack }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      {showBack ? (
        <TouchableOpacity style={s.backButton} onPress={onBack} activeOpacity={0.8}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}

      <TouchableOpacity style={s.nextButton} onPress={onNext} activeOpacity={0.8}>
        <Text style={s.nextButtonText}>{isLast ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  backArrow: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OnboardingButtons;
