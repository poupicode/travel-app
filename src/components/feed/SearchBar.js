import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const SearchBar = ({ value, onChangeText, onFilterPress, placeholder = 'Search destination...' }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  return (
    <View style={s.container}>
      <View style={s.searchBar}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={s.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaintest}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity style={s.filterButton} onPress={onFilterPress} activeOpacity={0.8}>
        <Ionicons name="options-outline" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    gap: 12,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchBar;
