# 📱 Finza Mobile — Expo / React Native

App de controle de gastos para iOS e Android.


## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no seu celular (iOS ou Android)

### Instalação

```bash
cd finza-mobile
npm install
npx expo start
```

Depois escaneie o QR code com o app Expo Go!

## 📁 Estrutura

```
finza-mobile/
├── App.js                        # Navegação principal
├── src/
│   ├── data/
│   │   ├── storage.js            # AsyncStorage + helpers
│   │   └── theme.js              # Cores e design tokens
│   └── screens/
│       ├── DashboardScreen.js    # Tela inicial com resumo
│       ├── TransacoesScreen.js   # Lista com filtros e deleção
│       ├── AdicionarScreen.js    # Formulário de nova transação
│       └── GraficosScreen.js     # Gráficos e análises
```

## ✨ Funcionalidades

- ✅ Dashboard com saldo, receitas e despesas do mês
- ✅ Gráfico de evolução do saldo (últimos 6 meses)
- ✅ Lista completa com filtros por tipo
- ✅ Adicionar receitas e despesas com categoria e forma de pagamento
- ✅ Remover transações com confirmação
- ✅ Gráficos de barras mensais e ranking por categoria
- ✅ Dados persistidos com AsyncStorage (ficam salvos offline)
- ✅ Feedback tátil (haptics) no iOS
- ✅ Tema dark moderno e responsivo

## 🎨 Design

