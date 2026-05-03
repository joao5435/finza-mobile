// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { C } from './src/data/theme';

import DashboardScreen from './src/screens/DashboardScreen';
import TransacoesScreen from './src/screens/TransacoesScreen';
import AdicionarScreen from './src/screens/AdicionarScreen';
import GraficosScreen from './src/screens/GraficosScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, focused }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: C.surface, shadowColor: 'transparent', borderBottomWidth: 0 },
        headerTintColor: C.text,
        headerTitleStyle: { fontWeight: '600', fontSize: 18, letterSpacing: -0.3 },
        tabBarStyle: {
          backgroundColor: C.surface,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.text3,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Finza',
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          headerRight: () => (
            <Text style={{ fontSize: 22, marginRight: 16, fontWeight: '700', color: C.accent }}>
              Fin<Text style={{ color: C.text }}>za</Text>
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Transações"
        component={TransacoesScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Adicionar"
        component={AdicionarScreen}
        options={{
          title: 'Nova Transação',
          tabBarLabel: 'Adicionar',
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: focused ? C.accent : C.surface2,
              justifyContent: 'center', alignItems: 'center',
              marginBottom: 10,
              shadowColor: C.accent, shadowOffset: { width: 0, height: 4 },
              shadowOpacity: focused ? 0.4 : 0, shadowRadius: 8,
            }}>
              <Text style={{ fontSize: 22, color: '#fff' }}>+</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Gráficos"
        component={GraficosScreen}
        options={{
          title: 'Análise',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📈" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
