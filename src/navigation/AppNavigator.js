import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Screens
import OnboardingScreen        from '../screens/OnboardingScreen';
import LoginScreen             from '../screens/LoginScreen';
import RegisterScreen          from '../screens/RegisterScreen';
import FeedScreen              from '../screens/FeedScreen';
import FavoritesScreen         from '../screens/FavoritesScreen';
import TripsScreen             from '../screens/TripsScreen';
import DetailScreen            from '../screens/DetailScreen';
import SettingsScreen          from '../screens/SettingsScreen';
import CreateDestinationScreen from '../screens/CreateDestinationScreen';

const Stack = createNativeStackNavigator();

// Navigateur non authentifié : Onboarding → Login → Register
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login"      component={LoginScreen} />
    <Stack.Screen name="Register"   component={RegisterScreen} />
  </Stack.Navigator>
);

// Navigateur authentifié
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* Écrans "onglets" : pas d'animation pour un effet tab natif */}
    <Stack.Screen name="Feed"      component={FeedScreen}      options={{ animation: 'none' }} />
    <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ animation: 'none' }} />
    <Stack.Screen name="Trips"     component={TripsScreen}     options={{ animation: 'none' }} />
    <Stack.Screen name="Settings"  component={SettingsScreen}  options={{ animation: 'none' }} />
    {/* Écran detail : push classique */}
    <Stack.Screen name="Detail"            component={DetailScreen}            options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name="CreateDestination" component={CreateDestinationScreen} options={{ animation: 'slide_from_bottom' }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
