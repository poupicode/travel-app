import { useState, useEffect, useCallback } from 'react';
import { cities } from '../data/cities';
import { fetchDestinations } from '../services/destinationService';
import { getFavoriteIds, addFavorite, removeFavorite } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import useLocation from './useLocation';

const useFeedFilter = () => {
  const { user } = useAuth();
  const { locating, locationError, detectCity } = useLocation();

  // Données
  const [destinations, setDestinations] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // États de chargement / erreur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtres UI
  const [searchQuery,    setSearchQuery]   = useState('');
  const [selectedCity,  setSelectedCity]  = useState(cities[0]);
  const [locationActive, setLocationActive] = useState(false); // true dès que GPS ou ville manuelle choisie
  const [locatedCityName, setLocatedCityName] = useState(null);
  const [locatedCountry,  setLocatedCountry]  = useState(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState('All');

  // Chargement des destinations depuis Supabase
  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDestinations();
      setDestinations(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement des IDs favoris de l'utilisateur
  const loadFavoriteIds = useCallback(async () => {
    if (!user) return;
    try {
      const ids = await getFavoriteIds(user.id);
      setFavoriteIds(ids);
    } catch (e) {
      console.warn('Erreur favoris:', e.message);
    }
  }, [user]);

  useEffect(() => {
    loadDestinations();
    loadFavoriteIds();
  }, [loadDestinations, loadFavoriteIds]);

  /**
   * Déclenche la géolocalisation et met à jour la ville sélectionnée
   * si une correspondance est trouvée dans notre liste.
   * Retourne un message de feedback pour l'UI.
   */
  const locateMe = useCallback(async () => {
    const result = await detectCity();
    if (!result) return { success: false, error: locationError };

    const { matched, rawName, rawCountry } = result;

    // rawName = vrai nom GPS ("Lyon") — affiché dans le header
    if (rawName) setLocatedCityName(rawName);
    if (rawCountry) setLocatedCountry(rawCountry);
    if (matched) setSelectedCity(matched);
    setLocationActive(true);

    return { success: true, cityName: rawName ?? matched?.name };
  }, [detectCity, locationError]);

  // Toggle favori avec optimistic update
  const toggleFavorite = async (destinationId) => {
    if (!user) return;
    const isFav = favoriteIds.includes(destinationId);
    setFavoriteIds((prev) =>
      isFav ? prev.filter((id) => id !== destinationId) : [...prev, destinationId]
    );
    try {
      if (isFav) {
        await removeFavorite(user.id, destinationId);
      } else {
        await addFavorite(user.id, destinationId);
      }
    } catch (e) {
      // Rollback si erreur réseau
      setFavoriteIds((prev) =>
        isFav ? [...prev, destinationId] : prev.filter((id) => id !== destinationId)
      );
      console.warn('Erreur toggle favori:', e.message);
    }
  };

  // Destinations filtrées + triées par proximité de ville
  const filteredDestinations = (() => {
    let result = destinations;

    // Filtre texte : nom ou pays
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (dest) =>
          dest.name?.toLowerCase().includes(q) ||
          dest.location?.toLowerCase().includes(q)
      );
    }

    if (selectedContinent !== 'All') {
      result = result.filter((dest) => dest.continent === selectedContinent);
    }

    // Tri par proximité uniquement si une localisation a été activée
    if (!locationActive) return result;

    const country   = locatedCountry?.toLowerCase() ?? null;
    const continent = selectedCity.continent;

    return [...result].sort((a, b) => {
      const scoreA = country && a.location?.toLowerCase().includes(country) ? 2
        : a.continent === continent ? 1 : 0;
      const scoreB = country && b.location?.toLowerCase().includes(country) ? 2
        : b.continent === continent ? 1 : 0;
      return scoreB - scoreA;
    });
  })();

  const openCityModal  = () => setShowCityModal(true);
  const closeCityModal = () => setShowCityModal(false);
  const selectCity     = (city) => {
    setSelectedCity(city);
    setLocatedCityName(null);
    setLocatedCountry(null);
    setLocationActive(true);
    setShowCityModal(false);
  };

  return {
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
    reload: loadDestinations,
    // Géolocalisation
    locating,
    locateMe,
  };
};

export default useFeedFilter;
