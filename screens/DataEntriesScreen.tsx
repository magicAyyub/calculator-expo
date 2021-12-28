import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Appearance, TextInput, Keyboard } from 'react-native';
import * as SecureStore from 'expo-secure-store';

function DataEntriesScreen() {
  const [steelPrice, setSteelPrice] = useState('');

  useEffect(() => {
    async function setStoredSteelPrice() {
      let storedSteelPrice = await SecureStore.getItemAsync('steelPrice');

      if (storedSteelPrice) {
        setSteelPrice(storedSteelPrice);
      }
    }

    setStoredSteelPrice();
  }, []);

  useEffect(() => {
    async function storeSteelPrice() {
      await SecureStore.setItemAsync('steelPrice', steelPrice);
    }

    storeSteelPrice();
  }, [steelPrice]);

  function handleUnhandledTouches(){
    Keyboard.dismiss();
    return false;
  }

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Text style={{
          ...styles.textColor,
          ...styles.formLeftText,
          ...styles.formTwoLinesText
        }}>Prix de l'acier à la tonne</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          onChangeText={setSteelPrice}
          value={steelPrice}
          placeholder="Prix de l'acier à la tonne"
          placeholderTextColor={colorScheme === 'dark' ? 'grey' : 'lightgrey'}
        />
      </View>
    </View>
  );
}

const colorScheme = Appearance.getColorScheme();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colorScheme === 'dark' ? '#18191a' : 'white',
    paddingTop: 20
  },
  textColor: {
    color: colorScheme === 'dark' ? 'lightgrey' : 'black',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 180,
    borderColor: colorScheme === 'dark' ? 'grey' : 'black',
    color: colorScheme === 'dark' ? 'lightgrey' : 'black'
  },
  formLeftText: {
    width: 90,
    textAlign: 'right'
  },
  formTwoLinesText: {
    marginTop: 13
  },
});

export default DataEntriesScreen;