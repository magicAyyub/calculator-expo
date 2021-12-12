import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

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

function objectIsEmpty(obj: {}) {
    return obj
           && Object.keys(obj).length === 0
           && Object.getPrototypeOf(obj) === Object.prototype;
}

function SteelReinforcementScreen() {
    const [steelSectionValue, onChangeSteelSectionValue] = useState('');
    const [bedsCount, onChangeBedsCount] = useState('');
    const [columnsCount, onChangeColumnsCount] = useState('');
    const [choices, setChoices] = useState<string[]>([]);

    useEffect(() => {
        if (steelSectionValue === '' || bedsCount === '' || columnsCount === '') {
            setChoices([]);
            return;
        }

        const floatSteelSection = parseFloat(steelSectionValue);
        const intBedsCount = parseInt(bedsCount);
        const intColumnsCount = parseInt(columnsCount);

        const tmpChoices = []

        for (const [diameter, values] of Object.entries(diameters)) {
            const section = values['section'];

            const sectionsOneType = section * intBedsCount * intColumnsCount;

            if (sectionsOneType > floatSteelSection) {
                tmpChoices.push(
                    `${intBedsCount * intColumnsCount} barres de ${diameter} mm | `+
                    `(${intBedsCount * intColumnsCount} x ${section} = ${sectionsOneType.toFixed(3)} cm²)`
                );
                break;function checkSameColumns(current: {[key: string]: {}}) {
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
            }
        }

        if (intBedsCount === 1) {
            setChoices(tmpChoices);
            return;
        }

        function checkSameColumns(current: {[key: string]: {}}) {
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

        function getChoicesText() {
            const current: {[key: string]: {}} = {};
            const tmp: {
                      [key: string]: any
                      'sections': number
                  } = { 'sections': Infinity };

            loopChoices(0, intBedsCount, current, tmp);

            let choicesText = '';

            if (checkSameColumns(tmp)) {
                return '';
            }
            
            for (const [key, value] of Object.entries(tmp)) {
                if (key === 'sections') {
                    continue;
                }
                
                choicesText += `${intColumnsCount} barres de ${value['diameter']} mm|`;
                choicesText += `(${intColumnsCount} x ${value['section']} = ${value['sections'].toFixed(3)} cm²)|`
            }

            choicesText.substring(0, choicesText.length - 1);
            choicesText += `Total : ${tmp['sections'].toFixed(3)} cm²`;
            return choicesText;
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
                const section = value['section'];

                if (section > floatSteelSection) {
                    continue;
                }

                const sections = section * intColumnsCount;
                current[remainingBedsCount] = {
                    diameter,
                    section,
                    sections
                };

                const currentSections = sections + prevSections; 
                current['sections'] = currentSections
        
                loopChoices(currentSections, remainingBedsCount - 1, current, tmp);
            }
        }

        const choicesText = getChoicesText();

        if (choicesText !== '') {
            tmpChoices.push(choicesText);
        }

        setChoices(tmpChoices);

    }, [steelSectionValue, bedsCount, columnsCount]);

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView scrollIndicatorInsets={{ right: 1 }}>
            <View style={{
                flex: 1,
                ...styles.subcontainer,
                marginTop: 20
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 20
                }}>Calcul de ferraillage</Text>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={{ width: 120, marginTop: 21, textAlign: 'right' }}>Section d'aciers :</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        onChangeText={onChangeSteelSectionValue}
                        value={steelSectionValue}
                        placeholder="Section d'aciers"
                    />
                    <Text style={{ width: 40, marginTop: 20}}>cm²</Text>
                </View>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={{ width: 120, marginTop: 21, textAlign: 'right' }}>Nb de lits :</Text>
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
                    <Text style={{ width: 120, marginTop: 21, textAlign: 'right' }}>Nb de colonnes :</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='number-pad'
                        onChangeText={onChangeColumnsCount}
                        value={columnsCount}
                        placeholder='Nb de colonnes'
                    />
                    <View style={{ width:40 }}></View>
                </View>
            </View>
            <View style={{
                ...styles.subcontainer,
                marginTop: 20
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
                                    width: 210
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
                                    width: 210
                                }}>{subitem.replace(/\./ig, ',')}</Text>
                            </View>
                        }
                    </View>
                )))}
            </View>
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
        width: 130
    },
});

export default SteelReinforcementScreen;