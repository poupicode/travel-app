import React from 'react';
import {
  View, StyleSheet, ScrollView,
  ActivityIndicator, Text, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useFeedFilter from '../hooks/useFeedFilter';
import { continents } from '../data/continents';
import { cities } from '../data/cities';
import FeedHeader       from '../components/feed/FeedHeader';
import SearchBar        from '../components/feed/SearchBar';
import ContinentFilter  from '../components/feed/ContinentFilter';
import SectionHeader    from '../components/common/SectionHeader';
import DestinationCard  from '../components/feed/DestinationCard';
import BottomNav        from '../components/feed/BottomNav';
import CityModal        from '../components/feed/CityModal';
import { useTheme } from '../context/ThemeContext';

const FeedScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const {
    filteredDestinations,
    favoriteIds,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCity,
    locationActive,
    locatedCityName,
    showCityModal,
    selectedContinent,
    openCityModal,
    closeCityModal,
    selectCity,
    setSelectedContinent,
    toggleFavorite,
    reload,
    locating,
    locateMe,
  } = useFeedFilter();

  const handleTabPress = (tab) => {
    if (tab === 'explore')  navigation.navigate('Favorites');
    if (tab === 'add')      navigation.navigate('CreateDestination');
    if (tab === 'calendar') navigation.navigate('Trips');
    if (tab === 'profile')  navigation.navigate('Settings');
  };

  const handleLocateMe = async () => {
    const result = await locateMe();
    if (result.success) {
      Alert.alert('Localisation détectée', `Position mise à jour : ${result.cityName}`);
    } else {
      Alert.alert(
        'Localisation indisponible',
        result.error ?? 'Impossible de détecter ta position.',
        [{ text: 'OK' }]
      );
    }
  };

  const s = makeStyles(colors);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={s.centered}>
          <Text style={s.errorText}>Impossible de charger les destinations</Text>
          <TouchableOpacity style={s.retryButton} onPress={reload}>
            <Text style={s.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (filteredDestinations.length === 0) {
      return (
        <View style={s.centered}>
          <Text style={s.emptyText}>Aucune destination trouvée</Text>
        </View>
      );
    }
    return (
      <View style={s.cardsContainer}>
        {filteredDestinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            isFavorite={favoriteIds.includes(destination.id)}
            onPress={() => navigation.navigate('Detail', { destination })}
            onFavoritePress={() => toggleFavorite(destination.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
        <FeedHeader
          cityName={locationActive ? (locatedCityName ?? selectedCity.name) : null}
          onCityPress={openCityModal}
          onLocateMe={handleLocateMe}
          locating={locating}
        />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <ContinentFilter
          continents={continents}
          selectedContinent={selectedContinent}
          onSelect={setSelectedContinent}
        />
        <SectionHeader title="Popular Destination" />
        {renderContent()}
        <View style={s.bottomSpacer} />
      </ScrollView>

      <BottomNav activeTab="home" onTabPress={handleTabPress} />

      <CityModal
        visible={showCityModal}
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={selectCity}
        onClose={closeCityModal}
      />
    </SafeAreaView>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  bottomSpacer: {
    height: 100,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  retryText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default FeedScreen;
