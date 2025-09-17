import "./src/i18n";

import {useTranslation} from 'react-i18next';

import { Button, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { NavigationContainer, DefaultTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 

import MainTabs from './src/components/MainTabs';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import MovieFormScreen from './src/screens/MovieFormScreen';

import React, { useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_COLORS } from './src/colors/colors';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient()

// Criando objeto de Context que será utilizado por todo o App
export const AppContext = createContext<{
  value: string;
  setValue: (val: string) => void
}>({
  value: "",
  setValue: () => {}
})

export default function App() {
  const [value, setValueState] = useState("0")
  const load = async () => {
    const storedTheme = await AsyncStorage.getItem("theme")
    setValueState(storedTheme ?? "0")
  }

  useEffect(() => {
    load()
  }, [])

  const setValue = async (val: string) => {
    setValueState(val)
  }

  const { t } = useTranslation();

  return (
    <QueryClientProvider client={ queryClient }>
      <AppContext.Provider value={{ value, setValue }}>
        <NavigationContainer
          theme={{
            ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'white', primary: APP_COLORS[Number(value)] }
          }}
        >
          <Stack.Navigator>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MovieDetailsScreen"
              component={MovieDetailsScreen}
              options={({ navigation, route }) => ({
                headerBackButtonDisplayMode: 'minimal',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('MovieFormScreen', {
                      movie: route.params?.movie,
                      onSave: (updatedMovie) => {
                        navigation.setParams({ movie: updatedMovie })
                      }
                    })}>
                    <Text style={{ color: APP_COLORS[Number(value)], fontSize: 18 }}>
                      {t("edit")}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            />
            <Stack.Screen
              name="MovieFormScreen"
              component={MovieFormScreen}
              options={({ navigation }) => ({
                headerBackButtonDisplayMode: 'minimal',
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.popToTop()}>
                    <Text style={{ color: APP_COLORS[Number(value)], fontSize: 18 }}>
                      {t("backToHome")}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
