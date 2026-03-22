import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const SectionHeader = ({ title, actionLabel = 'View All', onAction }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>
      {onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={s.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
});

export default SectionHeader;
