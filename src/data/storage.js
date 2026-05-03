// src/data/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'finza_txs';

export async function loadTxs() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveTxs(txs) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(txs));
  } catch (e) {
    console.warn('Save error', e);
  }
}

export const CATS = {
  despesa: ['Alimentação','Transporte','Moradia','Saúde','Lazer','Educação','Vestuário','Assinaturas','Outros'],
  receita: ['Salário','Freelance','Investimentos','Presente','Bônus','Outros'],
};

export const CAT_EMOJI = {
  Alimentação:'🍽', Transporte:'🚗', Moradia:'🏠', Saúde:'💊',
  Lazer:'🎮', Educação:'📚', Vestuário:'👕', Assinaturas:'📱',
  Salário:'💼', Freelance:'💻', Investimentos:'📈',
  Presente:'🎁', Bônus:'⭐', Outros:'📋',
};

export const CAT_COLOR = {
  Alimentação:'#ffb84d', Transporte:'#4da6ff', Moradia:'#b44dff',
  Saúde:'#4dddaa', Lazer:'#ff7060', Educação:'#4dc8ff',
  Vestuário:'#ff80c0', Assinaturas:'#9060ff', Salário:'#00c896',
  Freelance:'#60aaff', Investimentos:'#40e060', Presente:'#ffcc40',
  Bônus:'#ffe040', Outros:'#888',
};

export const PALETTE = [
  '#7c6ff7','#00c896','#ff5e6c','#ffb640',
  '#3db8f5','#f97cf9','#40e0c8','#ff8a4c','#a0e040',
];

export function fmtBRL(n) {
  return 'R$ ' + Math.abs(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtDate(s) {
  return new Date(s + 'T00:00:00').toLocaleDateString('pt-BR');
}

export function getYM(s) {
  const d = new Date(s + 'T00:00:00');
  return d.getFullYear() * 100 + d.getMonth();
}

export function nowYM() {
  const d = new Date();
  return d.getFullYear() * 100 + d.getMonth();
}

export function getLast6Months() {
  const arr = [];
  const d = new Date();
  for (let i = 5; i >= 0; i--) {
    const dd = new Date(d.getFullYear(), d.getMonth() - i, 1);
    arr.push({
      ym: dd.getFullYear() * 100 + dd.getMonth(),
      label: dd.toLocaleString('pt-BR', { month: 'short' }),
    });
  }
  return arr;
}
