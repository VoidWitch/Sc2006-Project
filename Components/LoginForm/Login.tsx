import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useState } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native'; 

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
	'Reset Password': undefined;	//press reset pw -> go to reset pw screen
	'Verification': undefined;		//press login if valid creds -> go to verification screen
	'Register User': undefined;		//press reg user -> go to register user screen
};
  
type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface Props {
	navigation: ScreenNavigationProp;
}
  
const LoginScreen = ({navigation}:Props) => { 
	const [mobile, setMobile] = useState(''); 
	const [password, setPassword] = useState(''); 

	const [inputPassword, setText] = useState(''); 

	var userExist = null;
	var userProp = {};

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
	
	const handleLogin = () => { 

		// console.log(global.loginVal);

		global.loginVal = true;

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
					if (userProp.password === inputPassword) {

						global.regMobile = mobile;
						global.regPassword = password;

						//implement login logic then navigation to verification UI
						console.log('Verifying user...');
						navigation.replace('Verification');
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

	}; 
	
	const handleResetPassword = () => { 
		//implement navigation to reset UI
		console.log('Resetting password...'); 
		navigation.navigate('Reset Password');
	}; 
	
	const handleRegisterUser = () => { 
		//implement navigation to register user UI
		console.log('Registering user...');
		navigation.navigate('Register User');
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
				<Text style={styles.header}>Welcome Back!</Text>
			</View>  
			<Image source={require('./CycleLogo.png')} style={styles.image} /> 
			<Text style={styles.action}>Login:</Text> 
			<TextInput 
				style={styles.input} 
				placeholder="Mobile Number" 
				placeholderTextColor="#808080" 
				keyboardType="number-pad" 
				onChangeText={setMobile} 
				value={mobile}
				maxLength={8}
			/> 
			<TextInput 
				style={styles.input} 
				placeholder="Password" 
				placeholderTextColor="#808080" 
				secureTextEntry 
				// onChangeText={setPassword} 
				// value={password}
				maxLength={20}		//max 20 char
				onChangeText={newText => setText(newText)}
                defaultValue={inputPassword}
			/> 
			<TouchableOpacity style={styles.registerbutton} onPress={handleRegisterUser}> 
				<Text style={styles.registerbuttonText}>No account? Register here</Text> 
			</TouchableOpacity> 
			<TouchableOpacity style={styles.button} onPress={handleLogin}> 
				<Text style={styles.buttonText}>Login</Text> 
			</TouchableOpacity> 
			<TouchableOpacity style={styles.resetbutton} onPress={handleResetPassword}> 
				<Text style={styles.resetbuttonText}>Forgot your password?</Text> 
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
		paddingRight: 280,
		margin: 5,
	},
	input: {
		width: '80%',
		height: 40,
		borderColor: '#000',
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
		fontSize: 14,
	},
	registerbutton: {
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	registerbuttonText: {
		color: '#000',
		fontSize: 10,
		textDecorationLine: 'underline',
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
	resetbutton: {
		backgroundColor: '#fff',
		alignItems: 'center',
		marginTop: 5,
	},
	resetbuttonText: {
		color: '#000',
		fontSize: 10,
		textDecorationLine: 'underline',
	},
});

export default LoginScreen;
export const mobile = "mobile";
