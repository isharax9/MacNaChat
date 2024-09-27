import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { View, Text, TextInput, StyleSheet, Pressable, } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from "@expo/vector-icons/FontAwesome";

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

  const [getImage, setImage] = useState(null);

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

        <Pressable
          style={styles.imguploadContainer}
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }}
        >
          <FontAwesome name="upload" size={16} color="#fff" />
          <Text style={styles.buttontext1}>Select a Profile Image</Text>
        </Pressable>

        {getImage && <ProfileImage uri={getImage} />}

        <Pressable style={styles.buttonContainer} onPress={() => { console.log("Sign Up button pressed"); }}>
          <FontAwesome name="arrow-right" size={18} color="#fff" />
          <Text style={styles.buttontext}>SIGN UP Your Account</Text>
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
    aspectRatio: 2,
    alignSelf: 'center',
    marginBottom: 20,
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
  profileImageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImageText: {
    fontSize: 16,
    fontFamily: 'SourceCodePro-Bold',
    color: '#007bff',
  },
});