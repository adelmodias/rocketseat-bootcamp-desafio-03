import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    View,
    FlatList,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        api.get("repositories").then((response) => {
            setRepositories(response.data);
        });
    }, []);

    async function handleLikeRepository(id) {
        api.post(`repositories/${id}/like`).then((response) => {
            //find the index of object from array that you want to update
            const objIndex = repositories.findIndex(
                (obj) => obj.id === response.data.id
            );

            // make new object of updated object.
            const updatedObj = {
                ...repositories[objIndex],
                likes: response.data.likes,
            };

            // make final new array of objects by combining updated object.
            setRepositories([
                ...repositories.slice(0, objIndex),
                updatedObj,
                ...repositories.slice(objIndex + 1),
            ]);
        });
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
            <SafeAreaView style={styles.container}>
                <FlatList
                    style={styles.repositoryContainer}
                    data={repositories}
                    keyExtractor={(repository) => repository.id}
                    renderItem={({ item }) => {
                        return (
                            <>
                                <Text style={styles.repository}>
                                    {item.title}
                                </Text>

                                <View style={styles.techsContainer}>
                                    {item.techs.map((item, index) => (
                                        <Text style={styles.tech} key={index}>
                                            {item}
                                        </Text>
                                    ))}
                                </View>

                                <View style={styles.likesContainer}>
                                    <Text
                                        style={styles.likeText}
                                        // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                                        testID={`repository-likes-${item.id}`}
                                    >
                                        {item.likes} curtidas
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() =>
                                        handleLikeRepository(item.id)
                                    }
                                    // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                                    testID={`like-button-${item.id}`}
                                >
                                    <Text style={styles.buttonText}>
                                        Curtir
                                    </Text>
                                </TouchableOpacity>

                                <View
                                    style={{
                                        borderBottomColor: "#c1c1c1",
                                        borderBottomWidth: 1,
                                        marginTop: 20,
                                        marginBottom: 30,
                                    }}
                                />
                            </>
                        );
                    }}
                />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7159c1",
        paddingTop: 50,
    },
    repositoryContainer: {
        marginBottom: 15,
        marginHorizontal: 15,
        backgroundColor: "#fff",
        padding: 20,
    },
    repository: {
        fontSize: 32,
        fontWeight: "bold",
    },
    techsContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    tech: {
        fontSize: 12,
        fontWeight: "bold",
        marginRight: 10,
        backgroundColor: "#04d361",
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: "#fff",
    },
    likesContainer: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    likeText: {
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 10,
    },
    button: {
        marginTop: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 10,
        color: "#fff",
        backgroundColor: "#7159c1",
        padding: 15,
    },
});
