
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavication from './src/screens/other/BottomNavication';
import SignInScreen from './src/screens/start/SignInScreen';
import SearchScreeen from './src/screens/home/SearchScreen';
import MovieDetailScreen from './src/screens/home/MovieDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen
          name="Home"
          component={BottomNavication}
          options={{headerShown: false}}
        
        />
        <Stack.Screen
          name="Login"
          component={SignInScreen}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name = "SearchScreeen"
          component= {SearchScreeen}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name = "MovieDetailScreen"
          component= {MovieDetailScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
