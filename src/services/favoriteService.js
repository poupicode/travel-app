import { supabase } from '../lib/supabase';

/**
 * Récupère tous les favoris de l'utilisateur, avec les détails des destinations.
 */
export const getFavorites = async (userId) => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      id,
      created_at,
      destination_id,
      destinations (
        id, name, location, continent, rating, price, image, description
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  // Aplatit la structure pour renvoyer directement les destinations
  return data.map((fav) => ({
    favoriteId: fav.id,
    ...fav.destinations,
  }));
};

/**
 * Récupère les IDs des destinations favorites de l'utilisateur (pour savoir quels cœurs colorier).
 */
export const getFavoriteIds = async (userId) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('destination_id')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map((fav) => fav.destination_id);
};

/**
 * Ajoute une destination en favori.
 */
export const addFavorite = async (userId, destinationId) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, destination_id: destinationId })
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Retire une destination des favoris.
 */
export const removeFavorite = async (userId, destinationId) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('destination_id', destinationId);
  if (error) throw error;
};
