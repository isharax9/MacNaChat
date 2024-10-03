import { View, StyleSheet, Text, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function Home() {
    const [getChatArray, setChatArray] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const userJson = await AsyncStorage.getItem("user");
                const user = JSON.parse(userJson);

                console.log("Fetching chats for user ID:", user.id);

                const response = await fetch("https://cardinal-above-physically.ngrok-free.app/MacNaChat/LoadHomeData?id=" + user.id);

                if (response.ok) {
                    const json = await response.json();
                    if (json.success) {
                        const chatArray = json.jsonChatArray; // Ensure this matches your backend response
                        console.log("Chats fetched:", chatArray);
                        setChatArray(chatArray);
                    } else {
                        console.log("API returned success: false");
                    }
                } else {
                    console.log("Error fetching data:", response.status);
                }
            } catch (err) {
                console.log("Error occurred:", err);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <StatusBar hidden={false} />

            {getChatArray.length > 0 ? (
                <FlashList
                    data={getChatArray}
                    renderItem={({ item }) => (
                        <View style={styles.chatRow}>
                            <View style={item.other_user_status === 1 ? styles.onlineStatus : styles.offlineStatus}>
                                {item.avatar_image_found ? (
                                    <Image
                                        source={{ uri: "https://cardinal-above-physically.ngrok-free.app/MacNaChat/AvatarImages/" + item.other_user_mobile + ".png" }}
                                        style={styles.avatarImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text style={styles.avatarLetters}>{item.other_user_avatar_letters}</Text>
                                )}
                            </View>

                            <View style={styles.chatInfo}>
                                <Text style={styles.userName}>{item.other_user_name}</Text>
                                <Text style={styles.messagePreview} numberOfLines={1}>
                                    {item.message}
                                </Text>
                            </View>

                            <View style={styles.chatMeta}>
                                <Text style={styles.time}>{item.dateTime}</Text>
                                <FontAwesome6 name={"check"} color={item.chat_status_id === 1 ? "blue" : "grey"} size={16} />
                            </View>
                        </View>
                    )}
                    estimatedItemSize={200}
                />
            ) : (
                <Text style={styles.noChatsText}>No chats available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
        backgroundColor: "#f9f9f9",
    },
    chatRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    onlineStatus: {
        width: 50,
        height: 50,
        backgroundColor: "white",
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "green",
        justifyContent: "center",
        alignItems: "center",
    },
    offlineStatus: {
        width: 50,
        height: 50,
        backgroundColor: "white",
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "grey",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarImage: {
        width: 46,
        height: 46,
        borderRadius: 23,
    },
    avatarLetters: {
        fontSize: 18,
        color: "#333",
    },
    chatInfo: {
        flex: 1,
        paddingLeft: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    messagePreview: {
        fontSize: 14,
        color: "#555",
    },
    chatMeta: {
        alignItems: "flex-end",
    },
    time: {
        fontSize: 12,
        color: "#999",
        marginBottom: 5,
    },
    noChatsText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 50,
        color: "grey",
    },
});
