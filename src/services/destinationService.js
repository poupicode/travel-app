import { supabase } from '../lib/supabase';

/**
 * Récupère toutes les destinations (triées par date de création).
 */
export const fetchDestinations = async () => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Récupère une destination par son ID.
 */
export const fetchDestinationById = async (id) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Récupère les destinations créées par un guide.
 */
export const fetchDestinationsByGuide = async (userId) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Crée une nouvelle destination (guides uniquement, contrôlé côté RLS).
 */
export const createDestination = async (userId, destination) => {
  const { data, error } = await supabase
    .from('destinations')
    .insert({
      created_by: userId,
      name: destination.name,
      location: destination.location,
      continent: destination.continent,
      rating: destination.rating,
      price: destination.price,
      image: destination.image,
      description: destination.description || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Met à jour une destination existante (guides, uniquement la leur).
 */
export const updateDestination = async (id, updates) => {
  const { data, error } = await supabase
    .from('destinations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Upload une image locale vers Supabase Storage (bucket "destination-images").
 * Retourne l'URL publique de l'image.
 *
 * Prérequis Supabase : créer un bucket public nommé "destination-images".
 */
/**
 * Upload une image vers Supabase Storage à partir de son contenu base64.
 * Le base64 vient directement d'expo-image-picker (option base64: true).
 *
 * @param {string} base64  - contenu base64 de l'image (sans préfixe data:...)
 * @param {string} rawExt  - extension du fichier ('jpg', 'png', etc.)
 */
export const uploadDestinationImage = async (base64, rawExt = 'jpg') => {
  console.log('[IMG] base64 length:', base64?.length ?? 0, '| ext:', rawExt);

  const MIME = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png',  webp: 'image/webp',
    gif: 'image/gif',  heic: 'image/jpeg', heif: 'image/jpeg',
  };
  const contentType = MIME[rawExt] || 'image/jpeg';
  const ext         = (rawExt === 'heic' || rawExt === 'heif') ? 'jpg' : rawExt;
  const filename    = `destination_${Date.now()}.${ext}`;
  const path        = `public/${filename}`;

  // base64 → Uint8Array (atob disponible globalement sur RN 0.74+ / Hermes)
  const binaryStr = atob(base64);
  const bytes     = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

  console.log('[IMG] Uploading to path:', path, '| contentType:', contentType);

  const { error } = await supabase.storage
    .from('destination-images')
    .upload(path, bytes, { contentType, upsert: false });

  if (error) {
    console.error('[IMG] Erreur Supabase upload:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('destination-images')
    .getPublicUrl(path);

  console.log('[IMG] URL publique:', urlData.publicUrl);
  return urlData.publicUrl;
};

/**
 * Supprime une destination (guides, uniquement la leur).
 */
export const deleteDestination = async (id) => {
  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
