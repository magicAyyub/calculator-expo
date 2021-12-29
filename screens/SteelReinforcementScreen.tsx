import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, Dimensions, Appearance, TouchableOpacity, Keyboard } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { BarsCalculationResult, BarsObject } from '../types/SteelReinforcement';
import { bars } from '../data/SteelReinforcement';
import { numberFormat } from '../utils';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

async function getStoredSteelPrice() {
    const storedSteelPrice = await SecureStore.getItemAsync('steelPrice');

    if (storedSteelPrice) {
        return parseFloat(storedSteelPrice);
    }

    return null;
}

function addSpaces(spacesCount: number) {
    let spaces = '';

    for (let i = 0; i < spacesCount; i++) {
        spaces += ' ';
    }

    return spaces;
}

function SteelReinforcementScreen() {
    const [steelSectionValue, onChangeSteelSectionValue] = useState('');
    const [bedsCount, onChangeBedsCount] = useState('');
    const bedsCountInputRef = useRef<TextInput>(null);
    const [columnsCount, onChangeColumnsCount] = useState('');
    const columnsCountInputRef = useRef<TextInput>(null);
    const [workLength, onChangeWorkLength] = useState('');
    const workLengthInputRef = useRef<TextInput>(null);
    const [minBarDiameter, onChangeMinBarDiameter] = useState('');
    const minBarDiameterInputRef = useRef<TextInput>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const [detailsChoices, setDetailsChoices] = useState<string[]>([]);
    const [detailsChoicesToggles, setDetailsChoicesToggles] = useState([false, false]);

    useEffect(() => {
        (async () => {
            if (steelSectionValue === '' || bedsCount === '' || columnsCount === '') {
                setChoices([]);
                setDetailsChoices([]);
                return;
            }
    
            const floatSteelSection = parseFloat(steelSectionValue);
            const intBedsCount = parseInt(bedsCount);
            const intColumnsCount = parseInt(columnsCount);
            const intWorkLength = parseInt(workLength);
            const intMinBarDiameter = parseInt(minBarDiameter);
    
            const tmpChoices: string[] = [];
            const tmpDetailsChoices: string[] = [];
    
            async function getFirstChoiceOneTypeOfBars() {
                for (const bar of bars) {
                    if (!isNaN(intMinBarDiameter) && bar.diameter < intMinBarDiameter) {
                        continue;
                    }
    
                    const sectionsOneTypeOfBars = bar.section * intBedsCount * intColumnsCount;
        
                    if (sectionsOneTypeOfBars < floatSteelSection) {
                        continue;
                    }
    
                    const barsCount = intBedsCount * intColumnsCount;
                    
                    let firstChoiceText = (
                        `${barsCount} barres de ${bar.diameter} mm = ${sectionsOneTypeOfBars.toFixed(3)} cm²`
                    );
    
                    let firstChoiceDetailsText = (
                        `${barsCount} barres de ${bar.diameter} mm\``+
                        `(${barsCount} x ${bar.section} = ${sectionsOneTypeOfBars.toFixed(3)} cm²)`
                    );
    
                    let barsWeight = NaN;
    
                    if (!isNaN(intWorkLength)) {
                        barsWeight = intWorkLength * barsCount * bar.weight;
                    } else {
                        return [firstChoiceText, firstChoiceDetailsText];
                    }

                    firstChoiceText += '`';
                    firstChoiceDetailsText += '`';
                    firstChoiceDetailsText += (
                        `(${intWorkLength} m x ${barsCount} barres x ${bar.weight} kg = `
                    );

                    const storedSteelPrice = await getStoredSteelPrice();

                    if (barsWeight > 1000) {
                        const tonsWeight = `${(barsWeight / 1000).toFixed(3)} t`;
                        firstChoiceText += tonsWeight;
                        firstChoiceDetailsText += tonsWeight;

                        if (!storedSteelPrice) {
                            return [firstChoiceText, firstChoiceDetailsText];
                        }

                        firstChoiceDetailsText += '`';
                        firstChoiceDetailsText += (
                            `(${tonsWeight} t x ${storedSteelPrice}€/t = `
                        );
                    } else {
                        const kgsWeight = barsWeight.toFixed(3);
                        firstChoiceText += `${kgsWeight} kg`;
                        firstChoiceDetailsText += `${kgsWeight} kg)`;

                        if (!storedSteelPrice) {
                            return [firstChoiceText, firstChoiceDetailsText];
                        }

                        firstChoiceDetailsText += '`';
                        firstChoiceDetailsText += (
                            `(${kgsWeight} kg x ${storedSteelPrice}€/t = `
                        );
                    }
                    
                    const price = `${(barsWeight / 1000 * storedSteelPrice).toFixed(2)}€`;

                    firstChoiceText += ' | ';
                    firstChoiceText += price;
                    firstChoiceDetailsText += `${price})`;

                    return [firstChoiceText, firstChoiceDetailsText];
                }
    
                return ['', ''];
            }
    
            const [firstChoiceText, firstChoiceDetailsText] = await getFirstChoiceOneTypeOfBars();
            tmpChoices.push(firstChoiceText);
            tmpDetailsChoices.push(firstChoiceDetailsText);
    
            if (intBedsCount === 1) {
                if (firstChoiceText === '') {
                    return;
                }
    
                setChoices(tmpChoices);
                setDetailsChoices(tmpDetailsChoices);
                return;
            }
    
            function checkSameBars(resultBars: BarsObject) {
                let tmpCurrentValuesObj = null;
                let tmpCurrentValuesObjSame = true;
                let first = true;
    
                for (const values of Object.values(resultBars)) {
                    if (first) {
                        tmpCurrentValuesObj = values;
                        first = false;
                    }

                    tmpCurrentValuesObjSame = (
                        tmpCurrentValuesObjSame
                        && JSON.stringify(values) === JSON.stringify(tmpCurrentValuesObj)
                    );
                    
                }
    
                return tmpCurrentValuesObjSame;
            }
    
            function loopChoices(
                prevSections: number,
                remainingBedsCount: number,
                current: BarsObject,
                result: BarsCalculationResult
            ) {
                if (remainingBedsCount === 0) {
                    if (prevSections < floatSteelSection) {
                        return;
                    }
    
                    if (prevSections < result.total.sections) {
                        Object.assign(result.bars, current);
                        result.total.sections = prevSections;
                    }
    
                    return;
                }
    
                for (const bar of bars) {
                    if (!isNaN(intMinBarDiameter) && bar.diameter < intMinBarDiameter) {
                        continue;
                    }
    
                    if (bar.section > floatSteelSection) {
                        continue;
                    }
    
                    current[remainingBedsCount] = bar;
    
                    const currentSections = bar.section * intColumnsCount + prevSections;
            
                    loopChoices(currentSections, remainingBedsCount - 1, current, result);
                }
            }
    
            async function getSecondChoiceDifferentBars() {
                const result: BarsCalculationResult = { bars: {}, total: { sections: Infinity }};
    
                loopChoices(0, intBedsCount, {}, result);
    
                if (checkSameBars(result.bars)) {
                    return ['', ''];
                }

                const storedSteelPrice = await getStoredSteelPrice();
                let secondChoiceText = '';
                let secondChoiceDetailsText = '';
                let totalBarsWeight = 0;
    
                for (const bar of Object.values(result.bars)) {
                    secondChoiceText += (
                        `${intColumnsCount} barres de ${bar.diameter} mm = `
                        + `${(intColumnsCount * bar.section).toFixed(3)} cm²\``
                    );
    
                    secondChoiceDetailsText += (
                        `${intColumnsCount} barres de ${bar.diameter} mm\``
                        + `(${intColumnsCount} x ${bar.section} = ${(intColumnsCount * bar.section).toFixed(3)} cm²)\``
                    )
    
                    let barsWeight = NaN;
    
                    if (!isNaN(intWorkLength)) {
                        barsWeight = intWorkLength * intColumnsCount * bar.weight;
                        totalBarsWeight += barsWeight;
                    } else {
                        continue;
                    }
    
                    secondChoiceDetailsText += (
                        `(${intWorkLength} m x ${intColumnsCount} barres x ${bar.weight} kg = `
                    );

                    if (barsWeight > 1000) {
                        const tonsWeight = (barsWeight / 1000).toFixed(3);
                        secondChoiceText += `${tonsWeight} t`;
                        secondChoiceDetailsText += `${tonsWeight} t)\``;

                        if (!storedSteelPrice) {
                            secondChoiceText += '`';
                            continue;
                        }

                        secondChoiceDetailsText += (
                            `(${tonsWeight} t x ${storedSteelPrice}€/t = `
                        );

                    } else {
                        const kgsWeight = barsWeight.toFixed(3);
                        secondChoiceText += `${kgsWeight} kg`;
                        secondChoiceDetailsText += `${kgsWeight} kg)\``;

                        if (!storedSteelPrice) {
                            secondChoiceText += '`';
                            continue;
                        }

                        secondChoiceDetailsText += (
                            `(${kgsWeight} kg x ${storedSteelPrice}€/t = `
                        );
                    }       

                    const price = `${(barsWeight / 1000 * storedSteelPrice).toFixed(2)}€`;
                    
                    secondChoiceText += ' | ';
                    secondChoiceText += price;
                    secondChoiceText += '`';

                    secondChoiceDetailsText += `${price})\``;
                }
    
                secondChoiceText.substring(0, secondChoiceText.length - 1);

                let totalText = '';
                totalText += `Total : ${result.total.sections.toFixed(3)} cm²`;
    
                if (totalBarsWeight > 0) {
                    totalText += '`';
                    totalText += addSpaces(12);
    
                    if (totalBarsWeight > 1000) {
                        totalText += `${(totalBarsWeight / 1000).toFixed(3)} t`;
                    } else {
                        totalText += `${totalBarsWeight.toFixed(3)} kg`;
                    }

                    if (storedSteelPrice) {
                        totalText += '`';
                        totalText += addSpaces(12);
                        totalText += (
                            `${(totalBarsWeight / 1000 * storedSteelPrice).toFixed(2)}€`
                        );
                    }
                }

                secondChoiceText += totalText;
                secondChoiceDetailsText += totalText;
                
                return [secondChoiceText, secondChoiceDetailsText];
            }
    
            const [secondChoiceText, secondChoiceDetailsText] = await getSecondChoiceDifferentBars();
            if (secondChoiceText !== '') {
                tmpChoices.push(secondChoiceText);
                tmpDetailsChoices.push(secondChoiceDetailsText);
            }
    
            setChoices(tmpChoices);
            setDetailsChoices(tmpDetailsChoices);
        })();
    }, [steelSectionValue, bedsCount, columnsCount, workLength, minBarDiameter]);

    function renderForm() {
        return (
            <View style={{
                flex: 1,
                ...styles.subcontainer,
                paddingTop: 20,
                paddingBottom: 20
            }}>
                <Text style={{
                    ...styles.textColor,
                    fontWeight: 'bold',
                    fontSize: 20
                }}>Calcul de ferraillage</Text>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <Text style={{
                        ...styles.textColor,
                        ...styles.formLeftText,
                        ...styles.formSingleLineText
                    }}>Section d'aciers</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        onChangeText={onChangeSteelSectionValue}
                        value={steelSectionValue}
                        placeholder="Section d'aciers"
                        placeholderTextColor={colorScheme === 'dark' ? 'grey' : 'lightgrey'}
                        autoFocus={true}
                        blurOnSubmit={false}
                        onSubmitEditing={() => bedsCountInputRef.current?.focus()}
                    />
                    <Text style={{ ...styles.textColor, width: 40, marginTop: 21}}>cm²</Text>
                </View>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={{
                        ...styles.textColor,
                        ...styles.formLeftText,
                        ...styles.formSingleLineText
                    }}>Nb de lits</Text>
                    <TextInput
                        ref={bedsCountInputRef}
                        style={styles.input}
                        keyboardType='number-pad'
                        onChangeText={onChangeBedsCount}
                        value={bedsCount}
                        placeholder='Nb de lits'
                        placeholderTextColor={colorScheme === 'dark' ? 'grey' : 'lightgrey'}
                        blurOnSubmit={false}
                        onSubmitEditing={() => columnsCountInputRef.current?.focus()}
                    />
                    <View style={{ width:40 }}></View>
                </View>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={{
                        ...styles.textColor,
                        ...styles.formLeftText,
                        ...styles.formSingleLineText
                    }}>Nb de colonnes</Text>
                    <TextInput
                        ref={columnsCountInputRef}
                        style={styles.input}
                        keyboardType='number-pad'
                        onChangeText={onChangeColumnsCount}
                        value={columnsCount}
                        placeholder='Nb de colonnes'
                        placeholderTextColor={colorScheme === 'dark' ? 'grey' : 'lightgrey'}
                        blurOnSubmit={false}
                        onSubmitEditing={() => workLengthInputRef.current?.focus()}
                    />
                    <View style={{ width:40 }}></View>
                </View>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={{
                        ...styles.textColor,
                        ...styles.formLeftText,
                        ...styles.formTwoLinesText
                    }}>Longueur de l'ouvrage</Text>
                    <TextInput
                        ref={workLengthInputRef}
                        style={styles.input}
                        keyboardType='number-pad'
                        onChangeText={onChangeWorkLength}
                        value={workLength}
                        placeholder="Longueur de l'ouvrage"
                        placeholderTextColor={colorScheme === 'dark' ? 'grey' : 'lightgrey'}
                        blurOnSubmit={false}
                        onSubmitEditing={() => minBarDiameterInputRef.current?.focus()}
                    />
                    <Text style={{ ...styles.textColor, width:40, marginTop: 21 }}>m</Text>
                </View>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={{
                        ...styles.textColor,
                        ...styles.formLeftText,
                        ...styles.formTwoLinesText
                    }}>Diamètre minimum</Text>
                    <TextInput
                        ref={minBarDiameterInputRef}
                        style={styles.input}
                        keyboardType='number-pad'
                        onChangeText={onChangeMinBarDiameter}
                        value={minBarDiameter}
                        placeholder='Diamètre minimum'
                        placeholderTextColor={colorScheme === 'dark' ? 'grey' : 'lightgrey'}
                    />
                    <Text style={{ ...styles.textColor, width:40, marginTop: 21 }}>mm</Text>
                </View>
            </View>
        );
    }

    function toggleDetailsChoice(index: number) {
        Keyboard.dismiss();
        let newDetailsChoicesToggles = [...detailsChoicesToggles];
        newDetailsChoicesToggles[index] = !detailsChoicesToggles[index];
        setDetailsChoicesToggles(newDetailsChoicesToggles);
    }

    function renderResult() {
        let choicesResult = [];

        function renderChoiceRow(item: string, parentIndex: number, index: number) {
            return (
                <View key={index}>
                    { index === 0 ?
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{
                                ...styles.textColor,
                                width: 130,
                                marginTop: 20,
                                textAlign: 'right',
                            }}>
                                Choix {parentIndex + 1} :
                            </Text>
                            <Text style={{
                                ...styles.textColor,
                                marginTop: 20,
                                marginLeft: 12,
                                paddingLeft: 10,
                                width: workLength === '' ? 240 : 290
                            }}>{numberFormat(item)}</Text>
                        </View>
                    :
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <View style={{ width: 130 }}/>
                            <Text style={{
                                ...styles.textColor,
                                marginLeft: 12,
                                paddingLeft: 10,
                                width: workLength === '' ? 240 : 290
                            }}>{numberFormat(item)}</Text>
                        </View>
                    }
                </View>
            )
        }

        for (let i = 0; i < choices.length; i++) {
            choicesResult.push(
                !detailsChoicesToggles[i] ? (
                    <TouchableOpacity
                        key={i}
                        onPress={() => toggleDetailsChoice(i)}
                    >
                        {choices[i].split('`').map((subitem, j) => (
                            renderChoiceRow(subitem, i , j)
                        ))}
                    </TouchableOpacity>
                ):(
                    <TouchableOpacity
                        key={i}
                        onPress={() => toggleDetailsChoice(i)}
                    >
                        {detailsChoices[i] && detailsChoices[i].split('`').map((subitem, j) => (
                            renderChoiceRow(subitem, i , j)
                        ))}
                    </TouchableOpacity>
                )
            );
        }

        return (
            <View style={{
                ...styles.subcontainer,
                paddingTop: 20,
            }}>
                {choices.length ?
                    <Text style={{
                        ...styles.textColor,
                        fontWeight: 'bold',
                        fontSize: 20
                    }}>Choix</Text>
                :
                    null
                } 
                {choicesResult.map((item, i) => item)}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                scrollIndicatorInsets={{ right: 1 }}
                style={{
                    width: screenWidth,
                    height: screenHeight
                }}
                keyboardShouldPersistTaps={'handled'}
            >
                {renderForm()}
                {renderResult()}
            </ScrollView>
        </SafeAreaView>
    );
}

const colorScheme = Appearance.getColorScheme();

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
    formLeftText: {
        width: 120,
        textAlign: 'right'
    },
    formSingleLineText: {
        marginTop: 21
    },
    formTwoLinesText: {
        marginTop: 13
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 160,
        borderColor: colorScheme === 'dark' ? 'grey' : 'black',
        color: colorScheme === 'dark' ? 'lightgrey' : 'black'
    },
});

export default SteelReinforcementScreen;