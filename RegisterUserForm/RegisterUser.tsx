import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

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
    
    const registerUser = () => { 
        // Implement registration logic here 
        // update user info into database
        // if valid format, call handleRegistered to navigate back to login screen to re-login
        //if (condition)
        handleRegistered();      
    }; 
    const handleRegistered = () => { 
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
