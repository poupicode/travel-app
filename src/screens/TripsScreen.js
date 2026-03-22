import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import useTrips from '../hooks/useTrips';
import useGuideDestinations from '../hooks/useGuideDestinations';
import BottomNav from '../components/feed/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/* ─────────────────────────── TRAVELER VIEW ─────────────────────────── */

const TravelerTrips = ({ navigation, colors }) => {
  const { trips, loading, error, reload, remove } = useTrips();
  const s = makeStyles(colors);

  useFocusEffect(
    useCallback(() => { reload(); }, [reload])
  );

  const handleTabPress = (tab) => {
    if (tab === 'home')    navigation.navigate('Feed');
    if (tab === 'explore') navigation.navigate('Favorites');
    if (tab === 'profile') navigation.navigate('Settings');
  };

  const handleRemove = (item) => {
    Alert.alert(
      'Annuler ce voyage ?',
      `Retirer ${item.name} de tes voyages planifiés ?`,
      [
        { text: 'Garder', style: 'cancel' },
        { text: 'Annuler le voyage', style: 'destructive', onPress: () => remove(item.id) },
      ]
    );
  };

  const renderEmpty = () => (
    <View style={s.empty}>
      <Ionicons name="calendar-outline" size={64} color={colors.textMuted} />
      <Text style={s.emptyTitle}>Aucun voyage planifié</Text>
      <Text style={s.emptySubtitle}>
        Appuie sur "Book Now" depuis une destination pour l'ajouter ici.
      </Text>
      <TouchableOpacity style={s.actionButton} onPress={() => navigation.navigate('Feed')}>
        <Text style={s.actionButtonText}>Explorer les destinations</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => navigation.navigate('Detail', { destination: item })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={s.cardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={s.cardGradient}
      />
      <View style={s.plannedBadge}>
        <Ionicons name="checkmark-circle" size={13} color={colors.background} />
        <Text style={s.plannedText}>Planifié</Text>
      </View>
      <View style={s.cardInfo}>
        <View style={s.cardInfoLeft}>
          <View style={s.locationRow}>
            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={s.location}>{item.location}</Text>
          </View>
          <Text style={s.name}>{item.name}</Text>
          <View style={s.dateRow}>
            <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={s.dateText}>Ajouté le {formatDate(item.booked_at)}</Text>
          </View>
        </View>
        <View style={s.cardRight}>
          <Text style={s.price}>${item.price}</Text>
          <Text style={s.priceUnit}>/nuit</Text>
        </View>
      </View>
      <TouchableOpacity
        style={s.removeButton}
        onPress={() => handleRemove(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={18} color="#ffffff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
          <Text style={s.errorText}>Impossible de charger les voyages</Text>
          <TouchableOpacity style={s.retryButton} onPress={reload}>
            <Text style={s.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <FlatList
        data={trips}
        renderItem={renderItem}
        keyExtractor={(item) => item.tripId}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[s.list, trips.length === 0 && s.listEmpty]}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>My Trips</Text>
        {trips.length > 0 && (
          <View style={s.countBadge}>
            <Text style={s.countText}>{trips.length}</Text>
          </View>
        )}
      </View>
      {renderContent()}
      <BottomNav activeTab="calendar" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

/* ──────────────────────────── GUIDE VIEW ───────────────────────────── */

const GuideDestinations = ({ navigation, colors }) => {
  const { destinations, loading, error, reload, remove } = useGuideDestinations();
  const s = makeStyles(colors);

  // Recharge la liste à chaque fois que l'écran reprend le focus
  // (ex : retour depuis CreateDestinationScreen après création / modif)
  useFocusEffect(
    useCallback(() => { reload(); }, [reload])
  );

  const handleTabPress = (tab) => {
    if (tab === 'home')    navigation.navigate('Feed');
    if (tab === 'add')     navigation.navigate('CreateDestination');
    if (tab === 'profile') navigation.navigate('Settings');
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Supprimer cette destination ?',
      `"${item.name}" sera définitivement supprimée.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => remove(item.id) },
      ]
    );
  };

  const renderEmpty = () => (
    <View style={s.empty}>
      <Ionicons name="globe-outline" size={64} color={colors.textMuted} />
      <Text style={s.emptyTitle}>Aucune destination</Text>
      <Text style={s.emptySubtitle}>
        Crée ta première destination pour qu'elle apparaisse dans le feed.
      </Text>
      <TouchableOpacity
        style={s.actionButton}
        onPress={() => navigation.navigate('CreateDestination')}
      >
        <Text style={s.actionButtonText}>Créer une destination</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => navigation.navigate('Detail', { destination: item })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={s.cardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={s.cardGradient}
      />
      <View style={s.cardInfo}>
        <View style={s.cardInfoLeft}>
          <View style={s.locationRow}>
            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={s.location}>{item.location}</Text>
          </View>
          <Text style={s.name}>{item.name}</Text>
          <View style={s.dateRow}>
            <Ionicons name="star" size={12} color={colors.accent} />
            <Text style={s.dateText}>{item.rating} · {item.continent}</Text>
          </View>
        </View>
        <View style={s.cardRight}>
          <Text style={s.price}>${item.price}</Text>
          <Text style={s.priceUnit}>/nuit</Text>
        </View>
      </View>

      {/* Edit button */}
      <TouchableOpacity
        style={s.editButton}
        onPress={() => navigation.navigate('CreateDestination', { destination: item })}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="pencil" size={16} color="#ffffff" />
      </TouchableOpacity>

      {/* Delete button */}
      <TouchableOpacity
        style={s.removeButton}
        onPress={() => handleDelete(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={16} color="#ffffff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
    return (
      <FlatList
        data={destinations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[s.list, destinations.length === 0 && s.listEmpty]}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Mes destinations</Text>
        {destinations.length > 0 && (
          <View style={s.countBadge}>
            <Text style={s.countText}>{destinations.length}</Text>
          </View>
        )}
      </View>
      {renderContent()}
      <BottomNav activeTab="calendar" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

/* ───────────────────────────── SCREEN ─────────────────────────────── */

const TripsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { isGuide } = useAuth();

  if (isGuide) {
    return <GuideDestinations navigation={navigation} colors={colors} />;
  }
  return <TravelerTrips navigation={navigation} colors={colors} />;
};

/* ────────────────────────────── STYLES ─────────────────────────────── */

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  countBadge: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.background,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  listEmpty: {
    flex: 1,
  },
  card: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.card,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  plannedBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  plannedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.background,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  cardInfoLeft: {
    flex: 1,
    gap: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
  },
  priceUnit: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  editButton: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginTop: 8,
  },
  actionButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
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

export default TripsScreen;
