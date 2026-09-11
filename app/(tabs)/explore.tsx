import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCitySearch } from '@/hooks/use-weather';
import { useCityStore } from '@/store/city-store';
import { SavedCity } from '@/types/clima.type';

export default function CitiesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { activeLat, activeLon, savedCities, selectCity, addSavedCity, removeSavedCity, isSaved } = useCityStore();
  const { data: results = [], isFetching, isError } = useCitySearch(debouncedSearch);
  const isSearching = search.trim().length >= 2;
  const isDebouncing = isSearching && search.trim() !== debouncedSearch.trim();
  const showLoading = isDebouncing || isFetching;

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleSelect = (city: SavedCity) => {
    selectCity(city);
    Keyboard.dismiss();
    router.navigate('/');
  };

  const toggleSaved = (city: SavedCity) => {
    if (isSaved(city.id)) {
      removeSavedCity(city.id);
    } else {
      addSavedCity(city);
    }
  };

  const isActive = (city: SavedCity) =>
    activeLat !== null &&
    activeLon !== null &&
    Math.abs(activeLat - city.lat) < 0.0001 &&
    Math.abs(activeLon - city.lon) < 0.0001;

  const cities = isSearching ? results : savedCities;

  return (
    <LinearGradient colors={['#07101E', '#0A1526', '#020617']} locations={[0, 0.45, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>TU CLIMA</Text>
          <Text style={styles.title}>Ciudades</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.55)" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar ciudad"
            placeholderTextColor="rgba(255,255,255,0.4)"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={10} accessibilityLabel="Limpiar búsqueda">
              <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.45)" />
            </Pressable>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{isSearching ? 'RESULTADOS' : 'FAVORITAS'}</Text>
          {!isSearching && savedCities.length > 0 && <Text style={styles.count}>{savedCities.length}</Text>}
        </View>

        {showLoading && (
          <View style={styles.status}>
            <ActivityIndicator color="#38BDF8" />
            <Text style={styles.statusText}>Buscando ciudades...</Text>
          </View>
        )}

        {!showLoading && isError && (
          <View style={styles.status}>
            <Ionicons name="cloud-offline-outline" size={34} color="rgba(255,255,255,0.4)" />
            <Text style={styles.statusTitle}>No pudimos buscar ahora</Text>
            <Text style={styles.statusText}>Comprueba tu conexión e inténtalo de nuevo.</Text>
          </View>
        )}

        {!showLoading && !isError && (
          <FlatList
            data={cities}
            extraData={savedCities}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={[styles.list, cities.length === 0 && styles.emptyList]}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.status}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name={isSearching ? 'search-outline' : 'star-outline'}
                    size={32}
                    color="rgba(255,255,255,0.55)"
                  />
                </View>
                <Text style={styles.statusTitle}>{isSearching ? 'Sin resultados' : 'Aún no tienes favoritas'}</Text>
                <Text style={styles.statusText}>
                  {isSearching
                    ? 'Prueba con otra ciudad o añade el país.'
                    : 'Busca una ciudad y toca la estrella para guardarla.'}
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const active = isActive(item);
              const saved = isSaved(item.id);

              return (
                <Pressable
                  onPress={() => handleSelect(item)}
                  style={({ pressed }) => [styles.cityRow, pressed && styles.cityRowPressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Seleccionar ${item.name}`}
                >
                  <View style={[styles.locationIcon, active && styles.locationIconActive]}>
                    <Ionicons
                      name={active ? 'navigate' : 'location-outline'}
                      size={20}
                      color={active ? '#07101E' : '#7DD3FC'}
                    />
                  </View>
                  <View style={styles.cityInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.cityName}>{item.name}</Text>
                      {active && <Text style={styles.activeLabel}>ACTUAL</Text>}
                    </View>
                    <Text style={styles.cityMeta}>{[item.state, item.country].filter(Boolean).join(', ')}</Text>
                  </View>
                  <Pressable
                    onPress={event => {
                      event.stopPropagation();
                      toggleSaved(item);
                    }}
                    hitSlop={10}
                    style={styles.starButton}
                    accessibilityLabel={saved ? 'Quitar de favoritas' : 'Añadir a favoritas'}
                  >
                    <Ionicons
                      name={saved ? 'star' : 'star-outline'}
                      size={23}
                      color={saved ? '#FBBF24' : 'rgba(255,255,255,0.45)'}
                    />
                  </Pressable>
                </Pressable>
              );
            }}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 18 },
  eyebrow: { color: '#38BDF8', fontSize: 11, fontWeight: '800', letterSpacing: 1.6, marginBottom: 5 },
  title: { color: '#FFFFFF', fontSize: 34, fontWeight: '700', fontFamily: 'Overpass-Bold' },
  searchContainer: {
    height: 52,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
  },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 16, fontFamily: 'Overpass-Regular' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 12,
    gap: 8,
  },
  sectionTitle: { color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  count: {
    color: '#07101E',
    backgroundColor: '#7DD3FC',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  list: { marginHorizontal: 20, paddingBottom: 40 },
  emptyList: { flexGrow: 1 },
  separator: { height: 1, marginLeft: 58, backgroundColor: 'rgba(255,255,255,0.08)' },
  cityRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4 },
  cityRowPressed: { opacity: 0.65 },
  locationIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56,189,248,0.12)',
    borderRadius: 8,
  },
  locationIconActive: { backgroundColor: '#7DD3FC' },
  cityInfo: { flex: 1, paddingHorizontal: 14, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cityName: { color: '#FFFFFF', fontSize: 17, fontWeight: '600', fontFamily: 'Overpass-SemiBold' },
  cityMeta: { color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: 'Overpass-Regular' },
  activeLabel: { color: '#7DD3FC', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  starButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  status: { flex: 1, minHeight: 230, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 44, gap: 10 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statusTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Overpass-SemiBold',
  },
  statusText: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Overpass-Regular',
  },
});
