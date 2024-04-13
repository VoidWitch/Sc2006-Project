import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'; 

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, update, child } from "firebase/database";
import {regMobile} from './../LoginForm/Login';

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
    'Cycle Savvy': undefined;	    // SUCCESSFUL VERIFICATION REDIRECTS USER TO MAIN SCREEN
};
  
type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface Props {
    navigation: ScreenNavigationProp;
}

const PhoneVerificationScreen = ({navigation}:Props) => { 
    const [answer, setText] = useState(''); 
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const dbRef = ref(getDatabase());
            const snapshot = await get(child(dbRef, `users/${regMobile}`));
    
            if (snapshot.exists()) {
                const userData = snapshot.val();
                setSecurityQuestion(userData.questionType);
                setSecurityAnswer(userData.answer);
                console.log(userData);
            } else {
                console.log('Error, user data not found');
            }
        };
        fetchData();
    }, []);
    

    const verifyCode = () => {  // VERIFY SECURITY ANS, IGNORE CASE
        if (answer.toLowerCase() === securityAnswer.toLowerCase()) {
            handleVerified();
        }
        else {
            Alert.alert('Wrong answer. Please try again.');
        }
    };

    const handleVerified = () => {
        console.log('Logging in...');
        navigation.replace('Cycle Savvy');      // REDIRECT TO MAIN PAGE
    }

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
            <Text style={styles.instruction}>{securityQuestion}</Text>  
            <Text style={styles.description}>Please answer the question above.</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Please enter ..."
                placeholderTextColor="#808080" 
                onChangeText={newText => setText(newText)}
                defaultValue={answer}
            /> 
            <TouchableOpacity style={styles.button} onPress={verifyCode}> 
                <Text style={styles.buttonText}>Submit</Text> 
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
    instruction: {
		color: '#000',
		fontSize: 19,
		fontWeight: 'bold',
        marginTop: 100,
  	}, 
    description: { 
        color: '#000',
		fontSize: 12,
		fontStyle: 'italic',
		marginBottom: 20,
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
        marginTop: 5, 
    }, 
    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 18, 
    }, 
}); 
 
export default PhoneVerificationScreen;
