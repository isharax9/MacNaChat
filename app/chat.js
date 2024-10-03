import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, } from "react-native";
import { Image } from 'expo-image';

export default function chat() {
    return (
        <LinearGradient colors={["#83a4d4", "#b6fbff"]} style={stylesheet.view1}>
            <StatusBar hidden={true} />


        <View style={stylesheet.view2}>
            <View style={stylesheet.view3}>
                    <Image style={stylesheet.image1} source={"https://cardinal-above-physically.ngrok-free.app/MacNaChat/AvatarImages/0710351156.png"} contentFit={"contain"} />
                <Text style={stylesheet.text1} >SP</Text>
            </View>
            <View style={stylesheet.view4}>
                    <Text style={stylesheet.text2}>Sahan Perera</Text>
                    <Text style={stylesheet.text3}>Online</Text>
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
       backgroundColor:"yellow",
       marginTop: 10,
       paddingHorizontal: 10,
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
        width: 80,
        height: 80,
        borderRadius: 40,
    },
        
});