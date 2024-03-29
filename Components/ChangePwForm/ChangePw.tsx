import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'; 
import { mobile } from '../LoginForm/Login';

type RootStackParamList = {
	// Add other screens if needed
	'Cycle Savvy': undefined;
};
  
type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface Props {
	navigation: ScreenNavigationProp;
}

const ChangePwScreen = ({navigation}:Props) => {
    const [newPassword, setNewPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 

    const validateInput = () => { 
        // Basic validation 
        if (newPassword !== confirmPassword) { 
        Alert.alert('Error', 'The new passwords do not match.'); 
        return false; 
        }
        if (newPassword.length < 6) { 
        Alert.alert('Error', 'Password must be at least 6 characters long.'); 
        return false; 
        }

        //implement logic here
        // Here you would send the request to your backend to reset the password 
        // For example: updatePassword(mobile, newPassword) -> the mobile number for the user is
        //imported here so u can refer to it when resetting in the database
        
        return true;
    }; 

    const handleChangePassword = () => { 
        if (!validateInput()) {     // new pw not updated in database
            return; 
        }
        console.log('Changing password for mobile number: ', mobile); 

        // Show a success message and navigate to main screen to register upon successful reset 
        Alert.alert('Success', 'Your password has been changed.');
        navigation.reset({ index: 7, routes: [{ name: 'Cycle Savvy' }] })
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
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}> 
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