//  AIzaSyDlRXMUhwmnCmDXpntaFkL66-vI6cMxWrY   -- Google Maps API key

import 'react-native-gesture-handler';    //navigation stack, include at top
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';

// FIREBASE (DATABASE)
// install firebase to root of project directory, $ npm install firebase

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export function writeUserData(mobile: string, password: string, questionType: string, answer: string) {
  const db = getDatabase();
  const reference = ref(db, 'users/' + mobile);
  set(reference, {
    password: password,
    questionType : questionType,
    answer: answer,
  });
}

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

//Component Forms
import Login from './Components/LoginForm/Login'
import ResetPw from './Components/ResetPwForm/ResetPw';
import Verification from './Components/VerificationForm/Verification';
import RegisterUser from './Components/RegisterUserForm/RegisterUser';
import Addresses from './Components/AddressesForm/Addresses';

import FAQ from './Components/FAQForm/FAQ';
import PrivacyConcerns from './Components/PrivacyForm/PrivacyConcerns';
import Map from './Components/MapForm/Map';    // CHANGE BACK TO MAP LATER THIS IS THE WRONG SCREEN
import ShareRide from './Components/ShareRideForm/ShareRide'
import ChangePw from './Components/ChangePwForm/ChangePw';


const Stack = createStackNavigator();

function App(): React.JSX.Element {

    // IF WANT TO MAINTAIN USER ENTRIES, COMMENT OUT THIS FUNCTION
    useEffect(() => {     // DELETE ALL USER ENTRIES WHEN COMPONENT UNMOUNTS
        return () => {
            const db = getDatabase();
            const reference = ref(db, 'users'); // REFERENCE TO USERS NODE TO CLEAR ENTRIES
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