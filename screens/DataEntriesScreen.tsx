import React from 'react';
import { View, Text, StyleSheet, Appearance } from 'react-native';

function DataEntriesScreen() {
    return (
      <View style={styles.container}>
        <Text>Test</Text>
      </View>
    );
}

const colorScheme = Appearance.getColorScheme();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorScheme === 'dark' ? '#18191a' : 'white',
  }
});

export default DataEntriesScreen;