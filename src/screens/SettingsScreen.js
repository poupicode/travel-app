import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signOut, upgradeToGuide } from '../services/authService';
import BottomNav from '../components/feed/BottomNav';

const THEME_OPTIONS = [
  { value: 'dark',   label: 'Dark',   icon: 'moon' },
  { value: 'light',  label: 'Light',  icon: 'sunny' },
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

const SettingsScreen = ({ navigation }) => {
  const { user, profile, isGuide, refreshProfile } = useAuth();
  const { colors, mode, setMode } = useTheme();
  const [guideCode, setGuideCode]       = useState('');
  const [codeLoading, setCodeLoading]   = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleTabPress = (tab) => {
    if (tab === 'home')     navigation.navigate('Feed');
    if (tab === 'explore')  navigation.navigate('Favorites');
    if (tab === 'add')      navigation.navigate('CreateDestination');
    if (tab === 'calendar') navigation.navigate('Trips');
  };

  const handleUpgradeRole = async () => {
    if (!guideCode.trim()) {
      Alert.alert('Code requis', 'Entre le code guide pour changer de rôle.');
      return;
    }
    setCodeLoading(true);
    try {
      await upgradeToGuide(user.id, guideCode.trim());
      await refreshProfile();
      setGuideCode('');
      Alert.alert('Rôle mis à jour !', 'Tu es maintenant un guide. Tu peux publier des destinations.');
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Tu vas être déconnecté de ton compte.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            setSignOutLoading(true);
            try {
              await signOut();
            } catch (e) {
              Alert.alert('Erreur', e.message);
              setSignOutLoading(false);
            }
          },
        },
      ]
    );
  };

  const s = makeStyles(colors);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.title}>Account</Text>
        </View>

        {/* ── Profil card ── */}
        <View style={s.card}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>
              {profile?.username?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
          <View style={s.userInfo}>
            <Text style={s.username}>{profile?.username ?? '—'}</Text>
            <Text style={s.email}>{user?.email ?? '—'}</Text>
          </View>
          <View style={[s.roleBadge, isGuide && s.roleBadgeGuide]}>
            <Ionicons
              name={isGuide ? 'shield-checkmark' : 'person'}
              size={12}
              color={isGuide ? colors.background : colors.textMuted}
            />
            <Text style={[s.roleText, isGuide && s.roleTextGuide]}>
              {isGuide ? 'Guide' : 'Traveler'}
            </Text>
          </View>
        </View>

        {/* ── Apparence — sélecteur de thème ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Apparence</Text>
          <View style={s.themeRow}>
            {THEME_OPTIONS.map((opt) => {
              const active = mode === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[s.themeOption, active && s.themeOptionActive]}
                  onPress={() => setMode(opt.value)}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={active ? colors.background : colors.textMuted}
                  />
                  <Text style={[s.themeLabel, active && s.themeLabelActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Become a Guide ── */}
        {!isGuide && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Become a Guide</Text>
            <Text style={s.sectionSubtitle}>
              Entre le code guide pour pouvoir publier des destinations.
            </Text>
            <View style={s.codeRow}>
              <View style={s.codeInputWrapper}>
                <Ionicons name="key-outline" size={18} color={colors.textMuted} style={s.codeIcon} />
                <TextInput
                  style={s.codeInput}
                  placeholder="Code guide"
                  placeholderTextColor={colors.textFaintest}
                  value={guideCode}
                  onChangeText={setGuideCode}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
              <TouchableOpacity
                style={[s.codeButton, codeLoading && s.buttonDisabled]}
                onPress={handleUpgradeRole}
                disabled={codeLoading}
                activeOpacity={0.8}
              >
                {codeLoading ? (
                  <ActivityIndicator color={colors.background} size="small" />
                ) : (
                  <Text style={s.codeButtonText}>Valider</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Guide confirmé ── */}
        {isGuide && (
          <View style={s.section}>
            <View style={s.guideConfirm}>
              <Ionicons name="shield-checkmark" size={20} color={colors.accent} />
              <Text style={s.guideConfirmText}>
                Tu es guide — tu peux publier et gérer des destinations.
              </Text>
            </View>
          </View>
        )}

        <View style={s.separator} />

        {/* ── Sign out ── */}
        <TouchableOpacity
          style={[s.signOutButton, signOutLoading && s.buttonDisabled]}
          onPress={handleSignOut}
          disabled={signOutLoading}
          activeOpacity={0.8}
        >
          {signOutLoading ? (
            <ActivityIndicator color={colors.danger} size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} />
              <Text style={s.signOutText}>Se déconnecter</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={s.bottomSpacer} />
      </ScrollView>

      <BottomNav activeTab="profile" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  // ── Profil ──
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.background,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 13,
    color: colors.textMuted,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cardDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeGuide: {
    backgroundColor: colors.accent,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  roleTextGuide: {
    color: colors.background,
  },
  // ── Sections ──
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  // ── Thème ──
  themeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeOptionActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  themeLabelActive: {
    color: colors.background,
  },
  // ── Guide ──
  codeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  codeInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  codeIcon: {
    marginRight: 10,
  },
  codeInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    letterSpacing: 1,
  },
  codeButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.background,
  },
  guideConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
  },
  guideConfirmText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // ── Sign out ──
  separator: {
    height: 1,
    backgroundColor: colors.card,
    marginBottom: 24,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 16,
    height: 54,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.danger,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  bottomSpacer: {
    height: 110,
  },
});

export default SettingsScreen;
