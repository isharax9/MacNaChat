import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { View, Text, TextInput, StyleSheet, Pressable, Image, } from 'react-native';
import { SafeAreaView } from 'react-native';

import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from "@expo/vector-icons/FontAwesome";

SplashScreen.preventAutoHideAsync();

export default function LoginScreen() {
  const [loaded, error] = useFonts({
    'SourceCodePro-Bold': require('./assets/fonts/static/SourceCodePro-Bold.ttf'),
    'PressStart2P-Regular': require('./assets/fonts/PressStart2P-Regular.ttf'),
    'SourceCodePro-VariableFont_wght': require('./assets/fonts/SourceCodePro-VariableFont_wght.ttf'),
  });

  const [focusedInput, setFocusedInput] = useState(null);

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
      <View style={styles.container}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.welcomeText}>Hello! Welcome to MacNa Chat </Text>

        <TextInput
          style={[styles.input, focusedInput === 'firstName' && styles.inputFocused]}
          placeholder="First Name"
          onFocus={() => setFocusedInput('firstName')}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[styles.input, focusedInput === 'lastName' && styles.inputFocused]}
          placeholder="Last Name"
          onFocus={() => setFocusedInput('lastName')}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[styles.input, focusedInput === 'mobile' && styles.inputFocused]}
          placeholder="Mobile"
          keyboardType="numeric"
          onFocus={() => setFocusedInput('mobile')}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
          placeholder="Password"
          secureTextEntry={true}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(null)}
        />

        <Pressable style={styles.buttonContainer} onPress={() => { console.log("Sign Up button pressed"); }}>
          <FontAwesome name="arrow-right" size={18} color="#fff" />
          <Text style={styles.buttontext}>SIGN UP</Text>
        </Pressable>

        <Pressable style={styles.signInButton} onPress={() => { console.log("Sign In button pressed"); }}>
          <Text style={styles.signInText}>Already have an account? Sign In here</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: '70%',
    height: undefined,
    aspectRatio: 2, // Adjust the aspect ratio to match your image's aspect ratio
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain', // Ensures the image is resized without cropping
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
  signInButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#007bff',
    fontFamily: 'SourceCodePro-Bold',
    textDecorationLine: 'underline',
  },
});