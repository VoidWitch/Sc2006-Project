import React, { useState } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native'; 
 
const LoginScreen = () => { 
	const [mobile, setMobile] = useState(''); 
	const [password, setPassword] = useState(''); 
	
	const handleLogin = () => { 
		console.log('Logging in with:', mobile, password); 
	}; 
	
	const handleResetPassword = () => { 
		console.log('Resetting password...'); 
	}; 
	
	const handleRegisterUser = () => { 
		console.log('Registering user...'); 
	}; 
 
	return ( 
		<KeyboardAvoidingView 
		style={{ flex: 1 }} 
		behavior={Platform.OS === "ios" ? "padding" : "height"} 
		keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} 
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
			/> 
			<TextInput 
				style={styles.input} 
				placeholder="Password" 
				placeholderTextColor="#808080" 
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
