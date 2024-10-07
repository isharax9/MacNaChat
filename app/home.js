import { View, StyleSheet, Text, Image, ActivityIndicator, Pressable, Alert, RefreshControl, TouchableOpacity } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useCallback, useRef } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons'; // For three dots icon
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font';
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Home() {
    const [fontsLoaded] = useFonts({
        'SourceCodePro-Bold': require('../assets/fonts/static/SourceCodePro-Bold.ttf'),
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'SourceCodePro-VariableFont_wght': require('../assets/fonts/SourceCodePro-VariableFont_wght.ttf'),
    });

    const [getChatArray, setChatArray] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showMenu, setShowMenu] = useState(false); // For dropdown menu
    const isMounted = useRef(true);

    const fetchData = useCallback(async () => {
        try {
            const userJson = await AsyncStorage.getItem("user");
            if (!userJson) {
                if (isMounted.current) router.replace("/");
                return;
            }

            const user = JSON.parse(userJson);
            if (!user || !user.id) {
                if (isMounted.current) router.replace("/");
                return;
            }

            const response = await fetch(process.env.EXPO_PUBLIC_URL + "/MacNaChat/LoadHomeData?id=" + user.id);
            if (response.ok) {
                const json = await response.json();
                if (json.success && isMounted.current) {
                    setChatArray(json.jsonChatArray);
                }
            }
        } catch (err) {
            console.log("Error occurred:", err);
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;
        fetchData();
        return () => {
            isMounted.current = false;
        };
    }, [fetchData]);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().then(() => setRefreshing(false));
    }, [fetchData]);

    const handleSignOut = async () => {
        try {
            Alert.alert(
                "Sign Out",
                "Are you sure you want to sign out?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Sign Out",
                        onPress: async () => {
                            const userJson = await AsyncStorage.getItem("user");
                            const user = JSON.parse(userJson);
                            const response = await fetch(process.env.EXPO_PUBLIC_URL + "/MacNaChat/SignOut?userId=" + user.id, { method: "GET" });

                            if (response.ok) {
                                await AsyncStorage.removeItem("user");
                                if (isMounted.current) router.replace("/");
                            }
                        },
                    },
                ],
                { cancelable: true }
            );
        } catch (err) {
            console.log("Error during sign out:", err);
        }
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar hidden={false} />
            <View style={styles.header}>
                <Text style={styles.title}>MacNa Chat</Text>
                {/* Three dots for dropdown menu */}
                <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>

                {showMenu && (
                    <View style={styles.menu}>
                        <Pressable onPress={() => router.push("/aboutme")}>
                            <Text style={styles.menuItem}>About Me</Text>
                        </Pressable>
                        <Pressable onPress={handleSignOut}>
                            <Text style={styles.menuItem}>Logout</Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {getChatArray.length > 0 ? (
                <FlashList
                    data={getChatArray}
                    renderItem={({ item }) => (
                        <Pressable style={styles.chatRow} onPress={() => router.push({ pathname: "/chat", params: item })}>
                            <View style={styles.avatarContainer}>
                                {item.avatar_image_found ? (
                                    <Image source={{ uri: process.env.EXPO_PUBLIC_URL + "/MacNaChat/AvatarImages/" + item.other_user_mobile + ".png" }} style={styles.avatarImage} />
                                ) : (
                                    <Text style={styles.avatarLetters}>{item.other_user_avatar_letters}</Text>
                                )}

                                {/* Online/Offline status */}
                                <Text style={item.other_user_status === 1 ? styles.onlineText : styles.offlineText}>
                                    {item.other_user_status === 1 ? "online" : "offline"}
                                </Text>
                            </View>

                            <View style={styles.chatInfo}>
                                <Text style={styles.userName}>{item.other_user_name}</Text>
                                <Text style={[styles.messagePreview, item.chat_status_id !== 1 && styles.unreadMessage]} numberOfLines={1}>
                                    {item.message}
                                </Text>
                            </View>

                            <View style={styles.chatMeta}>
                                <Text style={styles.time}>{item.dateTime}</Text>
                                <FontAwesome6 name={item.chat_status_id !== 1 ? "check" : "check-double"} color={item.chat_status_id === 1 ? "#0066ff" : "grey"} size={16} />
                            </View>
                        </Pressable>
                    )}
                    estimatedItemSize={200}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    title: {
        fontSize: 24,
        color: "#000",
        fontFamily: 'PressStart2P-Regular',
    },
    menuButton: {
        padding: 10,
    },
    menu: {
        position: "absolute",
        zIndex: 1,
        right: 10,
        top: 50,
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItem: {
        paddingVertical: 10,
        color: "#333",
        fontSize: 16,
    },
    chatRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    avatarContainer: {
        width: 50,
        height: 50,
        alignItems: "center",
    },
    onlineText: {
        fontSize: 10,
        color: "white",
        backgroundColor: "#0099ff",
        borderWidth: 0,
        borderColor: "green",
        padding: 2,
        borderRadius: 6,
        position: "absolute",
        bottom: -7,
    },
    offlineText: {
        fontSize: 10,
        color: "white",
        backgroundColor: "gray",
        borderWidth: 0,
        borderColor: "gray",
        padding: 2,
        borderRadius: 6,
        position: "absolute",
        bottom: -7,
    },
    avatarImage: {
        width: 46,
        height: 46,
        borderRadius: 23,
    },
    avatarLetters: {
        width: 46,
        height: 46,
        fontSize: 18,
        color: "#333",
        borderRadius: 23,
        backgroundColor: "#eee",
        textAlign: "center",
        lineHeight: 46,
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
    unreadMessage: {
        fontSize: 14,
        fontWeight: "bold",
        color: "black",
        fontFamily: 'SourceCodePro-Bold',  
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
