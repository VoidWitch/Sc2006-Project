import 'react-native-gesture-handler';    //navigation stack, include at top
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import type {PropsWithChildren} from 'react';


// FIREBASE (DATABASE)

// install firebase to root of project directory, $ npm install firebase

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

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

export function writeUserData(mobile: string, password: string) {
  const db = getDatabase();
  const reference = ref(db, 'users/' + mobile);
  set(reference, {
    password: password
  });
}


//Component Forms
import Login from './LoginForm/Login'
import ResetPw from './ResetPwForm/ResetPw';
import Verification from './VerificationForm/Verification';
import RegisterUser from './RegisterUserForm/RegisterUser';
import Addresses from './AddressesForm/Addresses';
import FAQ from './FAQForm/FAQ';
import PrivacyConcerns from './PrivacyForm/PrivacyConcerns';
import Map from './MapForm/Map';

const Stack = createStackNavigator();

// type SectionProps = PropsWithChildren<{
//     title: string;
// }>;

function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
            <Stack.Screen name="Register User" component={RegisterUser} />
            <Stack.Screen name="Reset Password" component={ResetPw} />
            <Stack.Screen name="Verification" component={Verification} options={{ headerShown: false }}/>

            <Stack.Screen name="Saved Addresses" component={Addresses} />
            <Stack.Screen name="FAQ" component={FAQ} />
            <Stack.Screen name="Privacy Concerns" component={PrivacyConcerns} />
            <Stack.Screen name="Cycle Savvy" component={Map} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;