import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const RatingBadge = ({ rating, backgroundColor, textColor, style }) => {
  const { colors } = useTheme();
  const resolvedBg   = backgroundColor ?? colors.overlayDark;
  const resolvedText = textColor ?? '#ffffff'; // blanc par défaut : badge sur image

  return (
    <View style={[styles.badge, { backgroundColor: resolvedBg }, style]}>
      <Ionicons name="star" size={14} color={colors.accent} />
      <Text style={[styles.text, { color: resolvedText }]}>{rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default RatingBadge;
