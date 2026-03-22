import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getProfile } from '../services/authService';

const AuthContext = createContext(null);

/**
 * Fournit session, profil utilisateur et état de chargement à toute l'app.
 * Écoute les changements de session Supabase en temps réel.
 */
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charge le profil complet (avec rôle) à partir d'un userId
  const loadProfile = async (userId) => {
    try {
      const data = await getProfile(userId);
      setProfile(data);
    } catch (e) {
      console.warn('Erreur chargement profil:', e.message);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Récupère la session existante au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Écoute les changements auth (login, logout, refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Rafraîchit le profil depuis Supabase (utile après upgrade de rôle)
  const refreshProfile = async () => {
    if (session?.user) {
      await loadProfile(session.user.id);
    }
  };

  const value = {
    session,
    profile,
    loading,
    isAuthenticated: !!session,
    isGuide: profile?.role === 'guide',
    user: session?.user ?? null,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook pour accéder au contexte auth dans n'importe quel composant.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
