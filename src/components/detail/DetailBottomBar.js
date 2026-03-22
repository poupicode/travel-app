import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const DetailBottomBar = ({ onChat, onBook, isBooked = false, loading = false }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.bar}>
      <TouchableOpacity style={s.chatButton} onPress={onChat} activeOpacity={0.8}>
        <Ionicons name="chatbubble-outline" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.bookButton, isBooked && s.bookButtonBooked]}
        onPress={onBook}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={isBooked ? colors.accent : colors.background} />
        ) : (
          <>
            <Ionicons
              name={isBooked ? 'checkmark-circle' : 'calendar-outline'}
              size={18}
              color={isBooked ? colors.accent : colors.background}
              style={s.bookIcon}
            />
            <Text style={[s.bookText, isBooked && s.bookTextBooked]}>
              {isBooked ? 'Planifié' : 'Book Now'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  chatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 28,
    gap: 8,
  },
  bookButtonBooked: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  bookIcon: {
    marginRight: 2,
  },
  bookText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
  bookTextBooked: {
    color: colors.accent,
  },
});

export default DetailBottomBar;
