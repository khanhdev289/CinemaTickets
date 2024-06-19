import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavication from './src/screens/other/BottomNavication';
import SignInScreen from './src/screens/start/SignInScreen';
import SearchScreen from './src/screens/home/SearchScreen';
import MovieDetailScreen from './src/screens/home/MovieDetailScreen';
import MyTicketScreen from './src/screens/home/MyTicketScreen';
import SignUpScreen from './src/screens/start/SignUpScreen';
import ComfirmOTP from './src/screens/start/ComfirmOTP';
import WelcomeScreen from './src/screens/start/WelcomeScreen';
import ChangePassScreen from './src/screens/other/ChangePassScreen';
import ProfileScreen from './src/screens/home/ProfileScreen';
import TicketScreen from './src/screens/home/TicketScreen';

import SuccessScreen from './src/screens/start/SuccessScreen ';
import {AuthProvider} from './src/components/AuthProvider ';

import ScanQrScreen from './src/screens/staff/ScanQrScreen';
import AuthScreen from './src/screens/staff/AuthScreen';
import UpdateUserScreen from './src/screens/other/UpdateUserScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
