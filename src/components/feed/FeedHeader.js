import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IconButton from '../common/IconButton';
import { useTheme } from '../../context/ThemeContext';

const FeedHeader = ({ cityName, onCityPress, onLocateMe, locating }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  return (
    <View style={s.header}>
      <View style={s.locationContainer}>
        <Text style={s.currentLocationLabel}>
          {cityName ? 'Current Location' : 'Location'}
        </Text>
        <TouchableOpacity style={s.locationRow} onPress={onCityPress}>
          <Text style={[s.locationText, !cityName && s.locationPlaceholder]}>
            {cityName ?? 'Select a location'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={cityName ? colors.textPrimary : colors.textMuted} style={s.dropdownIcon} />
        </TouchableOpacity>
      </View>

      <View style={s.actions}>
        {/* Bouton géolocalisation */}
        <TouchableOpacity
          style={[s.locateButton, locating && s.locateButtonActive]}
          onPress={onLocateMe}
          disabled={locating}
          activeOpacity={0.8}
        >
          {locating ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Ionicons name="navigate" size={20} color={colors.accent} />
          )}
        </TouchableOpacity>

        <IconButton iconName="notifications-outline" iconSize={22} />
      </View>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  locationContainer: {
    flex: 1,
  },
  currentLocationLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 6,
  },
  locationPlaceholder: {
    color: colors.textMuted,
    fontWeight: '400',
    fontSize: 16,
  },
  dropdownIcon: {
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locateButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locateButtonActive: {
    backgroundColor: colors.cardDark,
  },
});

export default FeedHeader;
