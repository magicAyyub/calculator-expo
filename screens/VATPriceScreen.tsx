import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Appearance } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRef } from 'react';

const colorScheme = Appearance.getColorScheme();

export function VATPriceScreen() {
    const [priceWithoutVAT, onChangePriceWithoutVAT] = useState('');
    const [VAT, onChangeVAT] = useState('');
    const VATInputRef = useRef<TextInput>(null);
    const [VATPrice, setVATPrice] = useState(0);
    const [discountValue, onChangeDiscountValue] = useState('');
    const discountValueInputRef = useRef<TextInput>(null);
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
                    ...styles.textColor,
                    fontWeight: 'bold',
                    fontSize: 20
                }}>Calcul de prix TTC</Text>
                <Text style={styles.textColor}>Prix HT :</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={onChangePriceWithoutVAT}
                    value={priceWithoutVAT}
                    placeholder='Prix HT'
                    placeholderTextColor={colorScheme === 'dark' ? 'grey' : 'lightgrey'}
                    autoFocus={true}
                    blurOnSubmit={false}
                    onSubmitEditing={() => VATInputRef.current?.focus()}
                />
                <Text style={styles.textColor}>Taux de TVA (en %) :</Text>
                <TextInput
                    ref={VATInputRef}
                    style={{
                        ...styles.input,
                    }}
                    keyboardType='numeric'
                    onChangeText={onChangeVAT}
                    value={VAT}
                    placeholder='Taux de TVA'
                    placeholderTextColor={colorScheme === 'dark' ? 'grey' : 'lightgrey'}
                    blurOnSubmit={false}
                    onSubmitEditing={() => discountValueInputRef.current?.focus()}
                />
                <Text style={{
                    ...styles.textColor,
                    fontWeight: 'bold',
                    fontSize: 16
                }}>Prix TTC :</Text>
                <Text style={{
                    ...styles.textColor,
                    fontSize: 16
                }}>{VATPrice.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={{
                ...styles.subcontainer,
                marginTop: 20
            }}>
                <Text style={{
                    ...styles.textColor,
                    fontWeight: 'bold',
                    fontSize: 20
                }}>Calcul de prix TTC avec Remise</Text>
                <Text style={styles.textColor}>Remise :</Text>
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
                    ref={discountValueInputRef}
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={onChangeDiscountValue}
                    value={discountValue}
                    placeholder='Remise'
                    placeholderTextColor={colorScheme === 'dark' ? 'grey' : 'lightgrey'}
                />
                <Text style={{
                    ...styles.textColor,
                    fontWeight: 'bold',
                    fontSize: 16
                }}>Prix TTC après remise :</Text>
                <Text style={{
                    ...styles.textColor,
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
        backgroundColor: colorScheme === 'dark' ? '#18191a' : 'white',
    },
    subcontainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textColor: {
        color: colorScheme === 'dark' ? 'lightgrey' : 'black',
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