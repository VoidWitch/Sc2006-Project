import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'; 

import { updateUserAnswer } from '../../App';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, update, child } from "firebase/database";

import Toast from 'react-native-toast-message';

import loginVal from '../../App';
import regMobile from '../RegisterUserForm/RegisterUser'
import regPassword from '../RegisterUserForm/RegisterUser'
import regAnswer from '../RegisterUserForm/RegisterUser'

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
    // Add other screens if needed
    'Cycle Savvy': undefined;	    //nagivate to main page upon verification
};
  
type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface Props {
    navigation: ScreenNavigationProp;
}

const PhoneVerificationScreen = ({navigation}:Props) => { 
    const [code, setCode] = useState(''); 
    const [timer, setTimer] = useState(60); 

    const [mobile, setMobile] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [answer, setText] = useState(''); 

    var userExist = null;
    var userProp = {};
    
    useEffect(() => { 
        // Start the countdown 
        const interval = setInterval(() => { 
        setTimer(prevTimer => prevTimer > 0 ? prevTimer - 1 : 0); 
        }, 1000); 
    
        // Clean up the interval on component unmount 
        return () => clearInterval(interval); 
    }, []); 

    ////////

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

	const getUserPassword = (mobile: string) => {
		const dbRef = ref(getDatabase());
		get(child(dbRef, `users/${mobile}`)).then((snapshot) => {
			if (snapshot.exists()) {
				userProp = snapshot.val();
				// console.log(userProp.password);
			}
		});
	}
    
    const verifyCode = () => {  
        // Add your verification logic here check otp that has been sent upon correct login details
        //get user input and check against OTP generated
        // if verification failed -> handleResendCode(), prompt wrong input
        // else -> navigate to mainUI screen

        if (global.loginVal) { // if IN LOGIN MODE

            global.regPassword = password;

            if (mobile === global.regMobile && password === global.regPassword) { // if similar to prev details

                getUserMobile(mobile);

                setTimeout(function() {

                    if (userExist === false) {

                        // show error
                        const showToast = () => { // show a toast message (android)
                            Toast.show({
                            type: 'error',
                            text1: 'No account found.',
                            text1Style: {
                                fontSize:15
                            }
                            });
                        }

                        showToast();

                    } else {

                        // check that password is correct, then proceed

                        getUserPassword(mobile);

                        // console.log(inputPassword);

                        setTimeout(function() {
                            if (userProp.password === password) {
                                
                                // Check question answer

                                if (userProp.answer === answer) {

                                    // proceed to login

                                    navigation.reset({ index: 7, routes: [{ name: 'Cycle Savvy' }] })

                                } else {
                                    const showToast = () => { // show a toast message (android)
                                        Toast.show({
                                        type: 'error',
                                        text1: 'Incorrect answer. Try again.',
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
                                    text1: 'Incorrect password. Try again.',
                                    text1Style: {
                                        fontSize:15
                                    }
                                    });
                                }
                
                                showToast();
                            }
                        }, 500);

                    }
                }, 500);

            } else {

                const showToast = () => { // show a toast message (android)
                    Toast.show({
                    type: 'error',
                    text1: 'Ensure that details are the same.',
                    text1Style: {
                        fontSize:15
                    }
                    });
                }

                showToast();
            }

        } else { // IF IN REGISTER MODE

            // handleVerified();
            /*
            console.log(mobile);
            console.log(password);
            console.log(answer);*/

            // CHECK THAT MOBILE, PASSWORD IS CORRECT HERE (to previous page) BEFORE CONFIRMING

            if (mobile === global.regMobile && password === global.regPassword) {

                global.regAnswer = answer;

                updateUserAnswer(mobile, password, answer);

                navigation.reset({ index: 7, routes: [{ name: 'Cycle Savvy' }] })

            } else {

                const showToast = () => { // show a toast message (android)
                    Toast.show({
                    type: 'error',
                    text1: 'Ensure that details are the same.',
                    text1Style: {
                        fontSize:15
                    }
                    });
                }

                showToast();
            }

        }
    };

    const handleVerified = () => {
        console.log('Logging in...');
        navigation.replace('Cycle Savvy');
    }
    
    const handleResendCode = () => { 
        console.log('Resending code...'); 
        setTimer(60); // Reset the timer 
        // Add logic to resend the verification code if need, right now only resend option available after 1 min

    }; 

    const sendVerificationCode = () => {
        //send OTP to registered mobile number
        //return produced OTP
    }
    /*
    const handleInputChange = (event) => {

        console.log(event.currentTarget.value);

        // setAnswer(event.target.value);
      };*/
    
    return ( 
        <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100} 
        > 
        
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}> 
            <View style={styles.container}> 
            <View style={styles.container1}> 
				<Text style={styles.header}>Security Question</Text> 
			</View>
            <Text style={styles.instruction}>What is your mobile number again?</Text>  
            <Text style={styles.description}>Please answer the question above.</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Mobile Number" 
                placeholderTextColor="#808080" 
                keyboardType="number-pad" 
                onChangeText={setMobile} 
                value={mobile}
                maxLength={8}
            /> 
            <Text style={styles.instruction}>Enter password again.</Text>  
            <Text style={styles.description}>Please answer the question above.</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                placeholderTextColor="#808080" 
                secureTextEntry 
                onChangeText={setPassword} 
                value={password}
                maxLength={20}      //max 20 char
            /> 
            <Text style={styles.instruction}>What is your favourite colour?</Text>  
            <Text style={styles.description}>Please answer the question above.</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Answer" 
                placeholderTextColor="#808080" 
                onChangeText={newText => setText(newText)}
                defaultValue={answer}
                
                // onChangeText={setCode} 
                // value={answer} 
                // onChangeText={}
                // maxLength={6} 
            /> 
            <TouchableOpacity style={styles.button} onPress={verifyCode}> 
                <Text style={styles.buttonText}>Submit</Text> 
            </TouchableOpacity> 
            <Text style={styles.timerText}>{`Time remaining: ${timer} seconds`}</Text> 
            {timer === 0 && ( 
                <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}> 
                <Text style={styles.resendButtonText}>Resend Code</Text> 
                </TouchableOpacity> 
            )} 
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
    instruction: {
		color: '#000',
		fontSize: 19,
		fontWeight: 'bold',
        marginTop: 50,
        paddingRight: 95,
  	}, 
    description: { 
        color: '#000',
		fontSize: 12,
		fontStyle: 'italic',
		marginBottom: 20,
        paddingRight: 48,
    }, 
    input: { 
        width: '80%', 
        height: 40, 
        borderColor: '#000', 
        borderWidth: 1, 
        borderRadius: 5, 
        marginBottom: 10, 
        paddingHorizontal: 10, 
    }, 
    button: { 
        backgroundColor: '#48c289', 
        width: '80%', 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 5, 
        marginTop: 10, 
    }, 
    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 18, 
    }, 
    timerText: { 
        marginTop: 20, 
        fontSize: 15, 
    }, 
    resendButton: { 
        marginTop: 10, 
    }, 
    resendButtonText: { 
        color: 'blue', 
        fontSize: 15, 
        textDecorationLine: 'underline', 
    }, 
}); 
 
export default PhoneVerificationScreen;