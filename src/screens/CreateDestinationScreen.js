import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Image,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  createDestination,
  updateDestination,
  uploadDestinationImage,
} from '../services/destinationService';
import { geocodePlace } from '../utils/geocode';
import { continents } from '../data/continents';

const CONTINENT_OPTIONS = continents.filter((c) => c.name !== 'All');

const CreateDestinationScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const editDest = route.params?.destination ?? null;
  const isEdit   = !!editDest;

  const [form, setForm] = useState({
    name:        editDest?.name        ?? '',
    location:    editDest?.location    ?? '',
    continent:   editDest?.continent   ?? CONTINENT_OPTIONS[0]?.name ?? '',
    price:       editDest?.price?.toString()  ?? '',
    rating:      editDest?.rating?.toString() ?? '',
    description: editDest?.description ?? '',
  });

  // Image depuis la galerie
  const [imageUri,    setImageUri]    = useState(null);   // aperçu local
  const [imageBase64, setImageBase64] = useState(null);   // contenu brut pour upload
  const [imageExt,    setImageExt]    = useState('jpg');  // extension fichier
  // Image via URL (fallback)
  const [imageUrl,  setImageUrl]  = useState(editDest?.image ?? '');
  const [showUrlInput, setShowUrlInput] = useState(!editDest?.image && !editDest);

  const [saving,    setSaving]    = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ─── Geocoding ─── */
  const handleGeocode = async () => {
    if (!form.name.trim()) {
      Alert.alert('Nom requis', 'Entre d\'abord le nom de la destination.');
      return;
    }
    setGeocoding(true);
    try {
      const result = await geocodePlace(form.name);
      if (!result) {
        Alert.alert('Introuvable', 'Aucun résultat pour ce nom. Remplis manuellement.');
        return;
      }
      if (result.country)   setField('location', result.country);
      if (result.continent) setField('continent', result.continent);
    } catch {
      Alert.alert('Erreur', 'Impossible de récupérer les infos de localisation.');
    } finally {
      setGeocoding(false);
    }
  };

  /* ─── Image picker ─── */
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorise l\'accès à ta galerie dans les réglages.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      base64: true,   // récupère le contenu base64 directement (évite FileSystem)
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64 ?? null);
      // extension depuis l'URI
      const ext = asset.uri.split('.').pop()?.split('?')[0]?.toLowerCase() || 'jpg';
      setImageExt(ext);
      setShowUrlInput(false);
    }
  };

  /* ─── Current preview URI ─── */
  const previewUri = imageUri ?? (imageUrl.trim() ? imageUrl.trim() : null);

  /* ─── Save ─── */
  const handleSave = async () => {
    const { name, location, continent, price, rating } = form;
    const finalImageSrc = imageBase64 ?? imageUrl.trim();

    if (!name.trim() || !location.trim() || !continent || !price || !rating || !finalImageSrc) {
      Alert.alert('Champs manquants', 'Remplis tous les champs obligatoires (*).');
      return;
    }
    const parsedPrice  = parseFloat(price);
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Prix invalide', 'Entre un prix valide (ex: 120).');
      return;
    }
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      Alert.alert('Note invalide', 'La note doit être entre 0 et 5.');
      return;
    }

    setSaving(true);
    try {
      console.log('[SAVE] imageBase64 length:', imageBase64?.length ?? 0);
      console.log('[SAVE] imageUrl:', imageUrl || '(vide)');

      let finalImage = imageUrl.trim();
      if (imageBase64) {
        // Upload base64 → Supabase Storage (pas de FileSystem, base64 vient du picker)
        finalImage = await uploadDestinationImage(imageBase64, imageExt);
      }

      console.log('[SAVE] finalImage envoyé en DB:', finalImage || '⚠️ VIDE');

      const payload = {
        name:        name.trim(),
        location:    location.trim(),
        continent,
        price:       parsedPrice,
        rating:      parsedRating,
        image:       finalImage,
        description: form.description.trim() || null,
      };

      if (isEdit) {
        await updateDestination(editDest.id, payload);
      } else {
        await createDestination(user.id, payload);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', e.message ?? 'Impossible de sauvegarder.');
    } finally {
      setSaving(false);
    }
  };

  const s = makeStyles(colors);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>
            {isEdit ? 'Modifier la destination' : 'Nouvelle destination'}
          </Text>
          <View style={s.headerRight} />
        </View>

        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Image ── */}
          <Text style={s.label}>Image *</Text>
          <TouchableOpacity style={s.imagePicker} onPress={handlePickImage} activeOpacity={0.8}>
            {previewUri ? (
              <>
                <Image source={{ uri: previewUri }} style={s.imagePreview} />
                <View style={s.imageOverlay}>
                  <Ionicons name="camera" size={22} color="#fff" />
                  <Text style={s.imageOverlayText}>Changer</Text>
                </View>
              </>
            ) : (
              <View style={s.imagePlaceholder}>
                <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                <Text style={s.imagePlaceholderText}>Choisir depuis la galerie</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={s.urlToggle}
            onPress={() => setShowUrlInput((v) => !v)}
          >
            <Ionicons
              name={showUrlInput ? 'chevron-up' : 'link-outline'}
              size={14}
              color={colors.accent}
            />
            <Text style={s.urlToggleText}>
              {showUrlInput ? 'Masquer le lien' : 'Ou coller un lien image'}
            </Text>
          </TouchableOpacity>

          {showUrlInput && (
            <TextInput
              style={[s.input, { marginTop: 8 }]}
              value={imageUrl}
              onChangeText={(v) => { setImageUrl(v); if (v) setImageUri(null); }}
              placeholder="https://..."
              placeholderTextColor={colors.textMuted}
              color={colors.textPrimary}
              autoCapitalize="none"
              keyboardType="url"
            />
          )}

          {/* ── Nom + geocode ── */}
          <Text style={s.label}>Nom de la destination *</Text>
          <View style={s.inputRow}>
            <TextInput
              style={[s.input, s.inputFlex]}
              value={form.name}
              onChangeText={(v) => setField('name', v)}
              placeholder="Ex: Santorini"
              placeholderTextColor={colors.textMuted}
              color={colors.textPrimary}
            />
            <TouchableOpacity
              style={s.geocodeButton}
              onPress={handleGeocode}
              disabled={geocoding}
              activeOpacity={0.8}
            >
              {geocoding
                ? <ActivityIndicator size="small" color={colors.background} />
                : <Ionicons name="search" size={18} color={colors.background} />
              }
            </TouchableOpacity>
          </View>
          <Text style={s.hint}>Appuie sur 🔍 pour détecter pays et continent automatiquement</Text>

          {/* ── Localisation (pays) ── */}
          <Text style={s.label}>Pays *</Text>
          <TextInput
            style={s.input}
            value={form.location}
            onChangeText={(v) => setField('location', v)}
            placeholder="Ex: Greece"
            placeholderTextColor={colors.textMuted}
            color={colors.textPrimary}
          />

          {/* ── Continent ── */}
          <Text style={s.label}>Continent *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.chipsScroll}
            contentContainerStyle={s.chipsContent}
          >
            {CONTINENT_OPTIONS.map((c) => {
              const active = form.continent === c.name;
              return (
                <TouchableOpacity
                  key={c.name}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => setField('continent', c.name)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.chipText, active && s.chipTextActive]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Prix ── */}
          <Text style={s.label}>Prix / nuit ($) *</Text>
          <TextInput
            style={s.input}
            value={form.price}
            onChangeText={(v) => setField('price', v)}
            placeholder="Ex: 120"
            placeholderTextColor={colors.textMuted}
            color={colors.textPrimary}
            keyboardType="decimal-pad"
          />

          {/* ── Note ── */}
          <Text style={s.label}>Note (0 – 5) *</Text>
          <TextInput
            style={s.input}
            value={form.rating}
            onChangeText={(v) => setField('rating', v)}
            placeholder="Ex: 4.7"
            placeholderTextColor={colors.textMuted}
            color={colors.textPrimary}
            keyboardType="decimal-pad"
          />

          {/* ── Description ── */}
          <Text style={s.label}>Description</Text>
          <TextInput
            style={[s.input, s.textarea]}
            value={form.description}
            onChangeText={(v) => setField('description', v)}
            placeholder="Décris cette destination..."
            placeholderTextColor={colors.textMuted}
            color={colors.textPrimary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* ── Save ── */}
          <TouchableOpacity
            style={[s.saveButton, saving && s.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={s.saveText}>
                {isEdit ? 'Enregistrer les modifications' : 'Créer la destination'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={s.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 8,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputFlex: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 0,
  },
  geocodeButton: {
    width: 52,
    backgroundColor: colors.accent,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
  },
  textarea: {
    minHeight: 100,
    paddingTop: 14,
  },
  // ── Image ──
  imagePicker: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imageOverlayText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  imagePlaceholderText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  urlToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  urlToggleText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
  },
  // ── Continent chips ──
  chipsScroll: {
    flexGrow: 0,
  },
  chipsContent: {
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.background,
  },
  // ── Save ──
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default CreateDestinationScreen;
