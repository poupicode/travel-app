import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_URI = 'https://i.pravatar.cc/100?img=3';

const HeroImage = ({
  imageUri,
  location,
  name,
  price,
  avatarUri = AVATAR_URI,
  viewCount = '2K',
}) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      <Image source={{ uri: imageUri }} style={s.image} />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
        locations={[0, 0.5, 1]}
        style={s.gradient}
      />

      <View style={s.overlay}>
        <View style={s.overlayTop}>
          <View style={s.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={s.avatar} />
            <View style={s.viewCountBadge}>
              <Text style={s.viewCountText}>{viewCount}</Text>
            </View>
          </View>
        </View>

        <View style={s.overlayBottom}>
          <View style={s.locationBadge}>
            <Ionicons name="location" size={16} color={"#ffffff"} />
            <Text style={s.locationText}>{location}</Text>
          </View>
          <Text style={s.name}>{name}</Text>
          <Text style={s.price}>
            ${price}
            <Text style={s.priceUnit}> /night</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 40,
    height: 320,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  overlayTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  viewCountBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  viewCountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.background,
  },
  overlayBottom: {
    justifyContent: 'flex-end',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 4,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
  },
});

export default HeroImage;
