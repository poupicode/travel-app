import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { cities } from '../data/cities';

/**
 * Tente de matcher la ville/pays détecté par le GPS
 * avec une entrée de notre liste de villes (pour le tri par continent).
 */
const matchCity = (geocode) => {
  if (!geocode) return null;

  const detectedCity    = geocode.city?.toLowerCase()    ?? '';
  const detectedCountry = geocode.country?.toLowerCase() ?? '';
  const detectedRegion  = geocode.region?.toLowerCase()  ?? '';

  const exactMatch = cities.find(
    (c) => c.name.toLowerCase() === detectedCity
  );
  if (exactMatch) return exactMatch;

  const partialMatch = cities.find(
    (c) =>
      detectedCity.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(detectedCity)
  );
  if (partialMatch) return partialMatch;

  // Fallback par pays → ville connue du même continent (pour le tri)
  const countryMap = {
    'france':        'Paris',
    'united states': 'New York',
    'usa':           'New York',
    'japan':         'Tokyo',
    'indonesia':     'Bali',
    'australia':     'Sydney',
    'brazil':        'São Paulo',
    'egypt':         'Cairo',
    'south africa':  'Cape Town',
    'spain':         'Barcelona',
    'germany':       'Berlin',
    'italy':         'Rome',
    'united kingdom':'London',
    'netherlands':   'Amsterdam',
    'portugal':      'Lisbon',
    'czech republic':'Prague',
    'thailand':      'Bangkok',
    'singapore':     'Singapore',
    'uae':           'Dubai',
    'united arab emirates': 'Dubai',
  };

  const countryKey = Object.keys(countryMap).find(
    (key) => detectedCountry.includes(key) || detectedRegion.includes(key)
  );
  if (countryKey) {
    return cities.find((c) => c.name === countryMap[countryKey]) ?? null;
  }

  return null;
};

const useLocation = () => {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const detectCity = useCallback(async () => {
    setLocating(true);
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Permission de localisation refusée. Active-la dans les réglages.');
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude:  position.coords.latitude,
        longitude: position.coords.longitude,
      });

      // Nom réel de la ville détectée (ex: "Lyon", "Lyon 3e Arrondissement"...)
      const rawName = geocode.city ?? geocode.subregion ?? geocode.region ?? geocode.country ?? null;

      // Pays détecté en anglais (ex: "France", "Greece"…) — pour le tri par pays
      const rawCountry = geocode.country ?? null;

      // Ville de la liste la plus proche (pour le tri par continent)
      const matched = matchCity(geocode);

      return { matched, rawName, rawCountry };

    } catch (e) {
      setLocationError('Impossible de récupérer ta position. Vérifie ta connexion.');
      return null;
    } finally {
      setLocating(false);
    }
  }, []);

  return {
    locating,
    locationError,
    detectCity,
  };
};

export default useLocation;
