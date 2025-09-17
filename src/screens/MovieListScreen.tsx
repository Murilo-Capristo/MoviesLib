import "../i18n";

import {useTranslation} from 'react-i18next';

import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Pressable } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useCallback, useState, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMovie, getMovies } from "../services/movieService";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import MovieRow, { Movie } from "../components/MovieRow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../App"
import { APP_COLORS } from "../colors/colors"

const MovieListScreen = () => {
    const navigation = useNavigation();
    const queryClient = useQueryClient()
    const [category, setCategory] = useState("")
    const { value, setValue } = useContext(AppContext)

    const { data: movies, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['movies'],
        queryFn: getMovies,
        select: (data) => data.sort((a: Movie, b: Movie) => {
            if (category != "" && category != null) {
                const aHasCategory = a.categories.includes(category)
                const bHasCategory = b.categories.includes(category)
                if (aHasCategory && !bHasCategory) return -1
                if (!aHasCategory && bHasCategory) return 1
            }
            return a.title.localeCompare(b.title)
        }), 
    });

    // Função que carrega dados do AsyncStorage
    const loadData = async () => {
        try {
            const storedCategory = await AsyncStorage.getItem("category")
            setCategory(storedCategory ?? "")
        } catch (error) {
            console.error("Erro ao carregar os ajustes:", error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadData()
            queryClient.invalidateQueries( { queryKey: ["movies"] })
        }, [queryClient])
    );

    const renderHiddenItem = (data) => (
        <View style={ styles.rowBack }>
            <TouchableOpacity
                style={ styles.backRightBtn }
                onPress={() => {
                    Alert.alert(
                        'Confirmar Exclusão',
                        "Tem certeza que deseja excluir este item?",
                        [
                            { text: "Cancelar", style: 'cancel' },
                            { text: "Excluir", style: 'destructive', onPress: () => deleteRow(data.item.id) },
                        ],
                        { cancelable: true }
                    );
                }}
            >
                <Text style={ styles.backTextWhite }>Excluir</Text>
            </TouchableOpacity>
        </View>
    )

      const { t } = useTranslation();
    
    const deleteRow = async (movieID) => {
        try {
            await deleteMovie(movieID)
            queryClient.invalidateQueries({ queryKey: ["movies"] });

        } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o filme")
        }
    };

    if (isLoading) {
        return(
            <View style={styles.center}>
                <ActivityIndicator size='large' color={APP_COLORS[Number(value)]} />
            </View>
        )
    }

    if (isError) {
        return(
           <View style={styles.center}>
                <Text>Erro ao carregar filmes!</Text>
            </View>
        )
    }

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={ styles.title }>Filmes</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MovieFormScreen')}
                    >
                        <Text style={{ color: APP_COLORS[Number(value)], fontSize: 32, fontWeight: 'black' }}>+</Text>
                    </TouchableOpacity>
                        
                </View>
                <SwipeListView
                    style={ styles.list }
                    data={movies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => navigation.navigate('MovieDetailsScreen', { movie: item })}
                        >
                            <MovieRow movie={item} />
                        </Pressable>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}

                    // Pull to refresh
                    refreshControl={
                        <RefreshControl
                            refreshing={false}  
                            onRefresh={refetch} 
                            colors={["#cecece"]}
                            tintColor="#cecece"
                        />
                    }

                    // Swipe to Delete
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    disableRightSwipe={true}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default MovieListScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee'
    },
    list: {
        marginVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold'
    },
   center: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    },
    // Swipe to Delete
    rowBack: {
        alignItems: 'flex-end',
        backgroundColor: '#FF4136',
        justifyContent: 'flex-end',
        borderRadius: 8,
    },
    backRightBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 75, // Mesma largura do rightOpenValue
        height: '100%',
    },
    backTextWhite: {
        color: '#FFF',
        fontWeight: 'bold',
    },
})
