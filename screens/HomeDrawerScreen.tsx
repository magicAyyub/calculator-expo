import React from 'react';
import { View, Pressable, Text, StyleSheet, Appearance, Button, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
        headerTitle: props => (
          <Text
            style={{
              ...styles.title,
              color: colorScheme === 'dark' ? 'white' : 'black',
            }}
          >
            {props.children}
          </Text>
        ),
        headerLeft: () => (
          <DrawerToggleButton
            tintColor={colorScheme === 'dark' ? 'white' : 'black'}
          />
        ),
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

const styles = StyleSheet.create({
  title: Platform.select({
    ios: {
      fontSize: 17,
      fontWeight: '600',
    },
    android: {
      fontSize: 20,
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    default: {
      fontSize: 18,
      fontWeight: '500',
    },
  }),
});

export default HomeDrawerScreen;