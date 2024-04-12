import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal } from 'react-native';

import { writeUserData } from './../App';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, update, child } from "firebase/database";
// import { updateCurrentUser } from 'firebase/auth';

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
    'Cycle Savvy': undefined;	    // REGISTER WILL REDIRECT USER TO VERIFICATION PAGE
};
  
type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface Props {
    navigation: ScreenNavigationProp;
}

const RegisterUserScreen = ({navigation}:Props) => { 
    const [mobile, setMobile] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [confirmPw, setConfirmPw] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState('Select a security question.');
    const [securityAnswer, setSecurityAnswer] = useState('');

    var userExist: null = null;
    // var mobileCount = 0;

    // const countChar = () => {
    //     mobileCount++;
    // }
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    const handleOptionSelect = (option: any) => {
        setSecurityQuestion(option);
        toggleDropdown();
    };
    
    const getUserMobile = (mobile: string) => {  
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${mobile}`)).then((snapshot) => {   // CHECK FOR EXISTING USERS
            if (snapshot.exists()) 
                userExist = true;
            else 
                userExist = false;
        });
    }
    
    const registerUser = () => { 
        setTimeout(function() {
        if (!mobile || !password || !confirmPw || securityQuestion === "Select a security question." || !securityAnswer)      // IF ALL FIELDS ARE FILLED, CHECK FOR
            Alert.alert('Error', 'There cannot be an empty field.');
        else {
            getUserMobile(mobile);      
            if (mobile.length == 8) {  
                if (!userExist) {                  // IF USER MOBILE NOT IN DATABASE, WRITE FOLLOWING:
                    if (password.length >= 6) {                 // IF PW MEETS LENGTH REQUIREMENTS
                        if (password === confirmPw) {           // IF PW MATCHES
                            // regMobile = mobile;
                            // regPassword = password;
                            // regQuestionType = securityQuestion;
                            // regAnswer = securityAnswer;                                                      
                            handleRegistered();  

                        } else Alert.alert('Error', 'Passwords do not match. Try again.');
                    } else Alert.alert('Error', 'Password must be at least 6 characters long.');
                } else Alert.alert('Error', 'Number is registered to an existing account.');
            } else Alert.alert('Error', 'Invalid number.');
        }
        userExist = null;
        }, 500); 

        // Show him the code submission form
        // We will handle the verification code ourselves

        // The user has submitted the code
        // let result = await textflow.verifyCode("+11234567890", "USER_ENTERED_CODE"); 
        // if result.valid is true, then the phone number is verified. 
    }; 
    
    const handleRegistered = () => { 
        // global.loginVal = false;
        console.log('Registered! Verifying user...');   // REDIRECT TO VERIFICATION PAGE
        writeUserData(mobile, password, securityQuestion, securityAnswer);
        // console.log(mobile, password, securityQuestion, securityAnswer);
        navigation.replace('Cycle Savvy');
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
                // onChange={countChar}
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
                maxLength={20}      // 20 CHAR MAX
            /> 
            <TextInput 
                style={styles.input} 
                placeholder="Confirm Password" 
                placeholderTextColor="#808080" 
                secureTextEntry 
                onChangeText={setConfirmPw} 
                value={confirmPw}
                maxLength={20}      // 20 CHAR MAX
            /> 

            <TouchableOpacity style={styles.securityBox}onPress= {toggleDropdown}>
                <Text style={styles.securityheader}>{securityQuestion}</Text>
            </TouchableOpacity>
            <Modal visible={showDropdown} animationType="slide">
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity onPress={() => handleOptionSelect("What is your mother's maiden name?")}>
                        <Text style={styles.questions}>What is your mother's maiden name?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleOptionSelect("What model was your first car?")}>
                        <Text style={styles.questions}>What model was your first car?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleOptionSelect("Which city did you grow up in?")}>
                        <Text style={styles.questions}>Which city did you grow up in?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleOptionSelect("Who is your childhood best friend?")}>
                        <Text style={styles.questions}>Who is your childhood best friend?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleOptionSelect("What is your favourite color?")}>
                        <Text style={styles.questions}>What is your favourite color?</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <TextInput 
                style={styles.securityAns} 
                placeholder="Type here ..." 
                placeholderTextColor="#808080" 
                onChangeText={setSecurityAnswer} 
                value={securityAnswer}
                textAlign='center'
                maxLength={32}      // 32 CHAR MAX
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
        paddingBottom: 2,
        marginBottom: 5,
    },
    header: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 300,
        height: 200,
    },
    action: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        paddingRight: 270,
        margin: 5,
        marginTop: 2,
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
    securityBox: {
        width: '80%',
        alignItems: 'center',
        height: 30,
        borderColor: '#00000000',
        backgroundColor: '#48c289',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 4,
        marginTop: 5,
    },
    securityheader: {
        color: 'white', 
        fontSize: 15,
        fontWeight: 'bold',
    },
    questionDisplay: {
        width: '80%',
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 14,
        marginBottom: 5,
    },
    dropdownContainer: {
        marginTop: 100,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    questions: {
        color: '#000',
        fontSize: 18,
        marginBottom: 20,
    },
    securityAns: {
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
