import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function TransferScreen({ navigation }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isAerum, setIsAerum] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Completa los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (isAerum) {
        // Lógica de Puente Interbancario Aerum
        const aerumData = {
          account_number: recipient,
          amount: parseFloat(amount),
          from_bank: 'NovaBank',
          description: description || 'Transferencia Interbancaria',
          api_key: 'AERUM-BRIDGE-2026'
        };

        const response = await fetch('https://banco-aerum.vercel.app/api/interbank/receive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aerumData)
        });

        if (response.ok) {
          Alert.alert('Éxito', 'Transferencia enviada a Banco Aerum');
          navigation.goBack();
        } else {
          throw new Error('El banco receptor rechazó la operación');
        }
      } else {
        // Transferencia interna
        await api.post('/api/transfer', {
          recipientEmail: recipient,
          amount: parseFloat(amount),
          description
        });
        Alert.alert('Éxito', 'Dinero enviado correctamente');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo completar la transferencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, !isAerum && styles.activeTab]} 
          onPress={() => setIsAerum(false)}
        >
          <Text style={[styles.tabText, !isAerum && styles.activeTabText]}>Interna</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, isAerum && styles.activeTab]} 
          onPress={() => setIsAerum(true)}
        >
          <Text style={[styles.tabText, isAerum && styles.activeTabText]}>Interbancaria</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        {isAerum ? 'Número de Cuenta Aerum' : 'Email del destinatario'}
      </Text>
      <TextInput
        style={styles.input}
        value={recipient}
        onChangeText={setRecipient}
        placeholder={isAerum ? "Ej: 123456789" : "ejemplo@correo.com"}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Monto ($)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Descripción (Opcional)</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Motivo del envío"
        multiline
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledBtn]} 
        onPress={handleTransfer}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Confirmar Envío</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    color: '#64748B',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#2563EB',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563EB',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
