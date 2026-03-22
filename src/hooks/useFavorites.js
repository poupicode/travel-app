import { useState, useEffect, useCallback } from 'react';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';

const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFavorites(user.id);
      setFavorites(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const remove = async (destinationId) => {
    // Optimistic update
    setFavorites((prev) => prev.filter((f) => f.id !== destinationId));
    try {
      await removeFavorite(user.id, destinationId);
    } catch (e) {
      console.warn('Erreur suppression favori:', e.message);
      load(); // rollback complet
    }
  };

  return { favorites, loading, error, reload: load, remove };
};

export default useFavorites;
