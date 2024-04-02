import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { writeUserData } from '../../App';
// import { getUserMobile } from '../../App';
import { updateUserAnswer } from '../../App';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, update, child } from "firebase/database";

import Toast from 'react-native-toast-message';

import loginVal from '../../App';

var regMobile = null;
var regPassword = null;
var regAnswer = null;
global.regMobile = regMobile;
global.regPassword = regPassword;
global.regAnswer = regAnswer;

const firebaseConfig = {
  apiKey: "AIzaSyBA3SGfDTI94WaJOxp_q0C2r3ypG6UCyj4",
  authDomain: "cycle-savvy.firebaseapp.com",
  databaseURL: "https://cycle-savvy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cycle-savvy",
  storageBucket: "cycle-savvy.appspot.com",
  messagingSenderId: "537001875593",
  appId: "1:537001875593:web:0d10ab8433ce7fb8e40e58",
  measurementId: "G-3WGYQ5T50W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


type RootStackParamList = {
    'Verification': undefined;	    //press register pw -> go to verification screen
};
  
type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface Props {
    navigation: ScreenNavigationProp;
}

const RegisterUserScreen = ({navigation}:Props) => { 

    const [mobile, setMobile] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [confirmPw, setConfirmPw] = useState(''); 

    var userExist = null;
    var mobileCount = 0;

    const countChar = () => {
        mobileCount++;
    }

    const getUserMobile = (mobile: string) => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${mobile}`)).then((snapshot) => {
          if (snapshot.exists()) {
            userExist = true;
          } else {
            userExist = false;
          }
        });
      }
    
    const registerUser = () => { 

        getUserMobile(mobile);
        setTimeout(function() {

            // CHECK IF MOBILE IS VALID

            if (userExist === false) { // IF USER MOBILE NOT in database, write the following:

                if (password !== "" && confirmPw !== "") {

                    if (password === confirmPw) { // if passwords match

                        // CHECK IF PASSWORD MEETS MIN. SECURITY

                        global.regMobile = mobile;
                        global.regPassword = password;

                        console.log(global.regPassword);

                        // writeUserData(mobile, password); // Write user data to Firebase database

                        handleRegistered();  

                    } else {

                        const showToast = () => { // show a toast message (android)
                            Toast.show({
                            type: 'error',
                            text1: 'Passwords do not match. Try again.',
                            text1Style: {
                                fontSize:15
                            }
                            });
                        }
        
                        showToast();
                    }

                } else {

                    const showToast = () => { // show a toast message (android)
                        Toast.show({
                        type: 'error',
                        text1: 'Enter a password value.',
                        text1Style: {
                            fontSize:15
                        }
                        });
                    }
    
                    showToast();
                }

            } else {

                // PERFORM 'npm install react-native-toast-message' to root

                const showToast = () => { // show a toast message (android)
                    Toast.show({
                    type: 'error',
                    text1: 'Number has been registered.',
                    text1Style: {
                        fontSize:15
                    }
                    });
                }

                showToast();

                // underlineColorAndroid="red" for TextInput
            }

            userExist = null;

        }, 500); 

        // Show him the code submission form
        // We will handle the verification code ourselves

        // The user has submitted the code
        // let result = await textflow.verifyCode("+11234567890", "USER_ENTERED_CODE"); 
        // if result.valid is true, then the phone number is verified. 

        // Implement registration logic here 
        // update user info into database
        // if valid format, call handleRegistered to navigate back to login screen to re-login   
    }; 
    const handleRegistered = () => { 

            // CHECK THAT PASSWORD AND CONFIRM PASSWORDS MATCH

            global.loginVal = false;

            //implement navigation back to login screen
            console.log('Registered! Verifying user...');
            navigation.reset({ index: 3, routes: [{ name: 'Verification' }] })


	}; 
    
    return ( 
        <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100} 
        > 
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}> 
            <View style={styles.container}> 
            <View style={styles.container1}> 
                <Text style={styles.header}>Join Us!</Text> 
            </View> 
            <Image source={require('./CycleLogo.png')} style={styles.image} /> 
            <Text style={styles.action}>Sign up:</Text> 
            <TextInput 
                style={styles.input} 
                placeholder="Mobile Number" 
                placeholderTextColor="#808080" 
                keyboardType="number-pad" 
                onChangeText={setMobile} 
                value={mobile}
                maxLength={8}
                onChange={countChar}

                // onChange={count => countChar(count)}
                // {newText => setText(newText)}
            /> 
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                placeholderTextColor="#808080" 
                secureTextEntry 
                onChangeText={setPassword} 
                value={password}
                maxLength={20}      //max 20 char
            /> 
            <TextInput 
                style={styles.input} 
                placeholder="Confirm Password" 
                placeholderTextColor="#808080" 
                secureTextEntry 
                onChangeText={setConfirmPw} 
                value={confirmPw}
                maxLength={20}      //max 20 char
            /> 
            <TouchableOpacity style={styles.createAccount} onPress={registerUser}> 
                <Text style={styles.createAccountText}>Create your account</Text> 
            </TouchableOpacity> 
            </View> 
        </ScrollView> 
        </KeyboardAvoidingView> 
    ); 
}; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    container1: {
        backgroundColor: '#48c289',
        width: '100%',
        alignSelf: 'flex-start',
        padding: 20,
        paddingBottom: 10,
        marginBottom: 50,
    },
    header: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    imagetitle: {
        color: '#000',
        fontStyle: 'italic',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: -20,
    },
    image: {
        width: 300,
        height: 200,
    },
    imagecaption: {
        fontSize: 22,
        fontStyle: 'italic',
        fontWeight: 'bold',
        marginBottom: 30,
    },
    action: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        paddingRight: 270,
        margin: 5,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 14,
        marginBottom: 5,
    },
    createAccount: {
        backgroundColor: '#48c289',
        width: '80%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    createAccountText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default RegisterUserScreen;