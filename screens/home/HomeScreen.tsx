import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/store/AuthContext';

const HomeScreen: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  const handlePlaceholder = (label: string): void => {
    // Placeholder até termos navegação configurada (Fase 6)
    // eslint-disable-next-line no-console
    console.log(`Navegar para: ${label}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yawn Detector</Text>
        <Text style={styles.subtitle}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.card} onPress={() => handlePlaceholder('Detecção')}>
          <Text style={styles.cardTitle}>Iniciar Detecção</Text>
          <Text style={styles.cardDesc}>Abrir câmera e detectar bocejos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handlePlaceholder('Histórico')}>
          <Text style={styles.cardTitle}>Histórico</Text>
          <Text style={styles.cardDesc}>Ver eventos e sessões</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handlePlaceholder('Configurações')}>
          <Text style={styles.cardTitle}>Configurações</Text>
          <Text style={styles.cardDesc}>Ajustes de detecção e app</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={signOut}
        style={[styles.logoutButton, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        <Text style={styles.logoutText}>{loading ? 'Saindo...' : 'Sair'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    color: '#6b7280',
  },
  menu: {
    flex: 1,
    gap: 12,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardDesc: {
    marginTop: 4,
    color: '#4b5563',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default HomeScreen;

