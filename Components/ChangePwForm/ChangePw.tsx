import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useEffect, useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'; 
import { regMobile } from '../LoginForm/Login';

import { updateUserData } from './../App';
import { child, get, getDatabase, ref } from 'firebase/database';

type RootStackParamList = {
	'Cycle Savvy': undefined;
};
  
type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface Props {
	navigation: ScreenNavigationProp;
}

const ChangePwScreen = ({navigation}:Props) => {
    const [newPassword, setNewPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            const dbRef = ref(getDatabase());
            const snapshot = await get(child(dbRef, `users/${regMobile}`));
            if (snapshot.exists()) {        // USER EXISTS
                const userData = snapshot.val();
                setPassword(userData.password);
                // console.log({regMobile});
                const string = {regMobile};
                setMobile(string.regMobile);        // IGNORE
                // console.log('User exists ', mobile, password);
            } else {
                console.log('Error, user not found');
            }
        };
        fetchData();
    }, []);

    const validateInput = () => {
        if (newPassword.length < 6) {       // MINIMUM PW LENGTH REQUIREMENT
            Alert.alert('Error', 'Password must be at least 6 characters long.'); 
        }
        if (password === newPassword) {
            Alert.alert('Error', 'Password cannot be the same as the previous one.'); 
        }
        if (newPassword !== confirmPassword) {      // PW DO NOT MATCH
            Alert.alert('Error', 'The new passwords do not match.'); 
        }
        console.log('Changing ', mobile, 'to ', newPassword);
        updateUserData(mobile, newPassword);        // NEW PW VALIDATED AND UPDATED INTO FIREBASE
        handleChangePassword();
    }; 

    const handleChangePassword = () => { 
        console.log('Password changed successfully!');
        Alert.alert('Success', 'Your password has been changed.');
        navigation.reset({ index: 9, routes: [{ name: 'Cycle Savvy' }] })   // REDIRECT TO MAIN PAGE
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
				<Text style={styles.header}>A new password every few months keeps the hacker away...</Text> 
			</View> 
            <Text style={styles.instructions}>Please enter a new password.</Text> 
            <Text style={styles.requirements}>Password must be at least 6 characters long.</Text> 
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
                <Text style={styles.buttonText}>Change Password</Text> 
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
 
export default ChangePwScreen;
