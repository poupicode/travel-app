import { supabase } from '../lib/supabase';

/**
 * Inscrit un nouvel utilisateur.
 * Le trigger Supabase crée automatiquement le profil après l'inscription.
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

/**
 * Connecte un utilisateur existant.
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

/**
 * Déconnecte l'utilisateur courant.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Récupère la session active (si elle existe).
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

/**
 * Récupère le profil complet de l'utilisateur connecté (avec son rôle).
 */
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Change le rôle de l'utilisateur si le code est correct.
 * Code valide : "GUIDE2026"
 */
export const upgradeToGuide = async (userId, code) => {
  if (code.trim().toUpperCase() !== 'GUIDE2026') {
    throw new Error('Code invalide');
  }
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'guide' })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
