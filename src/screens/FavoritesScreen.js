import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useFavorites from '../hooks/useFavorites';
import BottomNav from '../components/feed/BottomNav';
import { useTheme } from '../context/ThemeContext';

const FavoritesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { favorites, loading, error, reload, remove } = useFavorites();

  const handleTabPress = (tab) => {
    if (tab === 'home')     navigation.navigate('Feed');
    if (tab === 'add')      navigation.navigate('CreateDestination');
    if (tab === 'calendar') navigation.navigate('Trips');
    if (tab === 'profile')  navigation.navigate('Settings');
  };

  const s = makeStyles(colors);

  const renderEmpty = () => (
    <View style={s.empty}>
      <Ionicons name="heart-outline" size={64} color={colors.textMuted} />
      <Text style={s.emptyTitle}>Aucun favori</Text>
      <Text style={s.emptySubtitle}>
        Appuie sur le ❤️ d'une destination pour la retrouver ici.
      </Text>
      <TouchableOpacity style={s.exploreButton} onPress={() => navigation.navigate('Feed')}>
        <Text style={s.exploreText}>Explorer les destinations</Text>
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
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={s.cardGradient}
      />
      {/* Infos */}
      <View style={s.cardInfo}>
        <View>
          <View style={s.locationRow}>
            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={s.location}>{item.location}</Text>
          </View>
          <Text style={s.name}>{item.name}</Text>
        </View>
        <View style={s.cardRight}>
          <Text style={s.price}>${item.price}</Text>
          <Text style={s.priceUnit}>/nuit</Text>
        </View>
      </View>
      {/* Bouton retirer */}
      <TouchableOpacity
        style={s.removeButton}
        onPress={() => remove(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="heart" size={20} color="#ff4d6d" />
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
          <Text style={s.errorText}>Impossible de charger les favoris</Text>
          <TouchableOpacity style={s.retryButton} onPress={reload}>
            <Text style={s.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.favoriteId}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          s.list,
          favorites.length === 0 && s.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Favorites</Text>
        {favorites.length > 0 && (
          <View style={s.countBadge}>
            <Text style={s.countText}>{favorites.length}</Text>
          </View>
        )}
      </View>

      {renderContent()}

      <BottomNav activeTab="explore" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

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
    height: 200,
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
    height: '60%',
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  removeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
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
  exploreButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginTop: 8,
  },
  exploreText: {
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

export default FavoritesScreen;
