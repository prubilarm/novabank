import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile');
      setBalance(response.data.user.balance);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Hola,</Text>
            <Text style={styles.name}>{user?.full_name}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponible</Text>
          <Text style={styles.balanceValue}>${balance.toLocaleString()}</Text>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Cuenta Activa</Text>
          </View>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Transfer')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
              <Text style={{ fontSize: 24 }}>💸</Text>
            </View>
            <Text style={styles.actionLabel}>Transferir</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Transactions')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
              <Text style={{ fontSize: 24 }}>📜</Text>
            </View>
            <Text style={styles.actionLabel}>Historial</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickBtn}>
            <Text style={styles.quickBtnText}>Pagar Servicios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn}>
            <Text style={styles.quickBtnText}>Recargar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  welcome: {
    fontSize: 16,
    color: '#64748B',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: '#1E293B',
    padding: 25,
    borderRadius: 24,
    marginBottom: 30,
  },
  balanceLabel: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 5,
  },
  balanceValue: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chip: {
    backgroundColor: '#334155',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: '#FFF',
    width: '48%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontWeight: 'bold',
    color: '#475569',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quickBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickBtnText: {
    color: '#475569',
    fontWeight: '600',
  }
});
