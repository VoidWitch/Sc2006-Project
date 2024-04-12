import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert } from 'react-native';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, update, child } from "firebase/database";

// import loginVal from './../App';
// import regMobile from '../RegisterUserForm/RegisterUser'
// import regPassword from '../RegisterUserForm/RegisterUser'
// import regAnswer from '../RegisterUserForm/RegisterUser'
// global.regMobile = null;

export var regMobile = null;
export var regPassword = null;
export var regQuestionType = null;
export var regAnswer = null;

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

// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);

type RootStackParamList = {
	'Reset Password': undefined;	// RESET PW SCREEN
	'Verification': undefined;		// LOGIN REDIRECTS TO VERIFICATION SCREEN
	'Register User': undefined;		// REGISTER NEW USER SCREEN
};

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
	navigation: ScreenNavigationProp;
}

const getUserMobile = (mobile: string): Promise<string | null> => {
	return new Promise((resolve, reject) => {
		const dbRef = ref(getDatabase());
		get(child(dbRef, `users/${mobile}`)).then((snapshot) => {
			if (snapshot.exists()) {
				resolve(mobile);
			} else {
				resolve(null); // or resolve(undefined);
			}
		}).catch((error) => {
			console.error('Error checking user existence:', error);
			reject(error);
		});
	});
}

const getUserPassword = (mobile: string): Promise<string | null> => {
	return new Promise((resolve, reject) => {
		const dbRef = ref(getDatabase());
		get(child(dbRef, `users/${mobile}`)).then((snapshot) => {
			if (snapshot.exists()) {
				const userData = snapshot.val();
				const password = userData.password; // Assuming password is stored under 'password' key
				resolve(password);
			} else {
				resolve(null); // Resolve with null if user does not exist
			}
		}).catch((error) => {
			reject(error); // Reject the promise if there's an error fetching data from Firebase
		});
	});
}

const LoginScreen = ({ navigation }: Props) => {
	const [mobile, setMobile] = useState('');
	const [inputPassword, setText] = useState('');
	// var userExist: boolean | null = null;
	// var userProp = {};

	const handleLogin = () => {
		// console.log(global.loginVal);
		// global.loginVal = true;
		// console.log(getUserMobile(mobile), getUserPassword(mobile), getUserSecurityQuestion(mobile), getUserSecurityAnswer(mobile));

		setTimeout(function () {
			// CHECK FOR EMPTY FIELDS
			if (!mobile || !inputPassword) {		// IF BOTH FIELDS ARE FILLED, CHECK FOR
				Alert.alert('Error', 'There cannot be an empty field.');
			}
			else {
				getUserMobile(mobile).then((mobile) => {
					if (mobile) {
						console.log('User exists with mobile number:', mobile);
						getUserPassword(mobile).then((password) => {
							if (password === inputPassword) {
								console.log('Password matches');
								regMobile = mobile;		//necessary
								regPassword = inputPassword;	//necessary
								navigation.replace('Verification');
							} else {
								Alert.alert('Error', 'Incorrect password. Try again.');
							}
						})
					} else {
						Alert.alert('Error', 'No account found.');
					}
				})/*.catch((error) => {
					console.error('Error:', error);
				});*/
			}
		}, 500);
	};

	const handleResetPassword = () => {
		console.log('Resetting password...');
		navigation.navigate('Reset Password');		// NAVIGATE TO RESET PW INTERFACE
	};

	const handleRegisterUser = () => {
		console.log('Registering user...');
		navigation.navigate('Register User');		// NAVIGATE TO REGISTRATION INTERFACE
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
						maxLength={20}		// 20 CHAR MAX
						onChangeText={setText}
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
