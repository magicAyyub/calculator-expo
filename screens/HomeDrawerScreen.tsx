import React from 'react';
import { Appearance } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './HomeScreen';
import DataEntriesScreen from './DataEntriesScreen';
import DrawerToggleButton from '../components/DrawerToggleButton';

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
        headerLeft: () => (
          <DrawerToggleButton
            tintColor={colorScheme === 'dark' ? 'white' : 'black'}
          />
        ),
        drawerStyle: {
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white'
        },
        drawerActiveBackgroundColor: colorScheme === 'dark' ? 'grey' : 'black',
        drawerActiveTintColor: colorScheme === 'dark' ? 'lightgrey' : 'black',
        drawerInactiveTintColor: colorScheme === 'dark' ? 'lightgrey' : 'black'
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
        options={{
          title: "Données d'entrée"
        }}
      />
    </Drawer.Navigator>
  );
}

export default HomeDrawerScreen;