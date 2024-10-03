import { LinearGradient } from "expo-linear-gradient";
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
        <LinearGradient colors={["white", "#ef476f"]} style={styles.mainContainer}>
            <StatusBar hidden={false} />

            {getChatArray.length > 0 ? (
                <FlashList
                    data={getChatArray}
                    renderItem={({ item }) => (
                        <View style={styles.view5}>
                            <View style={item.other_user_status === 1 ? styles.view6_2 : styles.view6}>
                                {item.avatar_image_found ? (
                                    <Image
                                        source={{ uri: "https://cardinal-above-physically.ngrok-free.app/MacNaChat/AvatarImages/" + item.other_user_mobile + ".png" }}
                                        style={styles.image1}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Text style={styles.text4}>{item.other_user_avatar_letters}</Text>
                                )}
                            </View>

                            <View style={styles.view4}>
                                <Text style={styles.text1}>{item.other_user_name}</Text>
                                <Text style={styles.text4} numberOfLines={1}>
                                    {item.message}
                                </Text>

                                <View style={styles.view7}>
                                    <Text style={styles.text5}>{item.dateTime}</Text>
                                    <FontAwesome6 name={"check"} color={item.chat_status_id === 1 ? "green" : "white"} size={20} />
                                </View>
                            </View>
                        </View>
                    )}
                    estimatedItemSize={200}
                />
            ) : (
                <Text style={styles.noChatsText}>No chats available</Text>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 25,
    },
    view4: {
        flex: 1,
    },
    text1: {
        fontSize: 22,
    },
    text4: {
        fontSize: 18,
    },
    text5: {
        fontSize: 14,
        alignSelf: "flex-end",
    },
    view5: {
        flexDirection: "row",
        marginVertical: 10,
        columnGap: 20,
    },
    view6: {
        width: 80,
        height: 80,
        backgroundColor: "white",
        borderRadius: 40,
        marginHorizontal: 10,
        borderStyle: "dotted",
        borderWidth: 4,
        borderColor: "grey",
        justifyContent: "center",
        alignItems: "center",
    },
    view6_2: {
        width: 80,
        height: 80,
        backgroundColor: "white",
        borderRadius: 40,
        marginHorizontal: 10,
        borderStyle: "dotted",
        borderWidth: 4,
        borderColor: "green",
        justifyContent: "center",
        alignItems: "center",
    },
    view7: {
        flexDirection: "row",
        columnGap: 20,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    noChatsText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 50,
        color: "grey",
    },
    image1: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
