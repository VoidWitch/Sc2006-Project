import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginScreen = () => {
	const [mobile, setMobile] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = () => {
		// Here you can implement your login logic
		console.log('Logging in with:', mobile, password);
		// Example: You can send login request to your backend API
		//implement login logic
		/*
		if mobile number in database and password matches, then allow login, else
		display incorrrect mobile number or password and prompt user for login credential again.
		after 3 attempts, prompt user to reset password*/

	};

	const handleResetPassword = () => {
		//implement reset pw logic
		console.log('Resetting password...');
		
	}

	const handleRegisterUser = () => {
		//implement register user logic
		//console.log('Registering user...');
	}

	return (
		<View style={styles.container}>
		<View style={styles.container1}>
			<Text style={styles.header}>Welcome Back!</Text>
		</View>
		<Text style={styles.imagetitle}>SG Cycle Savvy</Text>
		<Image source={require('./Logo.png')} style={styles.image} />
		<Text style={styles.imagecaption}>Pedal any weather.</Text>
		<Text style={styles.action}>Login:</Text>
		<TextInput
			style={styles.input}
			placeholder="Mobile"
			placeholderTextColor = '#48c289'
			keyboardType="number-pad"
			onChangeText={setMobile}
			value={mobile}
		/>
		<TextInput
			style={styles.input}
			placeholder="Password"
			placeholderTextColor = '#48c289'
			secureTextEntry
			onChangeText={setPassword}
			value={password}
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
	},
	image: {
		width: 250,
		height: 170,
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
		backgroundColor: 'blue',
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