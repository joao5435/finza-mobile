// src/screens/TransacoesScreen.js
import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { C } from '../data/theme';
import { loadTxs, saveTxs, fmtBRL } from '../data/storage';
import { TxItem } from './DashboardScreen';

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'receita', label: 'Receitas' },
  { key: 'despesa', label: 'Despesas' },
];

export default function TransacoesScreen() {
  const [txs, setTxs] = useState([]);
  const [filter, setFilter] = useState('all');

  useFocusEffect(useCallback(() => {
    loadTxs().then(setTxs);
  }, []));

  const filtered = [...txs]
    .sort((a, b) => b.id - a.id)
    .filter(t => filter === 'all' || t.tipo === filter);

  const total = filtered.reduce((s, t) =>
    t.tipo === 'receita' ? s + t.valor : s - t.valor, 0);

  function handleDelete(id) {
    Alert.alert('Remover', 'Deseja remover esta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          const updated = txs.filter(t => t.id !== id);
          await saveTxs(updated);
          setTxs(updated);
        }
      }
    ]);
  }

  return (
    <View style={s.wrap}>
      {/* FILTER CHIPS */}
      <View style={s.chips}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[s.chip, filter === f.key && s.chipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[s.chipText, filter === f.key && s.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={s.totalPill}>
          <Text style={[s.totalText, { color: total >= 0 ? C.green : C.red }]}>
            {total >= 0 ? '+' : '-'}{fmtBRL(total)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🔍</Text>
            <Text style={s.emptyText}>Nenhuma transação encontrada.</Text>
          </View>
        ) : (
          <View style={s.card}>
            {filtered.map(t => (
              <TxItem key={t.id} t={t} onDelete={handleDelete} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },
  chips: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border2 },
  chipActive: { backgroundColor: C.accentBg, borderColor: C.accent },
  chipText: { fontSize: 13, color: C.text2 },
  chipTextActive: { color: C.accent, fontWeight: '600' },
  totalPill: { marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: C.surface2 },
  totalText: { fontSize: 13, fontWeight: '700' },
  list: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: C.border },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: C.text3, fontSize: 14 },
});
