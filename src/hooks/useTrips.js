import { useState, useEffect, useCallback } from 'react';
import { getTrips, getTripIds, addTrip, removeTrip } from '../services/tripService';
import { useAuth } from '../context/AuthContext';

const useTrips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [tripIds, setTripIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [data, ids] = await Promise.all([
        getTrips(user.id),
        getTripIds(user.id),
      ]);
      setTrips(data);
      setTripIds(ids);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  /**
   * Ajoute ou retire un voyage (toggle).
   * Optimistic update immédiat.
   */
  const toggleTrip = async (destination) => {
    if (!user) return;
    const isBooked = tripIds.includes(destination.id);

    // Optimistic
    if (isBooked) {
      setTripIds((prev) => prev.filter((id) => id !== destination.id));
      setTrips((prev) => prev.filter((t) => t.id !== destination.id));
    } else {
      setTripIds((prev) => [...prev, destination.id]);
    }

    try {
      if (isBooked) {
        await removeTrip(user.id, destination.id);
      } else {
        await addTrip(user.id, destination.id);
        // Reload pour avoir les données complètes
        await load();
      }
    } catch (e) {
      console.warn('Erreur toggle trip:', e.message);
      load(); // rollback
    }
  };

  const remove = async (destinationId) => {
    setTripIds((prev) => prev.filter((id) => id !== destinationId));
    setTrips((prev) => prev.filter((t) => t.id !== destinationId));
    try {
      await removeTrip(user.id, destinationId);
    } catch (e) {
      console.warn('Erreur suppression trip:', e.message);
      load();
    }
  };

  return {
    trips,
    tripIds,
    loading,
    error,
    reload: load,
    toggleTrip,
    remove,
    isBooked: (id) => tripIds.includes(id),
  };
};

export default useTrips;
