import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DetailHeader      from '../components/detail/DetailHeader';
import HeroImage         from '../components/detail/HeroImage';
import AuthorRow         from '../components/detail/AuthorRow';
import ActionTags        from '../components/detail/ActionTags';
import ScheduleOverview  from '../components/detail/ScheduleOverview';
import DetailBottomBar   from '../components/detail/DetailBottomBar';
import { useAuth }       from '../context/AuthContext';
import { getTripIds, addTrip, removeTrip } from '../services/tripService';
import { deleteDestination } from '../services/destinationService';
import { useTheme }      from '../context/ThemeContext';
import { supabase }      from '../lib/supabase';

const DEFAULT_DESTINATION = {
  name: 'Manarola',
  location: 'Italy',
  rating: 4.9,
  price: 999,
  image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
};

const DetailScreen = ({ navigation, route }) => {
  const { destination } = route.params || { destination: DEFAULT_DESTINATION };
  const { user, isGuide } = useAuth();
  const { colors } = useTheme();

  // Le guide peut modifier/supprimer seulement ses propres destinations
  const isOwner = isGuide && user && destination.created_by === user.id;

  const [isBooked, setIsBooked] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [authorName, setAuthorName] = useState(null);

  // Vérifie si ce voyage est déjà booké au chargement
  useEffect(() => {
    if (!user || !destination.id) return;
    getTripIds(user.id).then((ids) => {
      setIsBooked(ids.includes(destination.id));
    });
  }, [user, destination.id]);

  // Récupère le profil du guide créateur
  useEffect(() => {
    if (!destination.created_by) return;
    supabase
      .from('profiles')
      .select('username')
      .eq('id', destination.created_by)
      .single()
      .then(({ data }) => {
        if (data?.username) setAuthorName(data.username);
      });
  }, [destination.created_by]);

  const handleGuideMenu = () => {
    Alert.alert(
      destination.name,
      'Que veux-tu faire avec cette destination ?',
      [
        {
          text: '✏️  Modifier',
          onPress: () => navigation.navigate('CreateDestination', { destination }),
        },
        {
          text: '🗑️  Supprimer',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Supprimer cette destination ?',
              `"${destination.name}" sera définitivement supprimée.`,
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Supprimer',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteDestination(destination.id);
                      navigation.goBack();
                    } catch (e) {
                      Alert.alert('Erreur', e.message);
                    }
                  },
                },
              ]
            ),
        },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleBookNow = async () => {
    if (!user) return;
    if (isBooked) {
      // Confirmation avant d'annuler
      Alert.alert(
        'Annuler ce voyage ?',
        `Retirer ${destination.name} de tes voyages planifiés ?`,
        [
          { text: 'Garder', style: 'cancel' },
          {
            text: 'Annuler le voyage',
            style: 'destructive',
            onPress: async () => {
              setBookLoading(true);
              try {
                await removeTrip(user.id, destination.id);
                setIsBooked(false);
                Alert.alert('Voyage annulé', `${destination.name} a été retiré de tes voyages.`);
              } catch (e) {
                Alert.alert('Erreur', e.message);
              } finally {
                setBookLoading(false);
              }
            },
          },
        ]
      );
    } else {
      setBookLoading(true);
      try {
        await addTrip(user.id, destination.id);
        setIsBooked(true);
        Alert.alert(
          'Voyage planifié ! ✈️',
          `${destination.name} a été ajouté à tes voyages.`,
          [
            { text: 'Voir mes voyages', onPress: () => navigation.navigate('Trips') },
            { text: 'Continuer', style: 'cancel' },
          ]
        );
      } catch (e) {
        // Déjà booké (UNIQUE constraint) → on sync l'état
        if (e.code === '23505') {
          setIsBooked(true);
        } else {
          Alert.alert('Erreur', e.message);
        }
      } finally {
        setBookLoading(false);
      }
    }
  };

  const s = makeStyles(colors);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
        <DetailHeader
          onBack={() => navigation.goBack()}
          onMenu={isOwner ? handleGuideMenu : undefined}
        />
        <HeroImage
          imageUri={destination.image}
          location={destination.location}
          name={destination.name}
          price={destination.price}
        />
        <AuthorRow authorName={authorName} rating={destination.rating} />
        <View style={s.infoBox}>
          <ActionTags />
          <ScheduleOverview
            destinationName={destination.name}
            locationName={destination.location}
          />
        </View>
        <View style={s.bottomSpacer} />
      </ScrollView>

      <DetailBottomBar
        isBooked={isBooked}
        loading={bookLoading}
        onBook={handleBookNow}
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
  infoBox: {
    marginHorizontal: 20,
    backgroundColor: colors.cardDark,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default DetailScreen;
