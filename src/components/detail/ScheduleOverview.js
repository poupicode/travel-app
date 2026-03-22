import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ScheduleOverview = ({ destinationName, locationName }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      <Text style={s.title}>Schedule Overview</Text>
      <Text style={s.description}>
        Experience the charm of {destinationName}, the jewel of {locationName}, with this unforgettable getaway. Nestled along the breathtaking coastline, this picturesque destination offers stunning views, colorful architecture, and authentic local culture. Discover hidden gems, taste exquisite cuisine, and immerse yourself in the rich history of this magical place.
      </Text>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textTertiary,
  },
});

export default ScheduleOverview;
