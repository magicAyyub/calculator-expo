import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appearance, StatusBar } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import VATPriceScreen from './screens/VATPriceScreen';
import SteelReinforcementScreen from './screens/SteelReinforcementScreen';

export type RootStackParamList = {
  Home: undefined;
  VATPrice: undefined;
  SteelReinforcement: undefined;
};

const Stack = createNativeStackNavigator();
const colorScheme = Appearance.getColorScheme();

function App() {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black'
          },
          headerTintColor: colorScheme === 'dark' ? 'lightgrey' : 'black',
          animation: 'none'
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Accueil' }}
        />
        <Stack.Screen
          name="VATPrice"
          component={VATPriceScreen}
          options={{ title: 'Calcul de prix TTC' }}
        />
        <Stack.Screen
          name="SteelReinforcement"
          component={SteelReinforcementScreen}
          options={{ title: 'Calcul de ferraillage' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;