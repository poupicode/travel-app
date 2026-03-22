import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ContinentFilter = ({ continents, selectedContinent, onSelect }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={s.container}
      contentContainerStyle={s.content}
    >
      {continents.map((continent) => {
        const isActive = selectedContinent === continent.name;
        return (
          <TouchableOpacity
            key={continent.id}
            style={[s.chip, isActive && s.chipActive]}
            onPress={() => onSelect(continent.name)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: continent.image }} style={s.image} />
            <Text style={[s.text, isActive && s.textActive]}>{continent.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  content: {
    paddingHorizontal: 20,
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 12,
    gap: 8,
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  textActive: {
    color: colors.background,
  },
});

export default ContinentFilter;
