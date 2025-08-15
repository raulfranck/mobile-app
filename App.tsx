import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import HomeScreen from '@/screens/home/HomeScreen';
// Temporário: rota de teste ONNX
import TestONNXScreen from '@/screens/test/TestONNXScreen';

const Root: React.FC = () => {
  const { session, initialized } = useAuth();
  const [showRegister, setShowRegister] = useState<boolean>(false);

  if (!initialized) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!session) {
    return showRegister ? (
      <RegisterScreen onNavigateToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginScreen onNavigateToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <View style={styles.container}>
      <HomeScreen />
      {/* Descomente para testar o ONNX isoladamente */}
      <TestONNXScreen />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App(): React.ReactElement {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
