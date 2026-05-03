// src/screens/AdicionarScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { C } from '../data/theme';
import { loadTxs, saveTxs, CATS, CAT_EMOJI, CAT_COLOR } from '../data/storage';

const FORMAS = ['Pix', 'Débito', 'Crédito', 'Dinheiro', 'Transferência'];

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function AdicionarScreen({ navigation }) {
  const [tipo, setTipo] = useState('despesa');
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(today());
  const [cat, setCat] = useState(CATS.despesa[0]);
  const [forma, setForma] = useState('Pix');
  const [saving, setSaving] = useState(false);

  function handleSetTipo(t) {
    setTipo(t);
    setCat(CATS[t][0]);
    Haptics.selectionAsync();
  }

  async function handleSave() {
    const v = parseFloat(valor.replace(',', '.'));
    if (!desc.trim() || !v || v <= 0 || !data) {
      Alert.alert('Atenção', 'Preencha todos os campos corretamente.');
      return;
    }
    setSaving(true);
    const txs = await loadTxs();
    txs.push({ id: Date.now(), desc: desc.trim(), valor: v, tipo, cat, forma, data });
    await saveTxs(txs);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(false);
    setDesc(''); setValor(''); setData(today());
    navigation.navigate('Dashboard');
  }

  return (
    <KeyboardAvoidingView style={s.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* TIPO */}
        <View style={s.tipoRow}>
          <TouchableOpacity
            style={[s.tipoBtn, tipo === 'despesa' && s.tipoBtnDesp]}
            onPress={() => handleSetTipo('despesa')}
          >
            <Text style={[s.tipoBtnText, tipo === 'despesa' && { color: C.red }]}>💸 Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tipoBtn, tipo === 'receita' && s.tipoBtnRec]}
            onPress={() => handleSetTipo('receita')}
          >
            <Text style={[s.tipoBtnText, tipo === 'receita' && { color: C.green }]}>💰 Receita</Text>
          </TouchableOpacity>
        </View>

        {/* VALOR */}
        <View style={s.valorCard}>
          <Text style={s.valorLabel}>VALOR (R$)</Text>
          <TextInput
            style={s.valorInput}
            value={valor}
            onChangeText={setValor}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={C.text3}
          />
        </View>

        <View style={s.card}>
          {/* DESCRIÇÃO */}
          <View style={s.field}>
            <Text style={s.label}>Descrição</Text>
            <TextInput
              style={s.input}
              value={desc}
              onChangeText={setDesc}
              placeholder="Ex: Almoço no restaurante"
              placeholderTextColor={C.text3}
            />
          </View>

          {/* DATA */}
          <View style={s.field}>
            <Text style={s.label}>Data (AAAA-MM-DD)</Text>
            <TextInput
              style={s.input}
              value={data}
              onChangeText={setData}
              placeholder={today()}
              placeholderTextColor={C.text3}
            />
          </View>

          {/* CATEGORIA */}
          <View style={s.field}>
            <Text style={s.label}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}>
              {CATS[tipo].map(c => {
                const isActive = cat === c;
                const color = CAT_COLOR[c] || '#888';
                return (
                  <TouchableOpacity
                    key={c}
                    style={[s.catChip, isActive && { backgroundColor: color + '30', borderColor: color }]}
                    onPress={() => { setCat(c); Haptics.selectionAsync(); }}
                  >
                    <Text style={s.catEmoji}>{CAT_EMOJI[c] || '📋'}</Text>
                    <Text style={[s.catLabel, isActive && { color }]}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* FORMA */}
          <View style={s.field}>
            <Text style={s.label}>Forma de pagamento</Text>
            <View style={s.formaRow}>
              {FORMAS.map(f => (
                <TouchableOpacity
                  key={f}
                  style={[s.formaChip, forma === f && s.formaChipActive]}
                  onPress={() => { setForma(f); Haptics.selectionAsync(); }}
                >
                  <Text style={[s.formaText, forma === f && s.formaTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[s.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={s.saveBtnText}>{saving ? 'Salvando...' : 'Registrar transação →'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 40 },
  tipoRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  tipoBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: C.border2, backgroundColor: C.surface, alignItems: 'center' },
  tipoBtnDesp: { borderColor: C.red, backgroundColor: C.redBg },
  tipoBtnRec: { borderColor: C.green, backgroundColor: C.greenBg },
  tipoBtnText: { fontSize: 15, fontWeight: '600', color: C.text2 },
  valorCard: { backgroundColor: C.surface, borderRadius: 20, padding: 22, marginBottom: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  valorLabel: { fontSize: 10, letterSpacing: 1.2, color: C.text3, fontWeight: '600', marginBottom: 8 },
  valorInput: { fontSize: 40, fontWeight: '700', color: C.text, textAlign: 'center', width: '100%' },
  card: { backgroundColor: C.surface, borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: C.border },
  field: { marginBottom: 18 },
  label: { fontSize: 10, letterSpacing: 1, color: C.text3, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: C.surface2, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: C.text, fontSize: 15, borderWidth: 1, borderColor: C.border2 },
  catScroll: { marginHorizontal: -4 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.border2, marginHorizontal: 3, backgroundColor: C.surface2 },
  catEmoji: { fontSize: 14 },
  catLabel: { fontSize: 12, color: C.text2, fontWeight: '500' },
  formaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  formaChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.border2 },
  formaChipActive: { backgroundColor: C.accentBg, borderColor: C.accent },
  formaText: { fontSize: 13, color: C.text2 },
  formaTextActive: { color: C.accent, fontWeight: '600' },
  saveBtn: { backgroundColor: C.accent, borderRadius: 16, padding: 18, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
