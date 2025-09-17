import "../i18n";

import {useTranslation} from 'react-i18next';

import { View, StyleSheet, Text, TextInput, Switch } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useState, useEffect, useContext} from "react"
import { s, vs } from "react-native-size-matters"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AppContext } from "../../App"
import { APP_COLORS } from "../colors/colors"

const SettingsScreen = () => {
    const [theme, setTheme] = useState<number | null>(null)
    const [autoPlay, setAutoPlay] = useState<boolean | null>(null)
    const [category, setCategory] = useState<string | null>(null)
    const { value, setValue } = useContext(AppContext)

    if (!setValue) {
        throw new Error("AppContext não encontrado. Verifique se AppProvider envolve suas telas")
    }
  const { t } = useTranslation();

    const loadData = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem("theme")
            const storedAutoPlay = await AsyncStorage.getItem("autoPlay")
            const storedCategory = await AsyncStorage.getItem("category")

            if (storedTheme !== null) setTheme(Number(storedTheme))
            if (storedAutoPlay !== null) setAutoPlay(storedAutoPlay === "true")
            if (storedCategory !== null) setCategory(storedCategory)
        } catch(error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (theme != null) {
            AsyncStorage.setItem("theme", String(theme))
            setValue(String(theme))
        }
    }, [theme])

    useEffect(() => {
        if (autoPlay != null) {
            AsyncStorage.setItem("autoPlay", String(autoPlay))
        }
    }, [autoPlay])

    useEffect(() => {
        if (category != null) {
            AsyncStorage.setItem("category", category)
        }
    }, [category])

    return(
        <SafeAreaProvider>
            <SafeAreaView style={ styles.container }>
                <Text style={ styles.title }>Ajustes</Text>
                <Text style={styles.sectionTitle}>TEMA</Text>
                <SegmentedControl
                    style={{ marginBottom: 32 }}
                    values={["Vermelho", "Azul", "Laranja"]}
                    selectedIndex={Number(theme)}
                    onChange={(event) => {
                        setTheme(event.nativeEvent.selectedSegmentIndex)
                    }}
                />
                <View style={styles.autoPlaySelection}>
                    <Text style={[styles.sectionTitle, {marginBottom: 0}]}>AUTOPLAY</Text>
                    <Switch
                        value={autoPlay}
                        onValueChange={setAutoPlay}
                        trackColor={{false: "#bbbbbb", true: APP_COLORS[Number(theme)]}}
                        thumbColor={'white'}
                        ios_backgroundColor="bbbbbb"
                    />
                </View>
                <Text style={ styles.sectionTitle }>CATEGORIA FAVORITA</Text>
                <TextInput
                    style={ styles.input }
                    value={ category }
                    onChangeText={ setCategory }
                    placeholder="Entre com sua categoria favorita"
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: s(12),
        color: '#8d8d8d',
        marginBottom: 14
    },
    autoPlaySelection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    input: {
        height: 42,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20
    }
})
