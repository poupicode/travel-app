import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconButton from '../common/IconButton';
import { useTheme } from '../../context/ThemeContext';

const DetailHeader = ({ title = 'Details', onBack, onMenu }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.header}>
      <IconButton iconName="arrow-back" iconSize={22} onPress={onBack} />
      <Text style={s.title}>{title}</Text>
      {onMenu
        ? <IconButton iconName="ellipsis-horizontal" iconSize={22} onPress={onMenu} />
        : <View style={s.placeholder} />
      }
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 44,
  },
});

export default DetailHeader;
