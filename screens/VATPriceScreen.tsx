import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Appearance } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const colorScheme = Appearance.getColorScheme();

export function VATPriceScreen() {
    const [priceWithoutVAT, onChangePriceWithoutVAT] = useState('');
    const [VAT, onChangeVAT] = useState('');
    const [VATPrice, setVATPrice] = useState(0);
    const [discountValue, onChangeDiscountValue] = useState('');
    const [selectedDiscountType, setSelectedDiscountType] = useState('discountRate');
    const [discountedPrice, setDiscountedPrice] = useState(0);
    
    useEffect(() => {
      if (VAT === '' || priceWithoutVAT === '') {
        setVATPrice(0);
        return;
      }
  
      let checkedVAT = VAT;
  
      if (VAT.includes(',')) {
        checkedVAT = VAT.replace(',', '.');
      }
  
      setVATPrice(
        (parseInt(priceWithoutVAT) * (parseFloat(checkedVAT) / 100))
        + parseInt(priceWithoutVAT)
      );
    }, [priceWithoutVAT, VAT]);
  
    useEffect(() => {
      if (discountValue === '' || VATPrice === 0) {
        setDiscountedPrice(VATPrice);
        return;
      }
  
      switch (selectedDiscountType) {
        case "discountRate":
          setDiscountedPrice(VATPrice - (parseInt(discountValue) / 100 * VATPrice));
          break;
  
        case "discount":
          setDiscountedPrice(VATPrice - parseInt(discountValue));
          break;
      
        default:
          break;
      }
    }, [selectedDiscountType, discountValue, VATPrice])
  
    return (
        <View style={styles.container}>
            <View style={{
                ...styles.subcontainer,
                marginTop: 20
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 20
                }}>Calcul de prix TTC</Text>
                <Text>Prix HT :</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={onChangePriceWithoutVAT}
                    value={priceWithoutVAT}
                    placeholder='Prix HT'
                />
                <Text>Taux de TVA (en %) :</Text>
                <TextInput
                    style={{
                        ...styles.input,
                    }}
                    keyboardType='numeric'
                    onChangeText={onChangeVAT}
                    value={VAT}
                    placeholder='Taux de TVA'
                />
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16
                }}>Prix TTC :</Text>
                <Text style={{
                    fontSize: 16
                }}>{VATPrice.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={{
                ...styles.subcontainer,
                marginTop: 20
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 20
                }}>Calcul de prix TTC avec Remise</Text>
                <Text>Remise :</Text>
                <View style={{
                    borderWidth: 1,
                    width: 110,
                    borderColor: colorScheme === 'dark' ? 'grey' : 'black'
                }}>
                    <Picker
                        dropdownIconColor={colorScheme === 'dark' ? 'lightgrey' : 'black'}
                        style={{
                            color: colorScheme === 'dark' ? 'grey' : 'black'
                        }}
                        selectedValue={selectedDiscountType}
                        onValueChange={(itemValue) =>
                           setSelectedDiscountType(itemValue)
                        }
                    >
                        <Picker.Item label="en %" value="discountRate" />
                        <Picker.Item label="forfait" value="discount" />
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={onChangeDiscountValue}
                    value={discountValue}
                    placeholder='Remise'
                />
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16
                }}>Prix TTC après remise :</Text>
                <Text style={{
                    fontSize: 16
                }}>{discountedPrice.toFixed(2).replace('.', ',')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    subcontainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 110,
        borderColor: colorScheme === 'dark' ? 'grey' : 'black',
        color: colorScheme === 'dark' ? 'lightgrey' : 'black'
    },
});
  
export default VATPriceScreen;