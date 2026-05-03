// src/screens/DashboardScreen.js
import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { C } from '../data/theme';
import { loadTxs, fmtBRL, fmtDate, getYM, nowYM, getLast6Months, CAT_EMOJI, CAT_COLOR, PALETTE } from '../data/storage';

const W = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }) {
  const [txs, setTxs] = useState([]);
  const [now] = useState(new Date());

  useFocusEffect(useCallback(() => {
    loadTxs().then(setTxs);
  }, []));

  const ym = nowYM();
  const month = txs.filter(t => getYM(t.data) === ym);
  const rec = month.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
  const desp = month.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);
  const saldo = rec - desp;
  const recent = [...txs].sort((a, b) => b.id - a.id).slice(0, 5);

  const months = getLast6Months();
  const saldos = months.map(m => {
    const r = txs.filter(t => getYM(t.data) === m.ym && t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
    const d = txs.filter(t => getYM(t.data) === m.ym && t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);
    return r - d;
  });

  const monthStr = now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Olá 👋</Text>
          <Text style={s.monthLabel}>{monthStr}</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => navigation.navigate('Adicionar')}>
          <Text style={s.addBtnText}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {/* SALDO CARD */}
      <View style={[s.saldoCard, { borderColor: saldo >= 0 ? C.accent : C.red }]}>
        <Text style={s.saldoLabel}>SALDO DO MÊS</Text>
        <Text style={[s.saldoValue, { color: saldo >= 0 ? C.accent : C.red }]}>
          {saldo < 0 ? '-' : ''}{fmtBRL(saldo)}
        </Text>
        <View style={s.saldoRow}>
          <View style={s.miniCard}>
            <Text style={s.miniLabel}>↑ Receitas</Text>
            <Text style={[s.miniVal, { color: C.green }]}>{fmtBRL(rec)}</Text>
          </View>
          <View style={[s.miniCard, { marginLeft: 10 }]}>
            <Text style={s.miniLabel}>↓ Despesas</Text>
            <Text style={[s.miniVal, { color: C.red }]}>{fmtBRL(desp)}</Text>
          </View>
        </View>
      </View>

      {/* LINE CHART */}
      {saldos.some(v => v !== 0) && (
        <View style={s.chartCard}>
          <Text style={s.sectionTitle}>Evolução do saldo</Text>
          <LineChart
            data={{
              labels: months.map(m => m.label),
              datasets: [{ data: saldos.map(v => v === 0 ? 0.01 : v) }],
            }}
            width={W - 64}
            height={160}
            chartConfig={{
              backgroundColor: C.surface,
              backgroundGradientFrom: C.surface,
              backgroundGradientTo: C.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(124,111,247,${opacity})`,
              labelColor: () => C.text3,
              propsForDots: { r: '4', strokeWidth: '2', stroke: C.accent },
              propsForBackgroundLines: { stroke: C.border },
            }}
            bezier
            style={{ borderRadius: 12, marginTop: 8 }}
            withInnerLines
            withOuterLines={false}
            formatYLabel={v => 'R$' + parseInt(v).toLocaleString('pt-BR')}
          />
        </View>
      )}

      {/* RECENT */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recentes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transações')}>
            <Text style={s.seeAll}>Ver tudo →</Text>
          </TouchableOpacity>
        </View>
        {recent.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>💳</Text>
            <Text style={s.emptyText}>Nenhuma transação ainda.{'\n'}Adicione a primeira!</Text>
          </View>
        ) : (
          recent.map(t => <TxItem key={t.id} t={t} />)
        )}
      </View>
    </ScrollView>
  );
}

export function TxItem({ t, onDelete }) {
  const isRec = t.tipo === 'receita';
  const emoji = CAT_EMOJI[t.cat] || '📋';
  const catColor = CAT_COLOR[t.cat] || '#888';
  return (
    <View style={ti.row}>
      <View style={[ti.icon, { backgroundColor: catColor + '22' }]}>
        <Text style={ti.iconText}>{emoji}</Text>
      </View>
      <View style={ti.info}>
        <Text style={ti.desc} numberOfLines={1}>{t.desc}</Text>
        <Text style={ti.meta}>{t.cat} · {fmtDate(t.data)}</Text>
      </View>
      <View style={ti.right}>
        <Text style={[ti.amount, { color: isRec ? C.green : C.red }]}>
          {isRec ? '+' : '-'}{fmtBRL(t.valor)}
        </Text>
        <Text style={ti.forma}>{t.forma}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity style={ti.del} onPress={() => onDelete(t.id)}>
          <Text style={ti.delText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  container: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '600', color: C.text },
  monthLabel: { fontSize: 13, color: C.text3, marginTop: 2 },
  addBtn: { backgroundColor: C.accentBg, borderWidth: 1, borderColor: C.accent, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: C.accent, fontWeight: '600', fontSize: 14 },
  saldoCard: { backgroundColor: C.surface, borderRadius: 20, padding: 22, marginBottom: 16, borderWidth: 1 },
  saldoLabel: { fontSize: 10, letterSpacing: 1.2, color: C.text3, fontWeight: '600', marginBottom: 8 },
  saldoValue: { fontSize: 36, fontWeight: '700', letterSpacing: -1, marginBottom: 16 },
  saldoRow: { flexDirection: 'row' },
  miniCard: { flex: 1, backgroundColor: C.surface2, borderRadius: 12, padding: 12 },
  miniLabel: { fontSize: 11, color: C.text3, marginBottom: 4 },
  miniVal: { fontSize: 16, fontWeight: '600' },
  chartCard: { backgroundColor: C.surface, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  section: { backgroundColor: C.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: C.text2, letterSpacing: 0.5 },
  seeAll: { fontSize: 12, color: C.accent },
  empty: { alignItems: 'center', paddingVertical: 30 },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyText: { color: C.text3, textAlign: 'center', lineHeight: 22 },
});

const ti = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  icon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 17 },
  info: { flex: 1 },
  desc: { fontSize: 14, fontWeight: '500', color: C.text },
  meta: { fontSize: 11, color: C.text3, marginTop: 2 },
  right: { alignItems: 'flex-end', marginLeft: 8 },
  amount: { fontSize: 14, fontWeight: '700' },
  forma: { fontSize: 10, color: C.text3, marginTop: 2, textTransform: 'uppercase' },
  del: { marginLeft: 10, padding: 4 },
  delText: { fontSize: 20, color: C.text3 },
});
