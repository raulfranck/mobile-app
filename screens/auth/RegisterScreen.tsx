import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/store/AuthContext';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
}) => {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');

  const handleRegister = async (): Promise<void> => {
    try {
      if (!email || !password) {
        Alert.alert('Erro', 'Informe email e senha.');
        return;
      }
      console.log("Cadastrando email: ", email )
      console.log("Cadastrando senha: ", password )
      console.log("Cadastrando senha de confirmação: ", confirm )
      if (password.length < 6) {
        Alert.alert('Erro', 'Senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirm) {
        Alert.alert('Erro', 'Senhas não conferem.');
        return;
      }
      await signUp(email.trim(), password);
      Alert.alert(
        'Sucesso',
        'Cadastro realizado! Verifique seu email se a confirmação estiver habilitada.'
      );
      onNavigateToLogin();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha no cadastro';
      Alert.alert('Erro de cadastro', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Cadastrar</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={handleRegister}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Já possui conta?</Text>
        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={styles.link}> Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  footerText: {
    color: '#374151',
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default RegisterScreen;
