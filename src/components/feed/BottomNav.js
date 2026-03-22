import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const TRAVELER_NAV = [
  { name: 'home',    activeIcon: 'home',           outlineIcon: 'home-outline'           },
  { name: 'explore', activeIcon: 'compass',        outlineIcon: 'compass-outline'        },
  { name: 'calendar',activeIcon: 'calendar',       outlineIcon: 'calendar-outline'       },
  { name: 'profile', activeIcon: 'person',         outlineIcon: 'person-outline'         },
];

const GUIDE_NAV = [
  { name: 'home',    activeIcon: 'home',           outlineIcon: 'home-outline'           },
  { name: 'add',     activeIcon: 'add-circle',     outlineIcon: 'add-circle-outline'     },
  { name: 'calendar',activeIcon: 'calendar',       outlineIcon: 'calendar-outline'       },
  { name: 'profile', activeIcon: 'person',         outlineIcon: 'person-outline'         },
];

const BottomNav = ({ activeTab = 'home', onTabPress }) => {
  const { colors } = useTheme();
  const { isGuide } = useAuth();
  const NAV_ITEMS = isGuide ? GUIDE_NAV : TRAVELER_NAV;
  const s = makeStyles(colors);
  return (
    <View style={s.nav}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            style={s.item}
            onPress={() => onTabPress && onTabPress(item.name)}
            activeOpacity={0.8}
          >
            {isActive ? (
              <View style={s.activeIcon}>
                <Ionicons name={item.activeIcon} size={22} color={colors.background} />
              </View>
            ) : (
              <Ionicons name={item.outlineIcon} size={26} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 20,
    left: '15%',
    right: '15%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  item: {
    padding: 4,
  },
  activeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomNav;
