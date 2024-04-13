//  AIzaSyDlRXMUhwmnCmDXpntaFkL66-vI6cMxWrY   -- Google Maps API key

import Toast from 'react-native-toast-message';

import 'react-native-gesture-handler';    //navigation stack, include at top
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import type {PropsWithChildren} from 'react';


// FIREBASE (DATABASE)

// install firebase to root of project directory, $ npm install firebase

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, update, child } from "firebase/database";
import { mobile } from './Components/LoginForm/Login';

var loginVal = null;
global.loginVal = loginVal;

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

export function updateUserAnswer(mobile: string, password: string, question: string, answer: string) {
  const db = getDatabase();
  set(ref(db, 'users/' + mobile), {
    password: password,
    questionType: question,
    answer: answer
  });
}

///////////////////////////////////////////////////////

var json = {};

async function handleSearch() {
  //Constants and api
  const apiUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BicycleParkingv2';
  const accKey = 'xvBW6rA6TyGTNQlS8tK0Vg=='
  const shelterIndicator = "placeholder"; //to be fixed later

  const params = new URLSearchParams({
      Lat: '1.3521',
      Long: '103.8198',
      Dist: '3', // Default radius in kilometers. Can change if needed.
  });

  // Implementation logic for bicycle search
  // Call filterSearch and get both filteredResults and searchCoordinates
  
  //get a json of the filtered lots based on if got shelter or no shelter

  try {
      // Make the API request using fetch with the SDK key in the Authorization header
      const response = await fetch(apiUrl + "?" + params.toString(), {
        headers: {
          'AccountKey' : accKey
        }
      });

      console.log(await response.json());

      // Check if the request was successful
      
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      // Parse the response as JSON
      const data = await response.json();

      // Filter the results based on user input
      const filteredResults = data.value.filter(parkingLot => {
          return parkingLot.ShelterIndicator === shelterIndicator;
      });

      // Display the filtered results
      // console.log("95" + filteredResults);

  } catch (err) {
    // console.log(err);
  }
}

json = handleSearch();


////////////////////////////////////////////////////


//Component Forms
import Login from './Components/LoginForm/Login'
import ResetPw from './Components/ResetPwForm/ResetPw';
import Verification from './Components/VerificationForm/Verification';
import RegisterUser from './Components/RegisterUserForm/RegisterUser';
import Addresses from './Components/AddressesForm/Addresses';
import FAQ from './Components/FAQForm/FAQ';
import PrivacyConcerns from './Components/PrivacyForm/PrivacyConcerns';
import Map from './Components/MapForm/Map';
import ChangePw from './Components/ChangePwForm/ChangePw';
import { sendPasswordResetEmail } from 'firebase/auth';

const Stack = createStackNavigator();

// type SectionProps = PropsWithChildren<{
//     title: string;
// }>;

function App(): React.JSX.Element {
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
        <Toast/>
      </>
    );
}

export default App;
