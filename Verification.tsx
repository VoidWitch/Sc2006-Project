import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'; 
 
const PhoneVerificationScreen = () => { 
    const [code, setCode] = useState(''); 
    const [timer, setTimer] = useState(60); 
    
    useEffect(() => { 
        // Start the countdown 
        const interval = setInterval(() => { 
        setTimer(prevTimer => prevTimer > 0 ? prevTimer - 1 : 0); 
        }, 1000); 
    
        // Clean up the interval on component unmount 
        return () => clearInterval(interval); 
    }, []); 
    
    const handleVerify = () => { 
        console.log('Verifying code:', code); 
        // Add your verification logic here check otp that has been sent upon correct login details

    }; 
    
    const handleResendCode = () => { 
        console.log('Resending code...'); 
        setTimer(60); // Reset the timer 
        // Add logic to resend the verification code if need, right now only resend option available after 1 min

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
				<Text style={styles.header}>Verification</Text> 
			</View>
            <Text style={styles.instruction}>Please verify your account</Text>  
            <Text style={styles.description}>Please enter the verification code sent to your phone.</Text> 
            <TextInput 
                style={styles.input} 
                placeholder="Verification Code" 
                placeholderTextColor="#808080" 
                keyboardType="number-pad" 
                onChangeText={setCode} 
                value={code} 
                maxLength={6} 
            /> 
            <TouchableOpacity style={styles.button} onPress={handleVerify}> 
                <Text style={styles.buttonText}>Verify</Text> 
            </TouchableOpacity> 
            <Text style={styles.timerText}>{`Time remaining: ${timer} seconds`}</Text> 
            {timer === 0 && ( 
                <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}> 
                <Text style={styles.resendButtonText}>Resend Code</Text> 
                </TouchableOpacity> 
            )} 
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
        marginTop: 50,
        paddingRight: 95,
  	}, 
    description: { 
        color: '#000',
		fontSize: 12,
		fontStyle: 'italic',
		marginBottom: 20,
        paddingRight: 48,
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
    timerText: { 
        marginTop: 20, 
        fontSize: 15, 
    }, 
    resendButton: { 
        marginTop: 10, 
    }, 
    resendButtonText: { 
        color: 'blue', 
        fontSize: 15, 
        textDecorationLine: 'underline', 
    }, 
}); 
 
export default PhoneVerificationScreen;