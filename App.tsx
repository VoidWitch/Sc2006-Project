import 'react-native-gesture-handler';    //navigation stack, include at top
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import type {PropsWithChildren} from 'react';

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

