import React from 'react';
import { View, Pressable, Text, StyleSheet, Appearance } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './HomeScreen';
import DataEntriesScreen from './DataEntriesScreen';

const Drawer = createDrawerNavigator();
const colorScheme = Appearance.getColorScheme();

function HomeDrawerScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          height: 65,
          backgroundColor: 'black',
          shadowColor: 'transparent'
        },
        headerTintColor: colorScheme === 'dark' ? 'lightgrey' : 'black',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      <Drawer.Screen
        name="DataEntries"
        component={DataEntriesScreen}
        options={{ title: "Données d'entrée" }}
      />
    </Drawer.Navigator>
  );
}

export default HomeDrawerScreen;