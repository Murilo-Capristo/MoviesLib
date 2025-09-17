import "../i18n";

import LottieView from "lottie-react-native";

import {useTranslation} from 'react-i18next';

import { View, StyleSheet, Text, Image, ScrollView, Alert, Touchable, TouchableOpacity } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"    
import PlayButton from "../components/PlayButton"

import { useFocusEffect, useRoute } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"

import { getTrailerUrl } from '../services/movieService'
import { Video, ResizeMode } from 'expo-av'
import { useState, useEffect, useRef, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { t } from "i18next";

const MovieDetailsScreen = () => {

    const route = useRoute()
    const { movie } = route.params as { movie: Movie }
    const [showVideo, setShowVideo] = useState(false) // Quando true, exibe o trailer
    const [trailer, setTrailer] = useState("")

    const showTrailer = async () => {
        try {
            const trailerUrl = await getTrailerUrl(movie.title)
            console.log("Trailer do filme: ", trailerUrl)
            setTrailer(trailerUrl)
            setShowVideo(true)
        } catch (error) {
            Alert.alert("Ops!", "Trailer não encontrado!")
        }
    }

    const heart = useRef<LottieView>(null)

    // Função que carrega dados do AsyncStorage
    const loadData = async () => {
        try {
            const storedAutoPlay = await AsyncStorage.getItem("autoPlay")
            if (storedAutoPlay === "true") {
                showTrailer()
            }
        } catch (error) {
            console.error("Erro ao carregar os ajustes:", error)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    useFocusEffect(
        useCallback(() => {
            heart.current?.reset()

        }, [])
    )

    const { t } = useTranslation();

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Image */}
                <View>
                    <Image 
                        source={{ uri: movie.poster }} 
                        style={{ width: '100%', height: 320 }}
                    />
                    <LinearGradient
                        colors={['transparent', 'white']}
                        style={ styles.gradient }
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0, y: 1 }}
                    />

                    { showVideo && (
                        <Video
                            source={ {uri: trailer} } // Origem do vídeo
                            rate={ 1.0 } // Velocidade
                            volume={ 1.0 } // Volume
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay
                            useNativeControls
                            style={ [styles.gradient, { backgroundColor: 'black' }] }
                        />
                    )}
                </View>

                <View style={ styles.content }>
                    {/* Título */}
                    <Text style={{ fontSize: 32, fontWeight: 'bold', marginVertical: 12 }}>
                        { movie.title }
                    </Text>

                    {/* Nota */}
                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                        <View style={{ position: "absolute"}}>
                            <TouchableOpacity onPress={() => heart.current?.play()}>
                                <LottieView 
                                    ref={heart}
                                    source={require('../animations/Active heart.json')}
                                    autoPlay={false}
                                    loop={false}
                                    style={styles.heart}
                                    />    

                            </TouchableOpacity>
                        </View>
                            <AntDesign name="star" size={20} color='#f7cb46' />
                            <Text 
                                style={[styles.text, { marginBottom: 12 }]}
                            >
                                { movie.rating }/10
                            </Text>
                    </View>

                    {/* Categorias */}
                    <Text style={[styles.text, { marginBottom: 12 }]}>
                        { movie.categories }
                    </Text>

                    <PlayButton onPress={() => showTrailer()} />

                    {/* Sinopse */}
                    <ScrollView 
                        style={ styles.synopsisContainer }
                        contentContainerStyle={ styles.synopsisContent }
                    >
                        <Text style={[styles.text, {
                                marginBottom: 12, 
                                fontSize: 18, 
                                fontWeight: '600'}]}
                        >
                            {t("synopsis")}
                        </Text>
                        <Text style={[styles.text, { marginBottom: 24 }]}>
                            {movie.synopsis}
                        </Text>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default MovieDetailsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        flex: 1
    },
    text: {
        fontSize: 17
    },
    synopsisContainer: {
        flex: 1,
        backgroundColor: '#e8e8e8',
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 12
    },
    synopsisContent: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    heart:{
        width: 80,
        height: 80
    }
})
