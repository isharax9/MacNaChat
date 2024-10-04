import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TextInput, Pressable, Alert, } from "react-native";
import { Image } from 'expo-image';
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function ChatScreen() {
    // Get parameters from URL
    const item = useLocalSearchParams();

    // Store chat array
    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState("");
    const [loaded, error] = useFonts({
        'SourceCodePro-Bold': require('../assets/fonts/static/SourceCodePro-Bold.ttf'),
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'SourceCodePro-Light': require('../assets/fonts/static/SourceCodePro-Light.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    // Fetch chat array from server
    useEffect(() => {
        // Define function to fetch chat data
        async function fetchChatArray() {
            try {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                // Check if item.other_user_id is valid
                if (!item.other_user_id) {
                    console.log("No valid other_user_id provided.");
                    return;
                }

                const response = await fetch(`https://cardinal-above-physically.ngrok-free.app/MacNaChat/LoadChat?logged_user_id=${user.id}&other_user_id=${item.other_user_id}`);
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

        // Set interval to fetch chat data every 5 seconds
        const interval = setInterval(() => {
            fetchChatArray();
        }, 5000);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, [item.other_user_id]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <LinearGradient colors={["#83a4d4", "#b6fbff"]} style={stylesheet.view1}>
            <StatusBar hidden={false} />

            <View style={stylesheet.view2}>
                <View style={stylesheet.view3}>
                    {item.avatar_image_found == "true"
                        ? <Image style={stylesheet.image1}
                            source={{ uri: `https://cardinal-above-physically.ngrok-free.app/MacNaChat/AvatarImages/${item.other_user_mobile}.png` }}
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
                                    <FontAwesome6 name="check" color={item.status != 1 ? "green" : "blue"} size={18} />
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
                            const response = await fetch(`https://cardinal-above-physically.ngrok-free.app/MacNaChat/SendChat?logged_user_id=${user.id}&other_user_id=${item.other_user_id}&message=${getChatText}`);
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
        marginTop: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        columnGap: 10,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    view3: {
        backgroundColor: "white",
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderColor: "red",
        borderWidth: 2,
    },
    image1: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    text1: {
        fontFamily: 'SourceCodePro-Bold',
        fontSize: 50,
        color: "black",
    },
    view4: { rowGap: 5 },
    text2: {
        fontFamily: 'SourceCodePro-Bold',
        fontSize: 20,
        color: "black",
    },
    text3_1: {
        fontFamily: 'SourceCodePro-Bold',
        fontSize: 16,
        color: "green",
    },
    center_view: {
        flex: 1,
        marginVertical: 20,
    },
    view5_1: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        alignSelf: "flex-end",
    },
    view5_2: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        alignSelf: "flex-start",
    },
    view6: {
        flexDirection: "row",
        columnGap: 10,
    },
    view7: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        columnGap: 10,
        paddingHorizontal: 10,
        marginVertical: 20,
    },
    input1: {
        height: 45,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        fontFamily: 'SourceCodePro-Bold',
        paddingHorizontal: 10,
        flex: 1,
    },
    pressable1: {
        width: 50,
        height: 50,
        backgroundColor: "black",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});
