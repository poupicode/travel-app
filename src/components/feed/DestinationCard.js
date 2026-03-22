import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RatingBadge from '../common/RatingBadge';
import { useTheme } from '../../context/ThemeContext';

const DestinationCard = ({ destination, isFavorite = false, onPress, onFavoritePress }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: destination.image }} style={s.image} />

      <View style={s.topOverlay}>
        <RatingBadge rating={destination.rating} />
        <TouchableOpacity
          style={s.favoriteButton}
          onPress={(e) => { e.stopPropagation?.(); onFavoritePress?.(); }}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? '#ff4d6d' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
        locations={[0, 0.5, 1]}
        style={s.gradient}
      >
        <View style={s.infoRow}>
          <View>
            <View style={s.locationRow}>
              <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={s.location}>{destination.location}</Text>
            </View>
            <Text style={s.name}>{destination.name}</Text>
          </View>
          <TouchableOpacity style={s.arrowButton} onPress={onPress}>
            <Ionicons name="arrow-forward" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  card: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.card,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    marginLeft: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DestinationCard;
