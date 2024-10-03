import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';

function Home() {

    const [loadChats, setChats] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let userJson = await AsyncStorage.getItem('user');
            let user = JSON.parse(userJson);
            let response = await fetch("https://cardinal-above-physically.ngrok-free.app/MacNaChat/LoadHomeData?id=" + user.id);

            if (response.ok) {
                let json = await response.json();
                if (json.success) {
                    setChats(json.chatArray || []); // Assuming 'chatArray' holds the chats
                }
            } else {
                console.log("Error: " + response.status);
            }
        }

        fetchData();
    }, []);

    // Render function for each chat item
    const renderChatItem = ({ item }) => (
        <View style={styles.view5}>
            <View style={styles.view6}></View> {/* Placeholder for avatar */}

            <View style={styles.view4}>
                {/* Username */}
                <Text style={styles.text1}>{item.other_user_name}</Text>

                {/* Last message with one line limitation */}
                <Text style={styles.text4} numberOfLines={1}>{item.message}</Text>

                {/* Timestamp and checkmark */}
                <View style={styles.view7}>
                    <Text style={styles.text5}>2024, Sep 10, 10:42 AM</Text>
                    <FontAwesome6 name={"check"} color={"grey"} size={20} />
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar hidden={false} />

            <FlashList
                data={loadChats}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
                estimatedItemSize={200}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 25,
    },
    view5: {
        flexDirection: "row",
        marginVertical: 10,
        columnGap: 20,
    },
    view6: {
        width: 80,
        height: 80,
        backgroundColor: 'white',
        borderRadius: 40,
        marginHorizontal: 10,
        borderStyle: "dotted",
        borderWidth: 4,
        borderColor: "blue",
    },
    view4: {
        flex: 1,
    },
    text1: {
        fontSize: 22,
        fontFamily: "Ubuntu-Bold",
    },
    text4: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 18,
    },
    view7: {
        flexDirection: "row",
        columnGap: 20,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text5: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 14,
        alignSelf: "flex-end",
    },
});

export default Home;
