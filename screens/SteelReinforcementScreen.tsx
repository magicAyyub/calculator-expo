import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';

const diameters = {
    5: {
        section: 0.196,
        weight: 0.154
    },
    6: {
        section: 0.282,
        weight: 0.222
    },
    8: {
        section: 0.502,
        weight: 0.394
    },
    10: {
        section: 0.785,
        weight: 0.616
    },
    12: {
        section: 1.13,
        weight: 0.887
    },
    14: {
        section: 1.54,
        weight: 1.208
    },
    16: {
        section: 2.01,
        weight: 1.578
    },
    20: {
        section: 3.14,
        weight: 2.466
    },
    25: {
        section: 4.91,
        weight: 3.853
    },
    32: {
        section: 8.04,
        weight: 6.313
    },
    40: {
        section: 12.57,
        weight: 9.864
    }
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function SteelReinforcementScreen() {
    const [steelSectionValue, onChangeSteelSectionValue] = useState('');
    const [bedsCount, onChangeBedsCount] = useState('');
    const [columnsCount, onChangeColumnsCount] = useState('');
    const [workLength, onChangeWorkLength] = useState('');
    const [minBarDiameter, onChangeMinBarDiameter] = useState('');
    const [choices, setChoices] = useState<string[]>([]);
    

    useEffect(() => {
        if (steelSectionValue === '' || bedsCount === '' || columnsCount === '') {
            setChoices([]);
            return;
        }

        const floatSteelSection = parseFloat(steelSectionValue);
        const intBedsCount = parseInt(bedsCount);
        const intColumnsCount = parseInt(columnsCount);
        const intWorkLength = parseInt(workLength);
        const intMinBarDiameter = parseInt(minBarDiameter);

        const tmpChoices: string[] = [];

        function getFirstChoiceSameBars() {
            for (const [diameter, value] of Object.entries(diameters)) {
                if (!isNaN(intMinBarDiameter) && parseInt(diameter) < intMinBarDiameter) {
                    continue;
                }

                const section = value['section'];

                const sectionsSameBars = section * intBedsCount * intColumnsCount;
    
                if (sectionsSameBars < floatSteelSection) {
                    continue;
                }

                const barsCount = intBedsCount * intColumnsCount;
                const weight = value['weight'];

                let barsWeight = NaN;
                if (!isNaN(intWorkLength)) {
                    barsWeight = intWorkLength * barsCount * weight;
                }
    
                let firstChoiceText = (
                    `${barsCount} barres de ${diameter} mm|`+
                    `(${barsCount} x ${section} = ${sectionsSameBars.toFixed(3)} cm²)`
                );

                if (!isNaN(barsWeight)) {
                    firstChoiceText += '|';
                    firstChoiceText += (
                        `(${intWorkLength} m x ${barsCount} barres x ${weight} kg = `
                    );

                    if (barsWeight > 1000) {
                        firstChoiceText += `${barsWeight / 1000} t)`;
                        return firstChoiceText;
                    }

                    firstChoiceText += `${barsWeight} kg)`;
                    return firstChoiceText;
                }

                return firstChoiceText;
            }

            return '';
        }

        const firstChoiceSameBars = getFirstChoiceSameBars();
        tmpChoices.push(firstChoiceSameBars);

        if (intBedsCount === 1) {
            if (firstChoiceSameBars === '') {
                return;
            }

            setChoices(tmpChoices);
            return;
        }

        function checkSameBars(current: {[key: string]: {}}) {
            let tmpCurrentValuesObj = null;
            let tmpCurrentValuesObjSame = true;
            let first = true;

            for (const [key, values] of Object.entries<{[key: string]: {}}>(current)) {
                if (key === 'sections') {
                    continue;
                }

                if (first) {
                    tmpCurrentValuesObj = values;
                    first = false;
                }

                tmpCurrentValuesObjSame = tmpCurrentValuesObjSame
                                          && JSON.stringify(values) === JSON.stringify(tmpCurrentValuesObj);
                
            }

            return tmpCurrentValuesObjSame;
        }

        function loopChoices(
            prevSections: number,
            remainingBedsCount: number,
            current: {[key: string]: {}},
            tmp: {[key: string]: {}}
        ) {
            if (remainingBedsCount === 0) {
                if (current['sections'] < floatSteelSection) {
                    return;
                }

                if (current['sections'] < tmp['sections']) {
                    Object.assign(tmp, current);
                }

                return;
            }

            for (const [diameter, value] of Object.entries(diameters)) {
                if (!isNaN(intMinBarDiameter) && parseInt(diameter) < intMinBarDiameter) {
                    continue;
                }

                const section = value['section'];
                const weight = value['weight'];

                if (section > floatSteelSection) {
                    continue;
                }

                const sections = section * intColumnsCount;
                current[remainingBedsCount] = {
                    diameter,
                    section,
                    sections,
                    weight
                };

                const currentSections = sections + prevSections; 
                current['sections'] = currentSections
        
                loopChoices(currentSections, remainingBedsCount - 1, current, tmp);
            }
        }

        function getSecondChoiceDifferentBars() {
            const result: {
                      [key: string]: any
                      'sections': number
                  } = { 'sections': Infinity };

            loopChoices(0, intBedsCount, {}, result);

            let secondChoiceText = '';

            if (checkSameBars(result)) {
                return '';
            }
            
            for (const [key, value] of Object.entries(result)) {
                if (key === 'sections') {
                    continue;
                }
                
                secondChoiceText += `${intColumnsCount} barres de ${value['diameter']} mm|`;
                secondChoiceText += `(${intColumnsCount} x ${value['section']} = ${value['sections'].toFixed(3)} cm²)|`

            }

            secondChoiceText.substring(0, secondChoiceText.length - 1);
            secondChoiceText += `Total : ${result['sections'].toFixed(3)} cm²`;

            return secondChoiceText;
        }

        const secondChoiceDifferentBars = getSecondChoiceDifferentBars();

        if (secondChoiceDifferentBars !== '') {
            tmpChoices.push(secondChoiceDifferentBars);
        }

        setChoices(tmpChoices);

    }, [steelSectionValue, bedsCount, columnsCount, workLength, minBarDiameter]);

    const renderForm = () => (
        <View style={{
            flex: 1,
            ...styles.subcontainer,
            paddingTop: 20,
            paddingBottom: 20
        }}>
            <Text style={{
                fontWeight: 'bold',
                fontSize: 20
            }}>Calcul de ferraillage</Text>
            <View style={{
                flexDirection: 'row',
            }}>
                <Text style={{ width: 120, marginTop: 21, textAlign: 'right' }}>Section d'aciers</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={onChangeSteelSectionValue}
                    value={steelSectionValue}
                    placeholder="Section d'aciers"
                />
                <Text style={{ width: 40, marginTop: 21}}>cm²</Text>
            </View>
            <View style={{
                flexDirection: 'row'
            }}>
                <Text style={{ width: 120, marginTop: 21, textAlign: 'right' }}>Nb de lits</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={onChangeBedsCount}
                    value={bedsCount}
                    placeholder='Nb de lits'
                />
                <View style={{ width:40 }}></View>
            </View>
            <View style={{
                flexDirection: 'row'
            }}>
                <Text style={{ width: 120, marginTop: 21, textAlign: 'right' }}>Nb de colonnes</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={onChangeColumnsCount}
                    value={columnsCount}
                    placeholder='Nb de colonnes'
                />
                <View style={{ width:40 }}></View>
            </View>
            <View style={{
                flexDirection: 'row'
            }}>
                <Text style={{ width: 120, marginTop: 13, textAlign: 'right' }}>Longueur de l'ouvrage</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={onChangeWorkLength}
                    value={workLength}
                    placeholder="Longueur de l'ouvrage"
                />
                <Text style={{ width:40, marginTop: 21 }}>m</Text>
            </View>
            <View style={{
                flexDirection: 'row'
            }}>
                <Text style={{ width: 120, marginTop: 13, textAlign: 'right' }}>Diamètre minimum</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={onChangeMinBarDiameter}
                    value={minBarDiameter}
                    placeholder='Diamètre minimum'
                />
                <Text style={{ width:40, marginTop: 21 }}>mm</Text>
            </View>
        </View>
    );

    const renderResult = () => (
        <View style={{
            ...styles.subcontainer,
            paddingTop: 20,
        }}>
            {choices.length ?
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 20
                }}>Choix</Text>
            :
                null
            } 
            {choices.map((item, i) => item.split('|').map((subitem, j) => (
                <View key={j}>
                    { j === 0 ?
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{ width: 130, marginTop: 20, textAlign: 'right' }}>
                                Choix {i+1} :
                            </Text>
                            <Text style={{
                                height: 20,
                                marginTop: 20,
                                marginLeft: 12,
                                paddingLeft: 10,
                                width: workLength === '' ? 210 : 290
                            }}>{subitem}</Text>
                        </View>
                    :
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <View style={{ width: 130 }}/>
                            <Text style={{
                                height: 20,
                                marginLeft: 12,
                                paddingLeft: 10,
                                width: workLength === '' ? 210 : 290
                            }}>{subitem.replace(/\./ig, ',')}</Text>
                        </View>
                    }
                </View>
            )))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                scrollIndicatorInsets={{ right: 1 }}
                style={{
                    width: screenWidth,
                    height: screenHeight
                }}
            >
                {renderForm()}
                {renderResult()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        width: 160
    },
});

export default SteelReinforcementScreen;