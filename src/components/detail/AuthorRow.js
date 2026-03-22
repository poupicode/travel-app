import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RatingBadge from '../common/RatingBadge';
import { useTheme } from '../../context/ThemeContext';

const AuthorRow = ({ authorName, rating }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      {/* Avatar initiale */}
      <View style={s.avatar}>
        {authorName ? (
          <Text style={s.avatarText}>{authorName.charAt(0).toUpperCase()}</Text>
        ) : (
          <Ionicons name="person" size={20} color={colors.background} />
        )}
      </View>
      <View style={s.info}>
        <Text style={s.label}>Guide</Text>
        <Text style={s.name}>{authorName ?? '—'}</Text>
      </View>
      <RatingBadge rating={rating} backgroundColor={colors.card} textColor={colors.textPrimary} />
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default AuthorRow;
