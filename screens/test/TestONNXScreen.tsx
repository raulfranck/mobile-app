import React, { useEffect, useRef, useState } from 'react';
import { Asset } from 'expo-asset';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YawnDetector from '../../lib/onnx/yawnDetector';

const TestONNXScreen: React.FC = () => {
  const detectorRef = useRef<YawnDetector | null>(null);
  const [status, setStatus] = useState<string>('Carregando modelo...');
  const [lastLabel, setLastLabel] = useState<string>('—');

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        // Usa o modelo existente em ia/ (adicionado manualmente ao repo)
        const asset = Asset.fromModule(require('../../assets/models/model_lstm_3_45_euclidean.onnx'));
        await asset.downloadAsync();
        const modelUri = asset.localUri;
        if (!modelUri) throw new Error('Falha ao resolver URI do modelo');

        const detector = new YawnDetector(45);
        await detector.initializeFromUri(modelUri);
        detectorRef.current = detector;
        setStatus('Modelo carregado');
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setStatus('Erro ao carregar modelo');
        Alert.alert('ONNX', msg);
      }
    };
    void init();
  }, []);

  const feedDummyFrames = async (): Promise<void> => {
    const detector = detectorRef.current;
    if (!detector) return;

    // Alimenta 45 frames de zeros (sem rosto) só para validar pipeline
    for (let i = 0; i < 45; i++) {
      const result = await detector.addFrameAndPredict(null);
      if (result) {
        setLastLabel(result.label);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Teste de Integração ONNX</Text>
      <Text style={styles.subtitle}>{status}</Text>

      <TouchableOpacity style={styles.button} onPress={feedDummyFrames}>
        <Text style={styles.buttonText}>Rodar teste com frames vazios</Text>
      </TouchableOpacity>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>Último rótulo: {lastLabel}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  resultBox: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  resultText: {
    fontWeight: '600',
  },
});

export default TestONNXScreen;

