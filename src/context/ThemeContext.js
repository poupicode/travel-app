import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Palette dark ────────────────────────────────────────────────────────────
export const darkColors = {
  background:   '#000000',
  card:         '#1a1a1a',
  cardDark:     '#232323',
  cardSelected: '#2a2a2a',
  accent:       '#FFFC34',
  textPrimary:  '#ffffff',
  textSecondary:'#cccccc',
  textTertiary: '#aaaaaa',
  textMuted:    '#888888',
  textFaintest: '#666666',
  overlayDark:  'rgba(0,0,0,0.6)',
  overlayDarker:'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(255,255,255,0.2)',
  border:       '#2a2a2a',
  danger:       '#ff4444',
};

// ─── Palette light ───────────────────────────────────────────────────────────
export const lightColors = {
  background:   '#F5F5F0',
  card:         '#FFFFFF',
  cardDark:     '#EFEFEB',
  cardSelected: '#E8E8E3',
  accent:       '#FF6B6B',
  textPrimary:  '#111111',
  textSecondary:'#444444',
  textTertiary: '#666666',
  textMuted:    '#999999',
  textFaintest: '#BBBBBB',
  overlayDark:  'rgba(0,0,0,0.45)',
  overlayDarker:'rgba(0,0,0,0.55)',
  overlayLight: 'rgba(255,255,255,0.35)',
  border:       '#E0E0DA',
  danger:       '#e03333',
};

const STORAGE_KEY = '@theme_mode';
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // 'dark' | 'light' | null
  const [mode, setModeState] = useState('dark');
  const [loaded, setLoaded] = useState(false);

  // Chargement initial depuis AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        setModeState(saved);
      }
      setLoaded(true);
    });
  }, []);

  // Persistance à chaque changement
  const setMode = (newMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode);
  };

  const resolvedScheme =
    mode === 'system' ? (systemScheme ?? 'dark') : mode;

  const colors = resolvedScheme === 'light' ? lightColors : darkColors;
  const isDark  = resolvedScheme === 'dark';

  // Ne rend rien tant que le mode n'est pas chargé (évite le flash dark→light)
  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme doit être dans un ThemeProvider');
  return context;
};
