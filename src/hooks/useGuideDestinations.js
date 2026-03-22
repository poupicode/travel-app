import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchDestinationsByGuide,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../services/destinationService';

const useGuideDestinations = () => {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDestinationsByGuide(user.id);
      setDestinations(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (destination) => {
    const data = await createDestination(user.id, destination);
    setDestinations((prev) => [data, ...prev]);
    return data;
  }, [user]);

  const update = useCallback(async (id, updates) => {
    const data = await updateDestination(id, updates);
    setDestinations((prev) => prev.map((d) => (d.id === id ? data : d)));
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteDestination(id);
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { destinations, loading, error, reload: load, add, update, remove };
};

export default useGuideDestinations;
