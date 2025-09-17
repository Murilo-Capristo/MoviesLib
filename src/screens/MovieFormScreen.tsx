import "../i18n";
import { useTranslation } from 'react-i18next';
import React, { useState, useLayoutEffect, useContext } from 'react'
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native"
import { s, vs } from "react-native-size-matters"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useRoute, useNavigation } from "@react-navigation/native"
import { addMovie, updateMovie } from "../services/movieService"
import { AppContext } from "../../App"
import { APP_COLORS } from "../colors/colors"

const MovieFormScreen = () => {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState("");
    const [duration, setDuration] = useState("");
    const [categories, setCategories] = useState("");
    const [poster, setPoster] = useState("");
    const [synopsis, setSynopsis] = useState("");

    const route = useRoute()
    const navigation = useNavigation()
    const movie = route.params?.movie ?? null;
    const onSave = route.params?.onSave;
    const { value } = useContext(AppContext)

    const { t } = useTranslation();

    function isValidUrl(text: string): boolean {
        try {
            const url = new URL(text)
            return url.protocol === "http:" || url.protocol === "https:"
        } catch {
            return false
        }
    }

    const handleSave = async () => {
        if (title.length == 0) {
            Alert.alert(t("attention"), t("emptyTitleMessage"))
            return
        }
        const parsedRating = parseFloat(rating.replace(',', '.'));
        if (Number.isNaN(parsedRating)) {
            Alert.alert(t("attention"), t("numericRateMessage"))
            return
        }
        if (duration.length == 0) {
            Alert.alert(t("attention"), t("movieDurationMessage"))
            return
        }
        if (categories.length == 0) {
            Alert.alert(t("attention"), t("categoriesMessage"))
            return
        }
        if (!isValidUrl(poster)) {
            Alert.alert(t("attention"), t("invalidURLMessage"))
            return
        }
        if (synopsis.length == 0) {
            Alert.alert(t("attention"), t("movieSynopsisMessage"))
            return
        }

        const movieData = { title, rating: parsedRating, duration, categories, poster, synopsis }

        try {
            let savedMovie
            if (movie) {
                savedMovie = await updateMovie(movie.id, movieData)
            } else {
                savedMovie = await addMovie(movieData)
            }
            if (onSave) onSave(savedMovie)
            navigation.goBack()
        } catch(error) {
            console.log(error)
            Alert.alert(t("attention"), t("saveErrorMessage"))
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({ title: movie == null ? t("registration") : t("editing") });
        if (movie) {
            setTitle(movie.title || "")
            setRating(movie.rating.toString() || "")
            setDuration(movie.duration || "")
            setCategories(movie.categories || "")
            setPoster(movie.poster || "")
            setSynopsis(movie.synopsis || "")
        }
    }, [])

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ padding: 20 }}>
                    {/* Título */}
                    <Text style={styles.sectionTitle}>{t("title").toUpperCase()}</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder={t("titlePlaceholder")}
                    />

                    {/* Nota e Duração */}
                    <Text style={styles.sectionTitle}>{t("rateAndDuration").toUpperCase()}</Text>
                    <View style={{ flexDirection: 'row', flex: 1, gap: 10 }}>
                        <TextInput
                            style={styles.input}
                            value={rating}
                            onChangeText={setRating}
                            placeholder={t("rate")}
                        />
                        <TextInput
                            style={styles.input}
                            value={duration}
                            onChangeText={setDuration}
                            placeholder={t("duration")}
                        />
                    </View>

                    {/* Categorias */}
                    <Text style={styles.sectionTitle}>{t("categories").toUpperCase()}</Text>
                    <TextInput
                        style={styles.input}
                        value={categories}
                        onChangeText={setCategories}
                        placeholder={t("categoriesPlaceholder")}
                    />

                    {/* Pôster */}
                    <Text style={styles.sectionTitle}>{t("poster").toUpperCase()}</Text>
                    <TextInput
                        style={styles.input}
                        value={poster}
                        onChangeText={setPoster}
                        placeholder={t("posterPlaceholder")}
                    />

                    {/* Sinopse */}
                    <Text style={styles.sectionTitle}>{t("synopsis").toUpperCase()}</Text>
                    <TextInput
                        style={[styles.input, { height: vs(120) }]}
                        value={synopsis}
                        onChangeText={setSynopsis}
                        multiline
                        textAlignVertical='top'
                        placeholder={t("synopsisPlaceholder")}
                    />
                </ScrollView>

                {/* Botão de Salvar */}
                <View style={styles.buttonArea}>
                    <TouchableOpacity 
                        onPress={handleSave} 
                        style={[styles.button, { backgroundColor: APP_COLORS[Number(value)] }]}
                    >
                        <Text style={{ color: 'white', fontSize: s(18) }}>
                            { movie == null ? t("registerMovie") : t("saveChanges") }
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default MovieFormScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f7'
    },
    sectionTitle: {
        fontSize: s(12),
        color: '#8d8d8d'
    },
    input: {
        flex: 1,
        height: vs(42),
        backgroundColor: 'white',
        borderRadius: s(8),
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 20
    },
    buttonArea: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: 'white',
        height: 86
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    }
})
