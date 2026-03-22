import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_TAGS = [
  { icon: 'ticket',     label: 'Ticket' },
  { icon: 'business',   label: 'Hotel'  },
  { icon: 'restaurant', label: 'Meal'   },
];

const ActionTags = ({ tags = DEFAULT_TAGS }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      {tags.map((tag) => (
        <View key={tag.label} style={s.tag}>
          <Ionicons name={tag.icon} size={18} color={colors.accent} />
          <Text style={s.label}>{tag.label}</Text>
        </View>
      ))}
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tag: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default ActionTags;
