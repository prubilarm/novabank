import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { CreditCard, Lock, Mail, ChevronRight } from 'lucide-react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <CreditCard size={32} color="#fff" />
          </View>
          <Text style={styles.title}>NovaBank</Text>
          <Text style={styles.subtitle}>Tu banco digital, ahora en tu mano.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#94a3b8" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#94a3b8" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Contraseña" 
              placeholderTextColor="#64748b"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          ¿Eres nuevo? <Text style={styles.linkText}>Crea tu cuenta</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    backgroundColor: '#8b5cf6',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 60,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    height: 60,
    backgroundColor: '#8b5cf6',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  footerText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 40,
  },
  linkText: {
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});
