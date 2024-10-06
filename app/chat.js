import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from "react-native";
import { Image } from 'expo-image';
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function ChatScreen() {
    const item = useLocalSearchParams();
    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState("");
    const [loaded, error] = useFonts({
        'SourceCodePro-Bold': require('../assets/fonts/static/SourceCodePro-Bold.ttf'),
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'SourceCodePro-Light': require('../assets/fonts/static/SourceCodePro-Light.ttf'),
        'SourceCodePro-Regular': require('../assets/fonts/static/SourceCodePro-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    useEffect(() => {
        async function fetchChatArray() {
            try {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                if (!item.other_user_id) {
                    console.log("No valid other_user_id provided.");
                    return;
                }

                const response = await fetch(process.env.EXPO_PUBLIC_URL+`/MacNaChat/LoadChat?logged_user_id=${user.id}&other_user_id=${item.other_user_id}`);
                if (response.ok) {
                    const chatArray = await response.json();
                    setChatArray(chatArray);
                } else {
                    console.log("Failed to fetch chat data:", response.status);
                }
            } catch (err) {
                console.log("Error fetching chat array:", err);
            }
        }

        fetchChatArray();

        const interval = setInterval(() => {
            fetchChatArray();
        }, 1000*60*5); // Refresh chat every 5 minutes

        return () => clearInterval(interval);
    }, [item.other_user_id]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <LinearGradient colors={["#f0f0f0", "#e0e0e0"]} style={stylesheet.view1}>
            <StatusBar hidden={false} />

            <View style={stylesheet.view2}>
                <View style={stylesheet.view3}>
                    {item.avatar_image_found == "true"
                        ? <Image style={stylesheet.image1}
                            source={{ uri: process.env.EXPO_PUBLIC_URL+`/MacNaChat/AvatarImages/${item.other_user_mobile}.png` }}
                            contentFit="contain" />
                        : <Text style={stylesheet.text1}>{item.other_user_avatar_letters}</Text>}
                </View>
                <View style={stylesheet.view4}>
                    <Text style={stylesheet.text2}>{item.other_user_name}</Text>
                    <Text style={stylesheet.text3_1}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                </View>
            </View>

            <View style={stylesheet.center_view}>
                <FlashList
                    data={getChatArray}
                    renderItem={({ item }) => (
                        <View style={item.side == "right" ? stylesheet.view5_1 : stylesheet.view5_2}>
                            <Text style={stylesheet.text3}>{item.message}</Text>
                            <View style={stylesheet.view6}>
                                <Text style={stylesheet.text4}>{item.datetime}</Text>
                                {item.side == "right" && (
                                    <FontAwesome6
                                        name={item.status != 1 ? "check" : "check-double"}
                                        color={item.status != 1 ? "green" : "blue"}
                                        size={18}
                                    />
                                )}
                            </View>
                        </View>
                    )}
                    estimatedItemSize={200}
                />
            </View>

            <View style={stylesheet.view7}>
                <TextInput
                    style={stylesheet.input1}
                    value={getChatText}
                    onChangeText={setChatText}
                    placeholder="Type a message..."
                    placeholderTextColor="#888"
                />
                <Pressable
                    style={stylesheet.pressable1}
                    onPress={async () => {
                        if (!getChatText.trim()) {
                            Alert.alert("Error", "Please enter a message");
                            return;
                        }

                        try {
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);
                            const response = await fetch(process.env.EXPO_PUBLIC_URL+`/MacNaChat/SendChat?logged_user_id=${user.id}&other_user_id=${item.other_user_id}&message=${getChatText}`);
                            if (response.ok) {
                                const json = await response.json();
                                if (json.success) {
                                    setChatText("");
                                }
                            } else {
                                console.log("Failed to send message:", response.status);
                            }
                        } catch (err) {
                            console.log("Error sending message:", err);
                        }
                    }}
                >
                    <FontAwesome6 name="paper-plane" color="white" size={20} />
                </Pressable>
            </View>
        </LinearGradient>
    );
}

const stylesheet = StyleSheet.create({
    view1: { flex: 1 },
    view2: {
        backgroundColor: "white",
        marginTop: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    },
    view3: {
        backgroundColor: "white",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    image1: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text1: {
        fontFamily: 'SourceCodePro-Bold',
        fontSize: 24,
        color: "#333",
    },
    view4: { marginLeft: 10,
        
     },
    text2: {
        fontFamily: 'SourceCodePro-Bold',
        fontSize: 18,
        color: "#333",
    },
    text3: {
        fontFamily: 'SourceCodePro-Regular',
        fontSize: 16,
        color: "#333",
    },
    text3_1: {
        fontFamily: 'SourceCodePro-Regular',
        fontSize: 14,
        color: "green",
    },
    text4: {
        fontFamily: 'SourceCodePro-Light',
        fontSize: 12,
        color: "#999",
    },
    center_view: {
        flex: 1,
        marginVertical: 10,
    },
    view5_1: {
        backgroundColor: "#e6f7ff",
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 10,
        alignSelf: "flex-end",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    view5_2: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 10,
        alignSelf: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    view6: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        columnGap: 5,
    },
    view7: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    input1: {
        flex: 1,
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        fontFamily: 'SourceCodePro-Regular',
        backgroundColor: "#fff",
    },
    pressable1: {
        marginLeft: 10,
        width: 40,
        height: 40,
        backgroundColor: "#007bff",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});
