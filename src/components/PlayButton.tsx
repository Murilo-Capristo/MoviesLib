import "../i18n";

import {useTranslation} from 'react-i18next';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useContext } from "react"
import { AppContext } from "../../App"
import { APP_COLORS } from "../colors/colors"
import { t } from "i18next";

type Props = {
    onPress: () => void
}

export default function PlayButton({ onPress }: Props) {
    const { value, setValue } = useContext(AppContext)
    const { t } = useTranslation();
    

    return(
        <TouchableOpacity onPress={ onPress }>
            <View style={ styles.container }>
                <View style={ styles.playButton }>
                    <FontAwesome6 name="play" size={18} color={APP_COLORS[Number(value)]} />
                </View>
                <Text style={ styles.text }>{t("trailer")}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#e8e8e8',
        height: 42,
        borderRadius: 21,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 2,
        alignSelf: 'flex-start'
    },
    playButton: {
        backgroundColor: 'white',
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 2,
        paddingLeft: 4
    },
    text: {
        marginLeft: 8,
        marginRight: 14,
        fontSize: 16,
        fontWeight: '600'
    }
})