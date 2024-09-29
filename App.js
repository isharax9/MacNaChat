import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as SplashScreen from 'expo-splash-screen';
import {FontAwesome6} from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();


const ProfileImage = ({ uri }) => {
  return (
    <View style={styles.profileImageContainer}>
      <Image source={{ uri }} style={styles.profileImage} contentFit={"contain"} />
      <Text style={styles.profileImageText}>Profile Image Uploaded</Text>
    </View>
  );
};

export default function LoginScreen() {

  const [getImage, setImage] = useState();

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");

  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");


  const [loaded, error] = useFonts({
    'SourceCodePro-Bold': require('./assets/fonts/static/SourceCodePro-Bold.ttf'),
    'PressStart2P-Regular': require('./assets/fonts/PressStart2P-Regular.ttf'),
    'SourceCodePro-VariableFont_wght': require('./assets/fonts/SourceCodePro-VariableFont_wght.ttf'),
  });

  const [focusedInput, setFocusedInput] = useState();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Image source={require('./assets/logo.gif')} style={styles.logo} />
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.welcomeText}>Hello! Welcome to MacNa Chat </Text>

          <TextInput
            style={[styles.input, focusedInput === 'firstName' && styles.inputFocused]}
            placeholder="First Name"
            onFocus={() => setFocusedInput('firstName')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            style={[styles.input, focusedInput === 'lastName' && styles.inputFocused]}
            placeholder="Last Name"
            onFocus={() => setFocusedInput('lastName')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => setLastName(text)}
          />
          <TextInput
            style={[styles.input, focusedInput === 'mobile' && styles.inputFocused]}
            placeholder="Mobile"
            keyboardType="numeric"
            onFocus={() => setFocusedInput('mobile')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => setMobile(text)}
          />
          <TextInput
            style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
            placeholder="Password"
            secureTextEntry={true}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => setPassword(text)}
          />

          <Pressable
            style={styles.imguploadContainer}
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}
          >
            <FontAwesome6 name="upload" size={16} color="#fff" />
            <Text style={styles.buttontext1}>Select a Profile Image</Text>
          </Pressable>

          {getImage ? <ProfileImage uri={getImage} /> : null}

          <Pressable
            style={styles.buttonContainer}
            onPress={async () => {
              let formData = new FormData();
              formData.append("mobile", getMobile);
              formData.append("firstName", getFirstName);
              formData.append("lastName", getLastName);
              formData.append("password", getPassword);

              // Corrected the image check
              if (getImage != null) {
                
              

              formData.append("avatarImage", {
                uri: getImage,
                type: "image/png",
                name: "image.png",
              });}

              console.log("SignUp Button pressed");
              try {
                let response = await fetch(
                  "https://c21a-2407-c00-c001-dc07-89f0-8b2d-3a1a-2145.ngrok-free.app/MacNaChat/SignUp",
                  {
                    method: "POST",
                    body: formData
                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    Alert.alert("Success", json.message);
                  } else {
                    Alert.alert("Error", json.message);
                  }
                } else {
                  Alert.alert("Error", "Failed to register");
                }
              } catch (error) {
                Alert.alert("Error", "Network error occurred");
              }
            }}
          >
            <FontAwesome6 name={"arrow-right-to-bracket"} color="white" size={20} />
            <Text style={styles.buttontext}>SIGN UP YOUR ACCOUNT</Text>
          </Pressable>


          <Pressable
            style={styles.signUpButton}
            onPress={() => {
              console.log("Sign In button pressed");
            }}
          >
            <Text style={styles.signInText}>Already have an account? Sign In here</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '100%',
    height: "undefined",
    aspectRatio: 2,
    alignSelf: 'center',
    marginBottom: 5,
    contentFit: 'contain',
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
    color: 'blue',
    fontFamily: 'PressStart2P-Regular',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'SourceCodePro-VariableFont_wght',
    textAlign: 'center',
  },
  input: {
    fontSize: 16,
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: 'SourceCodePro-Bold',
  },
  inputFocused: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  buttonContainer: {
    marginTop: 20,
    height: 50,
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },
  imguploadContainer: {
    marginTop: 20,
    height: 40,
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },
  buttontext: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'SourceCodePro-Bold',
  },
  buttontext1: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'SourceCodePro-Bold',
  },
  signUpButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#007bff',
    fontFamily: 'SourceCodePro-Bold',
    textDecorationLine: 'underline',
  },
  profileImageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImageText: {
    fontSize: 16,
    fontFamily: 'SourceCodePro-Bold',
    color: '#007bff',
  },
});