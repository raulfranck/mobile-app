import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/store/AuthContext';
import { Camera } from 'react-native-vision-camera';
import CameraView from '@/components/CameraView';

const HomeScreen: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const requestAndStart = async (): Promise<void> => {
    const status = await Camera.requestCameraPermission();
    if (status !== 'granted') {
      Alert.alert('Permissão', 'Precisamos da câmera para iniciar a detecção.');
      return;
    }
    setCameraActive(true);
  };

  const stop = (): void => setCameraActive(false);

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
        {!cameraActive ? (
          <TouchableOpacity style={styles.card} onPress={requestAndStart}>
            <Text style={styles.cardTitle}>Iniciar Detecção</Text>
            <Text style={styles.cardDesc}>Solicitar permissão e abrir câmera</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.card, styles.cardDanger]} onPress={stop}>
            <Text style={[styles.cardTitle, styles.cardDangerText]}>Parar</Text>
            <Text style={[styles.cardDesc, styles.cardDangerText]}>Fechar câmera e parar detecção</Text>
          </TouchableOpacity>
        )}

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
      {cameraActive && (
        <View style={styles.cameraContainer}>
          <CameraView
            active
            onLandmarks={(data) => {
              if (data?.landmarks?.length) {
                // eslint-disable-next-line no-console
                console.log('[MediaPipe] first point:', data.landmarks[0]);
              } else {
                // eslint-disable-next-line no-console
                console.log('[MediaPipe] no face');
              }
            }}
            onRequestClose={() => setCameraActive(false)}
            closeLabel="Parar"
          />
        </View>
      )}
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
  cameraContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#000',
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardDanger: {
    backgroundColor: '#fee2e2',
  },
  cardDangerText: {
    color: '#b91c1c',
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

