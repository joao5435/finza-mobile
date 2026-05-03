// src/screens/GraficosScreen.js
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { C } from '../data/theme';
import { loadTxs, fmtBRL, getYM, nowYM, getLast6Months, CAT_EMOJI, CAT_COLOR, PALETTE } from '../data/storage';

const W = Dimensions.get('window').width;

export default function GraficosScreen() {
  const [txs, setTxs] = useState([]);

  useFocusEffect(useCallback(() => {
    loadTxs().then(setTxs);
  }, []));

  const months = getLast6Months();
  const ym = nowYM();

  const recs = months.map(m => txs.filter(t => getYM(t.data) === m.ym && t.tipo === 'receita').reduce((s, t) => s + t.valor, 0));
  const desps = months.map(m => txs.filter(t => getYM(t.data) === m.ym && t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0));

  const despsMonth = txs.filter(t => getYM(t.data) === ym && t.tipo === 'despesa');
  const catMap = {};
  despsMonth.forEach(t => { catMap[t.cat] = (catMap[t.cat] || 0) + t.valor; });
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxVal = sorted[0]?.[1] || 1;

  const chartCfg = {
    backgroundColor: C.surface, backgroundGradientFrom: C.surface, backgroundGradientTo: C.surface,
    decimalPlaces: 0, color: (op = 1) => `rgba(124,111,247,${op})`,
    labelColor: () => C.text3,
    propsForBackgroundLines: { stroke: C.border },
    barPercentage: 0.55,
  };

  const hasData = recs.some(v => v > 0) || desps.some(v => v > 0);

  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

      {/* BAR CHART */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Receitas vs Despesas — últimos 6 meses</Text>
        {hasData ? (
          <>
            <BarChart
              data={{
                labels: months.map(m => m.label),
                datasets: [{ data: recs.map(v => v || 0.01) }],
              }}
              width={W - 64}
              height={180}
              chartConfig={{ ...chartCfg, color: (op = 1) => `rgba(0,200,150,${op})` }}
              style={s.chart}
              withInnerLines
              showValuesOnTopOfBars={false}
              fromZero
            />
            <Text style={s.legend}><Text style={{ color: C.green }}>■</Text> Receitas</Text>
            <BarChart
              data={{
                labels: months.map(m => m.label),
                datasets: [{ data: desps.map(v => v || 0.01) }],
              }}
              width={W - 64}
              height={180}
              chartConfig={{ ...chartCfg, color: (op = 1) => `rgba(255,94,108,${op})` }}
              style={s.chart}
              withInnerLines
              showValuesOnTopOfBars={false}
              fromZero
            />
            <Text style={s.legend}><Text style={{ color: C.red }}>■</Text> Despesas</Text>
          </>
        ) : (
          <Text style={s.noData}>Adicione transações para ver o gráfico.</Text>
        )}
      </View>

      {/* CAT BREAKDOWN */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Despesas por categoria — mês atual</Text>
        {sorted.length === 0 ? (
          <Text style={s.noData}>Nenhuma despesa neste mês.</Text>
        ) : (
          sorted.map(([cat, val], i) => {
            const color = CAT_COLOR[cat] || PALETTE[i % PALETTE.length];
            const pct = Math.round(val / maxVal * 100);
            return (
              <View key={cat} style={s.catRow}>
                <View style={[s.catIcon, { backgroundColor: color + '22' }]}>
                  <Text style={s.catEmoji}>{CAT_EMOJI[cat] || '📋'}</Text>
                </View>
                <View style={s.catInfo}>
                  <View style={s.catTop}>
                    <Text style={s.catName}>{cat}</Text>
                    <Text style={[s.catVal, { color: C.red }]}>{fmtBRL(val)}</Text>
                  </View>
                  <View style={s.barTrack}>
                    <View style={[s.barFill, { width: `${pct}%`, backgroundColor: color }]} />
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* SUMMARY */}
      <View style={[s.card, s.summaryGrid]}>
        {[
          { label: 'Total recebido', value: recs.reduce((a, b) => a + b, 0), color: C.green },
          { label: 'Total gasto', value: desps.reduce((a, b) => a + b, 0), color: C.red },
          { label: 'Saldo acumulado', value: recs.reduce((a, b) => a + b, 0) - desps.reduce((a, b) => a + b, 0), color: C.accent },
        ].map(item => (
          <View key={item.label} style={s.summaryItem}>
            <Text style={s.summaryLabel}>{item.label}</Text>
            <Text style={[s.summaryVal, { color: item.color }]}>{fmtBRL(item.value)}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },
  container: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: C.surface, borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: C.border },
  cardTitle: { fontSize: 13, fontWeight: '600', color: C.text2, letterSpacing: 0.4, marginBottom: 16 },
  chart: { borderRadius: 12, marginBottom: 4 },
  legend: { fontSize: 12, color: C.text3, marginBottom: 10 },
  noData: { color: C.text3, fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  catIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  catEmoji: { fontSize: 16 },
  catInfo: { flex: 1 },
  catTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catName: { fontSize: 13, color: C.text },
  catVal: { fontSize: 13, fontWeight: '700' },
  barTrack: { height: 5, borderRadius: 3, backgroundColor: C.surface2, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, padding: 0 },
  summaryItem: { flex: 1, minWidth: '33%', padding: 16, alignItems: 'center', borderRightWidth: 1, borderRightColor: C.border },
  summaryLabel: { fontSize: 10, color: C.text3, textAlign: 'center', marginBottom: 6, letterSpacing: 0.5 },
  summaryVal: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
});
