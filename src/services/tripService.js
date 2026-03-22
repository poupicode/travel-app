import { supabase } from '../lib/supabase';

/**
 * Récupère tous les voyages de l'utilisateur avec les détails des destinations.
 */
export const getTrips = async (userId) => {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      id,
      notes,
      booked_at,
      destination_id,
      destinations (
        id, name, location, continent, rating, price, image, description
      )
    `)
    .eq('user_id', userId)
    .order('booked_at', { ascending: false });
  if (error) throw error;
  return data.map((trip) => ({
    tripId: trip.id,
    notes: trip.notes,
    booked_at: trip.booked_at,
    ...trip.destinations,
  }));
};

/**
 * Vérifie si une destination est déjà bookée par l'utilisateur.
 */
export const getTripIds = async (userId) => {
  const { data, error } = await supabase
    .from('trips')
    .select('destination_id')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map((t) => t.destination_id);
};

/**
 * Ajoute un voyage (book now).
 */
export const addTrip = async (userId, destinationId, notes = null) => {
  const { data, error } = await supabase
    .from('trips')
    .insert({ user_id: userId, destination_id: destinationId, notes })
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Supprime un voyage.
 */
export const removeTrip = async (userId, destinationId) => {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('user_id', userId)
    .eq('destination_id', destinationId);
  if (error) throw error;
};
