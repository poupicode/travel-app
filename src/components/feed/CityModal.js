import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const CityModal = ({ visible, cities, selectedCity, onSelectCity, onClose }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={s.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={s.content}>
          <Text style={s.title}>Select City</Text>
          <ScrollView style={s.list}>
            {cities.map((city, index) => {
              const isSelected = selectedCity.name === city.name;
              return (
                <TouchableOpacity
                  key={index}
                  style={[s.item, isSelected && s.itemActive]}
                  onPress={() => onSelectCity(city)}
                >
                  <View>
                    <Text style={[s.itemName, isSelected && s.itemNameActive]}>
                      {city.name}
                    </Text>
                    <Text style={s.itemContinent}>{city.continent}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={colors.accent} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayDarker,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '60%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemActive: {
    backgroundColor: colors.cardSelected,
  },
  itemName: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  itemNameActive: {
    fontWeight: '600',
    color: colors.accent,
  },
  itemContinent: {
    fontSize: 12,
    color: colors.textFaintest,
    marginTop: 2,
  },
});

export default CityModal;
