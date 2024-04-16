import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, update, child, remove } from "firebase/database";

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

const app = initializeApp(firebaseConfig);

/**
 * Writes user data to the Firebase database.
 * 
 * @param {string} mobile - The mobile number of the user.
 * @param {string} password - The password of the user.
 * @param {string} questionType - The type of security question.
 * @param {string} answer - The answer to the security question.
 */
export function writeUserData(mobile: string, password: string, questionType: string, answer: string) {
  const db = getDatabase();
  const reference = ref(db, 'users/' + mobile);
  set(reference, {
    password: password,
    questionType : questionType,
    answer: answer,
  });
}

/**
 * Updates user data in the Firebase database.
 * 
 * @param {string} mobile - The mobile number of the user.
 * @param {string} password - The new password.
 */
export function updateUserData(mobile: string, password: string) {
  const db = getDatabase();
  const userRef = ref(db, 'users/' + mobile);
  update(userRef, {
    password: password,
  }).then(() => {
    console.log(mobile, password);
    console.log('Password updated successfully.');
  }).catch((error) => {
    console.error('Error updating password:', error);
  });
}

import Login from './LoginForm/Login'
import ResetPw from './ResetPwForm/ResetPw';
import Verification from './VerificationForm/Verification';
import RegisterUser from './RegisterUserForm/RegisterUser';
import Addresses from './AddressesForm/Addresses';
import FAQ from './FAQForm/FAQ';
import PrivacyConcerns from './PrivacyForm/PrivacyConcerns';
import Map from './MapForm/Map';
import ShareRide from './ShareRideForm/ShareRide'
import ChangePw from './ChangePwForm/ChangePw';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
    /**
     * useEffect hook to delete all user entries when the component unmounts.
     */
    useEffect(() => {
        return () => {
            const db = getDatabase();
            const reference = ref(db, 'users');
            remove(reference).then(() => {
                console.log('Entries deleted successfully.');
            })
            .catch((error) => {
                console.error('Error deleting entries:', error);
            });
        };
    }, []);
    
    return (
      <>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
            <Stack.Screen name="Register User" component={RegisterUser} />
            <Stack.Screen name="Reset Password" component={ResetPw} />
            <Stack.Screen name="Verification" component={Verification} options={{ headerShown: false }}/>
            <Stack.Screen name="Saved Addresses" component={Addresses} />
            <Stack.Screen name="FAQ" component={FAQ} />
            <Stack.Screen name="Privacy Concerns" component={PrivacyConcerns} />
            <Stack.Screen name="Change Password" component={ChangePw} />
            <Stack.Screen name="Cycle Savvy" component={Map} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
      </>
    );
}

export default App;
