import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'; 

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, update, child } from "firebase/database";
import { updateUserData } from './../App';

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
    'Login': undefined;
};
  
type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface Props {
    navigation: ScreenNavigationProp;
}

const ResetPasswordScreen = ({navigation}:Props) => { 
    const [mobile, setMobile] = useState(''); 
    const [newPassword, setNewPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 

    var userExist: boolean | null = null;

    const getUserData = (mobile: string) => {
        const fetchData = async () => {
            const dbRef = ref(getDatabase());
            const snapshot = await get(child(dbRef, `users/${mobile}`));
            if (snapshot.exists()) {    // IF USER EXISTS
                userExist = true;
            } else {
                console.log('Error, user not found');
            }
        };
        fetchData();
    }

    const validateInput = () => {
        getUserData(mobile);
        setTimeout(function() {
            if (!userExist) {        // IF USER DOES NOT EXIT
                Alert.alert('Error', 'No existing user.');
            }
            else if (newPassword.length < 6) {      // PW DOES NOT MEET MINIMUM REQUIREMENTS
                Alert.alert('Error', 'Password must be at least 6 characters long.');
            }
            else if (newPassword !== confirmPassword) {
                Alert.alert('Error', 'The new passwords do not match.');
            }
            else {
                updateUserData(mobile, newPassword);
                handleResetPassword();
            }
        }, 500);
        userExist = null;
    }

    const handleResetPassword = () => {
        Alert.alert('Success', 'Your password has been reset. Please log in with your new password.');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] })     // REDIRECT TO LOGIN PAGE
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
				<Text style={styles.header}>Password Reset</Text> 
			</View> 
            <Text style={styles.instructions}>Please enter a new password.</Text> 
            <Text style={styles.requirements}>Password must be at least 6 characters long.</Text> 
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
                placeholder="New Password" 
                placeholderTextColor="#808080" 
                secureTextEntry 
                onChangeText={setNewPassword} 
                value={newPassword}
                maxLength={20}      //max 20 char
            /> 
            <TextInput 
                style={styles.input} 
                placeholder="Confirm New Password" 
                placeholderTextColor="#808080" 
                secureTextEntry 
                onChangeText={setConfirmPassword} 
                value={confirmPassword}
                maxLength={20}      //max 20 char
            /> 
            <TouchableOpacity style={styles.button} onPress={validateInput}> 
                <Text style={styles.buttonText}>Reset Password</Text> 
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
    instructions: {
		color: '#000',
		fontSize: 19,
		fontWeight: 'bold',
        marginTop: 50,
        paddingRight: 70,
  	}, 
    requirements: {
		color: '#000',
		fontSize: 12,
		fontStyle: 'italic',
		marginBottom: 20,
        paddingRight: 93,
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
}); 
 
export default ResetPasswordScreen;