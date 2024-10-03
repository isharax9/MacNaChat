import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, } from "react-native";
import { Image } from 'expo-image';
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { FontAwesome6 } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function chat() {



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
                        true ? <Image style={stylesheet.image1}
                            source={"https://cardinal-above-physically.ngrok-free.app/MacNaChat/AvatarImages/0710351156.png"}
                            contentFit={"contain"} />
                            : <Text style={stylesheet.text1}>SP</Text>
                    }

                </View>
                <View style={stylesheet.view4}>
                    <Text style={stylesheet.text2}>Sahan Perera</Text>
                    <Text style={stylesheet.text3_1}>Online</Text>
                </View>
            </View>

            <View style={stylesheet.view5_1}>
                <Text style={stylesheet.text3}>Message</Text>
                <View style={stylesheet.view6}>
                    <Text style={stylesheet.text4}>Time</Text>
                    <FontAwesome6 name="check" color={true ? "green" : "white"} size={18} />
                </View>
            </View>

            <View style={stylesheet.view5_2}>
                <Text style={stylesheet.text3}>Message</Text>
                <View style={stylesheet.view6}>
                    <Text style={stylesheet.text4}>Time</Text>
                    <FontAwesome6 name="check" color={true ? "green" : "white"} size={18} />
                </View>
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
        alignItems: "flex-end",
        rowGap: 5,
        width: "auto",
    },
    view5_2: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        justifyContent: "center",
        alignItems: "flex-start",
        rowGap: 5,
        width: "auto",
    },
    view6: {
        flexDirection: "row",
        columnGap: 10,
    },

});