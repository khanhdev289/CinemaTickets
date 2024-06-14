import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavication from './src/screens/other/BottomNavication';
import SignInScreen from './src/screens/start/SignInScreen';
import SignUpScreen from './src/screens/start/SignUpScreen';
import ComfirmOTP from './src/screens/start/ComfirmOTP';
import WelcomeScreen from './src/screens/start/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
          name="Register"
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Otp"
          component={ComfirmOTP}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
