import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TextInput, Pressable, Alert, } from "react-native";
import { Image } from 'expo-image';
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function chat() {

    //get parameters from url
    const item = useLocalSearchParams();
    //console.log(item.other_user_id);
    //console.log(item);


    //store chat array
    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState("");

    const [loaded, error] = useFonts({
        'SourceCodePro-Bold': require('../assets/fonts/static/SourceCodePro-Bold.ttf'),
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'SourceCodePro-Light': require('../assets/fonts/static/SourceCodePro-Light.ttf'),
    });

    useEffect(() => {

        // console.log("splash screen");
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);


    //fetch chat array from server
    useEffect(() => {
        async function fetchChatArray() {

            let userJson = await AsyncStorage.getItem("user");
            let user = JSON.parse(userJson);
            //console.log("Fetching chats for user ID:", user.id);

            let response = await fetch("https://cardinal-above-physically.ngrok-free.app/MacNaChat/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id);
            if (response.ok) {
                let chatArray = await response.json();
                //console.log(chatArray);
                console.log("Chats fetched Successfully From Backend");
                setChatArray(chatArray);

            }
        }

        fetchChatArray();
    }, []);


    if (!loaded && !error) {
        // console.log("last");
        return null;
    }

    return (
        <LinearGradient colors={["#83a4d4", "#b6fbff"]} style={stylesheet.view1}>
            <StatusBar hidden={false} />


            <View style={stylesheet.view2}>
                <View style={stylesheet.view3}>

                    {
                        item.avatar_image_found == "true"
                            ? <Image style={stylesheet.image1}
                                source={"https://cardinal-above-physically.ngrok-free.app/MacNaChat/AvatarImages/" + item.other_user_mobile + ".png"}
                                contentFit={"contain"} />
                            : <Text style={stylesheet.text1}>{item.other_user_avatar_letters}</Text>
                    }

                </View>
                <View style={stylesheet.view4}>
                    <Text style={stylesheet.text2}>{item.other_user_name}</Text>
                    <Text style={stylesheet.text3_1}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                </View>
            </View>


            <View style={stylesheet.center_view}>
                <FlashList
                    data={getChatArray}
                    renderItem={

                        ({ item }) =>
                            <View style={item.side == "right" ? stylesheet.view5_1 : stylesheet.view5_2}>
                                <Text style={stylesheet.text3}>{item.message}</Text>
                                <View style={stylesheet.view6}>
                                    <Text style={stylesheet.text4}>{item.datetime}</Text>
                                    {
                                        item.side == "right" ?
                                            <FontAwesome6 name="check" color={item.status != 1 ? "green" : "blue"} size={18} /> //green for delivered or unseen, blue for seen
                                            : null
                                    }
                                </View>
                            </View>
                    }
                    estimatedItemSize={200}
                />
            </View>


            <View style={stylesheet.view7}>
                <TextInput style={stylesheet.input1} value={getChatText} onChangeText={
                    (text) => {
                        setChatText(text);
                    }
                } />
                <Pressable style={stylesheet.pressable1} onPress={
                    async () => {
                        
                        if (getChatText.length == 0) {
                            console.log("Empty Message");
                            Alert.alert("Error","Please enter a message");
                            
                        } else {
                            console.log(getChatText);
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);
                            let response = await fetch("https://cardinal-above-physically.ngrok-free.app/MacNaChat/SendChat?logged_user_id="+user.id+"&other_user_id="+item.other_user_id+ "&message=" + getChatText);
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    console.log("Message Sent");
                                    setChatText("");
                                }
                            }
                        }
                    }
                }

                >

                    <FontAwesome6 name="paper-plane" color="white" size={20} />
                </Pressable>
            </View>

        </LinearGradient>
    );
}

const stylesheet = StyleSheet.create({
    view1: {
        flex: 1,
    },
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
    view4: {
        rowGap: 5,
    },
    text2: {
        fontFamily: 'SourceCodePro-Bold',
        fontSize: 20,
        color: "black",
    },
    text3: {
        fontFamily: '',
        fontSize: 16,
        color: "black",
    },
    text3_1: {
        fontFamily: 'SourceCodePro-Bold',
        fontSize: 16,
        color: "green",
    },
    text4: {
        fontFamily: 'SourceCodePro-Light',
        fontSize: 14,
        color: "black",
    },
    view5_1: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        justifyContent: "center",
        rowGap: 5,
        alignSelf: "flex-end",
    },
    view5_2: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        justifyContent: "center",
        rowGap: 5,
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
        paddingStart: 10,
    },
    pressable1: {
        width: 50,
        height: 50,
        backgroundColor: "black",
        borderRadius: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    center_view: {
        flex: 1,
        marginVertical: 20,
    },

});