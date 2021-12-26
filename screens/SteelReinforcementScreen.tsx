import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, Dimensions, Appearance } from 'react-native';

type BarData = {
    diameter: number; // mm
    section: number; // cm²
    weight: number; // kg
}

type BarsDataArray = BarData[];

type BarsDataObject = {
    [key: string]: BarData
}

type BarsDataResult = {
    bars: BarsDataObject,
    total: {
        sections: number
    }
}

const bars: BarsDataArray = [
    {
        diameter: 5,
        section: 0.196,
        weight: 0.154
    },
    {
        diameter: 6,
        section: 0.282,
        weight: 0.222
    },
    {
        diameter: 8,
        section: 0.502,
        weight: 0.394
    },
    {
        diameter: 10,
        section: 0.785,
        weight: 0.616
    },
    {
        diameter: 12,
        section: 1.13,
        weight: 0.887
    },
    {
        diameter: 14,
        section: 1.54,
        weight: 1.208
    },
    {
        diameter: 16,
        section: 2.01,
        weight: 1.578
    },
    {
        diameter: 20,
        section: 3.14,
        weight: 2.466
    },
    {
        diameter: 25,
        section: 4.91,
        weight: 3.853
    },
    {
        diameter: 32,
        section: 8.04,
        weight: 6.313
    },
    {
        diameter: 40,
        section: 12.57,
        weight: 9.864
    }
];

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
            for (const bar of bars) {
                if (!isNaN(intMinBarDiameter) && bar.diameter < intMinBarDiameter) {
                    continue;
                }

                const sectionsSameBars = bar.section * intBedsCount * intColumnsCount;
    
                if (sectionsSameBars < floatSteelSection) {
                    continue;
                }

                const barsCount = intBedsCount * intColumnsCount;
                
                let firstChoiceText = (
                    `${barsCount} barres de ${bar.diameter} mm|`+
                    `(${barsCount} x ${bar.section} = ${sectionsSameBars.toFixed(3)} cm²)`
                );

                let barsWeight = NaN;

                if (!isNaN(intWorkLength)) {
                    barsWeight = intWorkLength * barsCount * bar.weight;
                }

                if (!isNaN(barsWeight)) {
                    firstChoiceText += '|';
                    firstChoiceText += (
                        `(${intWorkLength} m x ${barsCount} barres x ${bar.weight} kg = `
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

        function checkSameBars(resultBars: BarsDataObject) {
            let tmpCurrentValuesObj = null;
            let tmpCurrentValuesObjSame = true;
            let first = true;

            for (const values of Object.values(resultBars)) {
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
            current: BarsDataObject,
            result: BarsDataResult
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

        function getSecondChoiceDifferentBars() {
            const result: BarsDataResult = { bars: {}, total: { sections: Infinity }};

            loopChoices(0, intBedsCount, {}, result);

            if (checkSameBars(result.bars)) {
                return '';
            }

            let secondChoiceText = '';
            let totalBarsWeight = 0;

            for (const bar of Object.values(result.bars)) {
                secondChoiceText += (
                    `${intColumnsCount} barres de ${bar.diameter} mm = `
                    + `${(intColumnsCount * bar.section).toFixed(3)} cm²|`
                );

                // TODO: add details calculation
                // secondChoiceText += (
                //     `(${intColumnsCount} x ${bar.section} = ${(intColumnsCount * bar.section).toFixed(3)} cm²)|`
                // )

                let barsWeight = NaN;

                if (!isNaN(intWorkLength)) {
                    barsWeight = intWorkLength * intColumnsCount * bar.weight;
                    totalBarsWeight += barsWeight;
                }

                if (!isNaN(barsWeight)) {
                    secondChoiceText += (
                        `(${intWorkLength} m x ${intColumnsCount} barres x ${bar.weight} kg = `
                    );

                    if (barsWeight > 1000) {
                        secondChoiceText += `${barsWeight / 1000} t)`;
                        secondChoiceText += '|';
                        continue;
                    }

                    secondChoiceText += `${barsWeight} kg)`;
                    secondChoiceText += '|';
                }
            }

            secondChoiceText.substring(0, secondChoiceText.length - 1);
            secondChoiceText += `Total : ${result.total.sections.toFixed(3)} cm²`;

            if (totalBarsWeight > 0) {
                secondChoiceText += '|';

                if (totalBarsWeight > 1000) {
                    secondChoiceText += `            ${totalBarsWeight / 1000} t`;
                    return secondChoiceText;
                }
    
                secondChoiceText += `            ${totalBarsWeight} kg`;
            }
            
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
                <Text style={{
                    ...styles.textColor,
                    ...styles.formLeftText,
                    ...styles.formSingleLineText
                }}>Nb de colonnes</Text>
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
                <Text style={{
                    ...styles.textColor,
                    ...styles.formLeftText,
                    ...styles.formTwoLinesText
                }}>Longueur de l'ouvrage</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={onChangeWorkLength}
                    value={workLength}
                    placeholder="Longueur de l'ouvrage"
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
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={onChangeMinBarDiameter}
                    value={minBarDiameter}
                    placeholder='Diamètre minimum'
                />
                <Text style={{ ...styles.textColor, width:40, marginTop: 21 }}>mm</Text>
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
                    ...styles.textColor,
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
                            <Text style={{
                                ...styles.textColor,
                                width: 130,
                                marginTop: 20,
                                textAlign: 'right',
                            }}>
                                Choix {i+1} :
                            </Text>
                            <Text style={{
                                ...styles.textColor,
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
                                ...styles.textColor,
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

const colorScheme = Appearance.getColorScheme();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colorScheme === 'dark' ? '#18191a' : 'black',
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