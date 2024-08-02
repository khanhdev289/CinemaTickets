import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavication from './src/screens/other/BottomNavication';
import SignInScreen from './src/screens/start/SignInScreen';
import SearchScreen from './src/screens/home/SearchScreen';
import MovieDetailScreen from './src/screens/home/MovieDetailScreen';
import MyTicketScreen from './src/screens/ticket/MyTicketScreen';
import SignUpScreen from './src/screens/start/SignUpScreen';
import ComfirmOTP from './src/screens/start/ComfirmOTP';
import WelcomeScreen from './src/screens/start/WelcomeScreen';
import ChangePassScreen from './src/screens/other/ChangePassScreen';
import ProfileScreen from './src/screens/home/ProfileScreen';
import MovieScreen from './src/screens/home/MovieScreen';
import MovieByGenre from './src/screens/home/MovieByGenre';
import SuccessScreen from './src/screens/start/SuccessScreen ';

import ScanQrScreen from './src/screens/staff/ScanQrScreen';
import AuthScreen from './src/screens/staff/AuthScreen';
import UpdateUserScreen from './src/screens/other/UpdateUserScreen';
import ForgotPassScreen from './src/screens/start/ForgotPassScreen';
import NewPassScreen from './src/screens/start/NewPassScreen';
import TicketScreen from './src/screens/ticket/TicketsScreen';
import CheckSuccess from './src/screens/staff/CheckSuccess';
import SelectSeatScreen from './src/screens/home/SelectSeatScreen';
import PaymentScreen from './src/screens/home/PaymentScreen';
import {StripeProvider} from '@stripe/stripe-react-native';
import {AuthProvider} from './src/components/AuthProvider ';

import WelComeNew from './src/screens/start/WelComeNew';
import DiscountDetailScreen from './src/screens/home/DiscountDetailScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StripeProvider publishableKey="pk_test_51PNdpDDbcfrQz51XX1abFbkrZH4yagcpYDWPNRrA8ursSgjR1LCRAPh5TFqjPsYKcgsnSPEu5BWMSvW20lYqwVEy00ludlggnR">

          <Stack.Navigator initialRouteName="WelComeNew">

            <Stack.Screen
              name="Home"
              component={BottomNavication}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={SignInScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SearchScreeen"
              component={SearchScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MovieDetailScreen"
              component={MovieDetailScreen}
              options={{headerShown: false}}
            />
             <Stack.Screen
              name="DiscountDetailScreen"
              component={DiscountDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SelectSeatScreen"
              component={SelectSeatScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChangePassScreen"
              component={ChangePassScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MyTickets"
              component={MyTicketScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TicketScreen"
              component={TicketScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MovieByGenre"
              component={MovieByGenre}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Ss"
              component={SuccessScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={SignUpScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Otp"
              component={ComfirmOTP}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ScanQrScreen"
              component={ScanQrScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AuthScreen"
              component={AuthScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UpdateUserScreen"
              component={UpdateUserScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="forgotPassword"
              component={ForgotPassScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NewPassScreen"
              component={NewPassScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CheckSuccess"
              component={CheckSuccess}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MovieScreen"
              component={MovieScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WelComeNew"
              component={WelComeNew}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </StripeProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}
