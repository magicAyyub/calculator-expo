import React from 'react';
import { View, Pressable, Text, StyleSheet, Appearance } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

function Button(props: {onPress: () => void, title: string }) {
  const { onPress, title } = props;

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

function HomeScreen({ navigation }: Props) {
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 10}}>
          <Button
            title='Calcul de prix TTC'
            onPress={() => navigation.navigate('VATPrice')}
          />
        </View>
        <View>
          <Button
            title='Calcul de ferraillage'
            onPress={() => navigation.navigate('SteelReinforcement')}
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
    justifyContent: 'center',
    backgroundColor: colorScheme === 'dark' ? '#18191a' : 'white',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colorScheme === 'dark' ? 'grey' : 'black',
    width: 220,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default HomeScreen;