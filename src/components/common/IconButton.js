import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const IconButton = ({ iconName, iconSize = 22, iconColor, onPress, style }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const resolvedColor = iconColor ?? colors.textPrimary;

  return (
    <TouchableOpacity style={[s.button, style]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={iconName} size={iconSize} color={resolvedColor} />
    </TouchableOpacity>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
