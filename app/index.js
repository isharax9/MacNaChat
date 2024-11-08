import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { registerRootComponent } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function index() {

  const [getmobile, setMobile] = useState("");
  const [getpassword, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loaded, error] = useFonts({
    'SourceCodePro-Bold': require('../assets/fonts/static/SourceCodePro-Bold.ttf'),
    'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
    'SourceCodePro-VariableFont_wght': require('../assets/fonts/SourceCodePro-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user !== null) {
          router.replace('/home');
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    checkUser();
  }, []);

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
      <StatusBar translucent={true} backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Image source={require('../assets/logo.gif')} style={styles.logo} />
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.welcomeText}>Welcome back to MacNa Chat</Text>

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
            secureTextEntry={!showPassword}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity
            style={styles.showPasswordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <View style={styles.showPasswordToggleContent}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="gray"
            />
            <Text>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
            </View>
          </TouchableOpacity>

          <Pressable
            style={styles.buttonContainer}
            onPress={async () => {
              console.log("Sign In button pressed");
              try {
                let response = await fetch(
                  process.env.EXPO_PUBLIC_URL + "/MacNaChat/SignIn",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      mobile: getmobile,
                      password: getpassword,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    }
                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    let user = json.user;

                    // User signed in successfully, save userId and other details in AsyncStorage
                    try {
                      await AsyncStorage.setItem("userId", JSON.stringify(user));  // Save userId separately
                      await AsyncStorage.setItem("user", JSON.stringify(user));  // Save entire user object

                      Alert.alert("Success", "Hi " + user.first_name + " " + user.last_name + ", " + json.message);
                      console.log("User data saved to AsyncStorage");

                      router.replace("/home");
                      console.log("User Redirected to Home Screen");
                    } catch (error) {
                      console.error("Error saving user data to AsyncStorage:", error);
                    }

                  } else {
                    Alert.alert("Error", json.message);
                  }
                } else {
                  Alert.alert("Error", "Failed to sign in");
                }
              } catch (error) {
                Alert.alert("Error", "Network error occurred");
              }
            }}
          >
            <FontAwesome6 name={"arrow-right-to-bracket"} color="white" size={20} />
            <Text style={styles.buttontext}>SIGN IN</Text>
          </Pressable>

          <Pressable
            style={styles.signUpButton}
            onPress={() => {
              router.replace("/signup");
              console.log("Sign Up button pressed");
            }}
          >
            <Text style={styles.signUpText}>Don't have an account? Sign Up here</Text>
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
  showPasswordToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  showPasswordToggle: {
    
    right: 5,
    top: -10,
    zIndex: 1,
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 5,
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
  buttontext: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'SourceCodePro-Bold',
  },
  signUpButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#007bff',
    fontFamily: 'SourceCodePro-Bold',
    textDecorationLine: 'underline',
  },
});
